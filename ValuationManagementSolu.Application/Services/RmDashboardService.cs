using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Services;

public class RmDashboardService : IRmDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public RmDashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<RmDashboardDataDto> GetRmDashboardDataAsync(string createdBy, string solId)
    {
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var allTransactions = await _unitOfWork.Transactions.GetAllAsync();
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var allCollateral = await _unitOfWork.Collaterals.GetAllAsync();

        var rmFacilities = allFacilities
            .Where(f => f.CreatedBy == createdBy && f.SOLID == solId)
            .ToList();

        var joinedItems = (from f in rmFacilities
                           join t in allTransactions on f.FacilityReference equals t.FacilityReference into txGroup

                           // Left join the collateral table
                           join c in allCollateral on f.FacilityReference equals c.FacilityReference into colGroup
                           from c in colGroup.DefaultIfEmpty() // Flatten group to fetch row contents safely

                           join r in allReports on f.FacilityReference equals r.FacilityRef into reportGroup
                           from r in reportGroup.DefaultIfEmpty()
                           select new
                           {
                               Facility = f,

                               // Pull the charge fees out safely; fallback to 0 if no collateral record exists yet
                               FeesCharged = c != null ? c.FeesCharged : 0m,

                               CustomerPaymentStatus = txGroup.Any(x => x.TransactionType == TransactionType.CustomerFee && x.Status == PaymentStatus.Successful)
                                   ? PaymentStatus.Successful
                                   : txGroup.Any(x => x.TransactionType == TransactionType.CustomerFee && x.Status == PaymentStatus.Declined)
                                       ? PaymentStatus.Declined
                                       : PaymentStatus.UnProcessed,

                               ValuationStatus = f.ValuationStatus,
                               ReportStatus = r != null ? r.reportStatus : (ReportStatus?)null
                           }).ToList();

        // Reusable, strongly-typed mapping expression
        Func<dynamic, RmDashboardFacilitySummaryDto> mapToSummaryDto = x => new RmDashboardFacilitySummaryDto
        {
            FacilityReference = x.Facility.FacilityReference,
            CustomerName = x.Facility.CustomerName,
            AccountNumber = x.Facility.AccountNumber,
            FacilityPurpose = x.Facility.FacilityPurpose,
            CollateralValue = x.Facility.FacilityAmount,
            ValuationChargeFees = x.FeesCharged,
            DateAdded = x.Facility.DateAdded,
            ApprovalStatus = x.Facility.ApprovalStatus.ToString(),
            RejectionComment = x.Facility.RejectionComment,
            PaymentStatus = x.CustomerPaymentStatus.ToString(),
            ValuationStatus = x.ValuationStatus.ToString(),
            ReportStatus = x.ReportStatus != null ? x.ReportStatus.ToString() : "Not Started"
        };

        // 1. Pending with Successful Payment
        var pendingItems = joinedItems
            .Where(x => x.Facility.ApprovalStatus == ApprovalStatus.Pending
                     && x.CustomerPaymentStatus == PaymentStatus.Successful)
            .Select(mapToSummaryDto).OrderByDescending(f => f.DateAdded).ToList();

        // 2. Awaiting Payment (Unpaid, Fresh, and NOT yet assigned to a valuer)
        var awaitingItems = joinedItems
            .Where(x => (x.CustomerPaymentStatus == PaymentStatus.UnProcessed || x.CustomerPaymentStatus == PaymentStatus.Declined)
                     && x.Facility.ApprovalStatus == ApprovalStatus.Pending)
            .Select(mapToSummaryDto).OrderByDescending(f => f.DateAdded).ToList();

        // 3. Rejected (Returned back to RM)
        var rejectedItems = joinedItems
            .Where(x => x.Facility.ApprovalStatus == ApprovalStatus.Rejected)
            .Select(mapToSummaryDto).OrderByDescending(f => f.DateAdded).ToList();

        // 4. Approved & Assigned (Supervisor has attached a valuer!)
        var approvedItems = joinedItems
            .Where(x => x.ValuationStatus == ValuationStatus.Assigned)
            .Select(mapToSummaryDto).OrderByDescending(f => f.DateAdded).ToList();

        // 5. Completed
        var completedItems = joinedItems
            .Where(x => x.ValuationStatus == ValuationStatus.Completed && x.ReportStatus == ReportStatus.Completed)
            .Select(mapToSummaryDto).OrderByDescending(f => f.DateAdded).ToList();

        // 6. Expired (Cancelled)
        var expiredItems = joinedItems
            .Where(x => x.ValuationStatus == ValuationStatus.Cancelled)
            .Select(mapToSummaryDto).OrderByDescending(f => f.DateAdded).ToList();

        // Construct the complete response payload dynamically with inline evaluation
        return new RmDashboardDataDto
        {
            PendingWithSuccessfulPayment = pendingItems,
            AwaitingPayment = awaitingItems,
            Rejected = rejectedItems,
            Approved = approvedItems,
            Completed = completedItems,
            Expired = expiredItems,

            Metrics = new RmDashboardMetricsDto
            {
                PendingWithSuccessfulPaymentCount = pendingItems.Count,
                AwaitingPaymentCount = awaitingItems.Count,
                RejectedCount = rejectedItems.Count,
                ApprovedCount = approvedItems.Count,
                CompletedCount = completedItems.Count,
                ExpiredCount = expiredItems.Count
            }
        };
    }
}