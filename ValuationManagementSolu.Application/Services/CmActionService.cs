using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.Events;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;
namespace ValuationManagementSolu.Application.Services;

public class CmActionService : ICmActionService
{
    private readonly IUnitOfWork _unitOfWork;

    public CmActionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    private async Task StageOutboxEventAsync<T>(string facilityRef, T eventData) where T : class
    {
        var outboxEntry = new EventOutbox
        {
            Id = Guid.NewGuid(),
            FacilityReference = facilityRef,
            EventType = typeof(T).Name,
            Payload = JsonSerializer.Serialize(eventData),
            IsDispatched = false,
            RetryCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.EventOutbox.AddAsync(outboxEntry);
    }

    public async Task<bool> ApproveFacilityAsync(string facilityRef, string Username)
    {
        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility with reference {facilityRef} not found.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // 1. Update the status tracking fields
            facility.ApprovalStatus = ApprovalStatus.Approved;
            facility.ValuationStatus = ValuationStatus.UnAssigned;
            facility.FacilityReviewBy = Username;

            // 3. Stage the Outbox Event with structural email properties
            var ev = new FacilityApprovedEvent(
            facilityRef,
            facility.FacilityReviewBy,
            facility.CreatedBy,
            DateTime.UtcNow
           );

            await StageOutboxEventAsync(facilityRef, ev);

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return true;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<bool> ApproveReportAsync(string facilityRef, string Username)
    {
        var reports = await _unitOfWork.ValuationReports.GetAllAsync();
        var report = reports.FirstOrDefault(r => r.FacilityRef == facilityRef);
        if (report == null) throw new KeyNotFoundException($"No valuation report tracking log found for reference {facilityRef}.");

        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            report.approvalStatus = ApprovalStatus.Approved;
            report.reportStatus = ReportStatus.Completed;
            report.ReportReviewBy = Username;

            // Generate 48-hour secure token for CMS One-Click approval
            string approvalToken = Guid.NewGuid().ToString("N");

            if (facility != null)
            {
                facility.ValuationStatus = ValuationStatus.Completed;
                facility.CmsPaymentApprovalToken = approvalToken;
                facility.CmsPaymentApprovalTokenExpiry = DateTime.UtcNow.AddHours(48);
            }

            // Stage Outbox Event containing the Approval Token
            var ev = new FacilityReportApprovedEvent(
                facilityRef,
                report.ValuersName ?? "Assigned Valuer",
                report.AssignedBy,
                approvalToken,
                DateTime.UtcNow
            );

            await StageOutboxEventAsync(facilityRef, ev);

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return true;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<bool> ResendCmsApprovalEmailAsync(string facilityRef)
    {
        // 1. Fetch Facility Entity
        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) return false;

        // 2. Fetch Valuation Report Entity
        var reports = await _unitOfWork.ValuationReports.GetAllAsync();
        var report = reports.FirstOrDefault(r => r.FacilityRef == facilityRef);
        if (report == null) return false;

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // 3. Generate a fresh 48-hour approval token
            string newToken = Guid.NewGuid().ToString("N");
            facility.CmsPaymentApprovalToken = newToken;
            facility.CmsPaymentApprovalTokenExpiry = DateTime.UtcNow.AddHours(48);

            _unitOfWork.Facilities.Update(facility);

            // 4. Stage Outbox Event with the fresh Token
            var ev = new FacilityReportApprovedEvent(
                facilityRef,
                report.ValuersName ?? "Assigned Valuer",
                report.AssignedBy,
                newToken,
                DateTime.UtcNow
            );

            await StageOutboxEventAsync(facilityRef, ev);

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();

            return true;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<bool> RejectFacilityAsync(string facilityRef, string Username, string comment)
    {
        if (string.IsNullOrWhiteSpace(comment))
            throw new ArgumentException("A rejection comment must be provided.");

        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility with reference {facilityRef} not found.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            facility.ApprovalStatus = ApprovalStatus.Rejected;
            facility.RejectionComment = comment;
            facility.FacilityReviewBy = Username;

            // 3. Stage the Outbox Event
            var ev = new FacilityRejectedEvent(
            facilityRef,
            Username,
            facility.CreatedBy,
            comment,
            DateTime.UtcNow
        );
            await StageOutboxEventAsync(facilityRef, ev);

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return true;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<bool> RejectReportAsync(string facilityRef, string Username, string comment)
    {
        if (string.IsNullOrWhiteSpace(comment))
            throw new ArgumentException("A rejection comment must be provided.");

        var reports = await _unitOfWork.ValuationReports.GetAllAsync();
        var report = reports.OrderByDescending(r => r.Id).FirstOrDefault(r => r.FacilityRef == facilityRef);
        if (report == null) throw new KeyNotFoundException($"No valuation report tracking log found for reference {facilityRef}.");

        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            report.approvalStatus = ApprovalStatus.Rejected;
            report.reportStatus = ReportStatus.Ongoing;
            report.RejectionComment = comment;
            report.ReportReviewBy = Username;

            if (facility != null)
            {
                facility.ValuationStatus = ValuationStatus.Assigned;
            }

            // 4. Stage the Outbox Event
            var ev = new FacilityReportRejectedEvent(
            facilityRef,
            Username,
            report.Valuer.ValuerEmail,
            comment,
            DateTime.UtcNow
        );
            await StageOutboxEventAsync(facilityRef, ev);

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return true;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}