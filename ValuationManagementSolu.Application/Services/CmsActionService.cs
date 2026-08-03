using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.Events;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Services;

public class CmsActionService : ICmsActionService
{
    private readonly IUnitOfWork _unitOfWork;

    public CmsActionService(IUnitOfWork unitOfWork)
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
    public async Task<bool> AssignFacilityAsync(string facilityRef, int valuerId, string valuerName, string Username)
    {
        var collaterals = await _unitOfWork.Collaterals.GetAllAsync();
        var collateral = collaterals.FirstOrDefault(c => c.FacilityReference == facilityRef);
        if (collateral == null)
            throw new KeyNotFoundException($"Collateral reference footprint data context not found for '{facilityRef}'.");

        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null)
            throw new KeyNotFoundException($"Facility reference tracking trace not found for '{facilityRef}'.");

        // 1. Fetch Valuer entity to get ValuerEmail safely
        var valuer = await _unitOfWork.Valuers.GetByIdAsync(valuerId);
        if (valuer == null)
            throw new KeyNotFoundException($"Valuer with ID '{valuerId}' was not found.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // 2. Link valuer variables onto collateral records
            collateral.ValuerId = valuerId;

            // 3. Update Facility Tracking Statuses
            facility.ApprovalStatus = ApprovalStatus.Approved;
            facility.ValuationStatus = ValuationStatus.Assigned;

            // 4. Look up or establish ValuationReport entry
            var reports = await _unitOfWork.ValuationReports.GetAllAsync();
            var report = reports.FirstOrDefault(r => r.FacilityRef == facilityRef);

            if (report == null)
            {
                report = new ValuationReport
                {
                    FacilityRef = facilityRef,
                    Valuer = valuer, // Bind navigation property
                    ValuersName = valuerName,
                    AssignedBy = Username,
                    DateAssigned = DateTime.UtcNow,
                    reportStatus = ReportStatus.Ongoing,
                    approvalStatus = ApprovalStatus.Pending,
                    PaymentStatus = PaymentStatus.UnProcessed
                };
                await _unitOfWork.ValuationReports.AddAsync(report);
            }
            else
            {
                report.Valuer = valuer; // Update navigation property
                report.ValuersName = valuerName;
                report.DateAssigned = DateTime.UtcNow;
                report.reportStatus = ReportStatus.Ongoing;
                report.approvalStatus = ApprovalStatus.Pending;
                _unitOfWork.ValuationReports.Update(report);
            }

            // 5. Stage Outbox Event using valuer.ValuerEmail directly
            var ev = new FacilityAssignedToValuerEvent(
                facilityRef,
                valuerId,
                valuerName,
                valuer.ValuerEmail, // Safe access directly from valuer object
                DateTime.UtcNow
            );

            await StageOutboxEventAsync(facilityRef, ev);

            // 6. Persist and commit
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

    public async Task<bool> CancelFacilityAsync(string facilityRef, string Username)
    {
        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility with reference {facilityRef} not found.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // Transition status to a cancelled/rejected configuration layout context globally
            facility.ApprovalStatus = ApprovalStatus.Rejected;
            facility.ValuationStatus = ValuationStatus.Cancelled;

            var reports = await _unitOfWork.ValuationReports.GetAllAsync();
            var report = reports.FirstOrDefault(r => r.FacilityRef == facilityRef);
            if (report != null)
            {
                report.approvalStatus = ApprovalStatus.Rejected;
                report.AssignedBy = Username;
                
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