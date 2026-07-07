using System;
using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Services;

public class CmActionService : ICmActionService
{
    private readonly IUnitOfWork _unitOfWork;

    public CmActionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> ApproveFacilityAsync(string facilityRef)
    {
        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility with reference {facilityRef} not found.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // Set the status to Approved so it appears in the Supervisor's "Awaiting Assignment" grid
            facility.ApprovalStatus = ApprovalStatus.Approved;
            facility.ValuationStatus = ValuationStatus.UnAssigned;

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

    public async Task<bool> ApproveReportAsync(string facilityRef)
    {
        var reports = await _unitOfWork.ValuationReports.GetAllAsync();
        var report = reports.FirstOrDefault(r => r.FacilityRef == facilityRef);
        if (report == null) throw new KeyNotFoundException($"No valuation report tracking log found for reference {facilityRef}.");

        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // Update the report tracking parameters
            report.approvalStatus = ApprovalStatus.Approved;
            report.reportStatus = ReportStatus.Completed;

            // Push final approval state to the primary facility if required
            if (facility != null)
            {
                facility.ValuationStatus = ValuationStatus.Completed;
            }

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

    // =========================================================================
    // 1. REJECT FACILITY (CM rejects fresh application back to RM)
    // =========================================================================
    public async Task<bool> RejectFacilityAsync(string facilityRef, string comment)
    {
        if (string.IsNullOrWhiteSpace(comment))
            throw new ArgumentException("A rejection comment must be provided.");

        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility with reference {facilityRef} not found.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // Return to RM's workspace
            facility.ApprovalStatus = ApprovalStatus.Rejected;

            // Save the audit comment on the facility record row
            facility.RejectionComment = comment;

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

    // =========================================================================
    // 2. REJECT REPORT (CM/CMS rejects uploaded report back to Valuer)
    // =========================================================================
    public async Task<bool> RejectReportAsync(string facilityRef, string comment)
    {
        if (string.IsNullOrWhiteSpace(comment))
            throw new ArgumentException("A rejection comment must be provided.");

        var reports = await _unitOfWork.ValuationReports.GetAllAsync();

        // FIX: Always grab the LATEST report entry trace instead of the oldest one
        var report = reports.OrderByDescending(r => r.Id).FirstOrDefault(r => r.FacilityRef == facilityRef);

        if (report == null) throw new KeyNotFoundException($"No valuation report tracking log found for reference {facilityRef}.");

        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // Flag the specific report entry trace as rejected
            report.approvalStatus = ApprovalStatus.Rejected;

            // Revert report progress status so it flags inside the Valuer's workspace panels again
            report.reportStatus = ReportStatus.Ongoing;

            // Save the correction instructions comment directly to the report record track
            report.RejectionComment = comment;

            if (facility != null)
            {
                // Keep facility tracked as Assigned since the valuer is still working on a fix
                facility.ValuationStatus = ValuationStatus.Assigned;
            }

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