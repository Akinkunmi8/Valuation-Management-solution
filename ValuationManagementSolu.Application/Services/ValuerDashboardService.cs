using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Services;

public class ValuerDashboardService : IValuerDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public ValuerDashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ValuerDashboardDataDto> GetValuerDashboardDataAsync(int valuerId)
    {
        // 1. Fetch entire foundational repository tables
        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var allTransactions = await _unitOfWork.Transactions.GetAllAsync();
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();

        // 2. Filter down collaterals exclusively assigned to this ValuerId
        var assignedCollateralRefs = allCollaterals
            .Where(c => c.ValuerId == valuerId)
            .Select(c => c.FacilityReference)
            .ToHashSet();

        // 3. Correlate tracking records where the FacilityReference matches the Valuer's footprint
        var joinedItems = (from f in allFacilities
                           where assignedCollateralRefs.Contains(f.FacilityReference)

                           // Group transactions to track Valuer Payout states cleanly
                           join t in allTransactions on f.FacilityReference equals t.FacilityReference into txGroup

                           join r in allReports on f.FacilityReference equals r.FacilityRef into reportGroup
                           from r in reportGroup.DefaultIfEmpty()
                           select new
                           {
                               Facility = f,

                               ValuerPaymentStatus = txGroup.Any(x => x.TransactionType == TransactionType.ValuerPayout && x.Status == PaymentStatus.Successful)
                                   ? PaymentStatus.Successful
                                   : txGroup.Any(x => x.TransactionType == TransactionType.ValuerPayout && x.Status == PaymentStatus.Declined)
                                       ? PaymentStatus.Declined
                                       : PaymentStatus.UnProcessed,

                               ValuationStatus = f.ValuationStatus,
                               ReportStatus = r != null ? r.reportStatus : ReportStatus.NotStarted,

                               // FIXED: Read the ApprovalStatus directly from the Report table (r), default to Pending if not started
                               ReportApprovalStatus = r != null ? r.approvalStatus : ApprovalStatus.Pending
                           }).ToList();

        var dashboardData = new ValuerDashboardDataDto();

        // Universal item transformation factory lambda mapping expression
        Func<dynamic, ValuerDashboardFacilitySummaryDto> mapToSummary = x => new ValuerDashboardFacilitySummaryDto
        {
            FacilityReference = x.Facility.FacilityReference,
            CustomerName = x.Facility.CustomerName,
            AccountNumber = x.Facility.AccountNumber,
            FacilityPurpose = x.Facility.FacilityPurpose,
            CollateralValue = x.Facility.FacilityAmount,
            DateAdded = x.Facility.DateAdded,

            // FIXED: Return the Report's Approval Status back to the frontend card representation
            ApprovalStatus = x.ReportApprovalStatus.ToString(),

            ValuerPaymentStatus = x.ValuerPaymentStatus.ToString(),
            ValuationStatus = x.ValuationStatus.ToString(),
            ReportStatus = x.ReportStatus.ToString()
        };

        // Metric 1: Freshly Assigned (Work hasn't started yet)
        var assigned = joinedItems.Where(x =>
            x.ValuationStatus == ValuationStatus.Assigned &&
            x.ReportStatus == ReportStatus.NotStarted).ToList();
        dashboardData.AssignedFacilities = assigned.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.AssignedFacilityCount = dashboardData.AssignedFacilities.Count;

        // Metric 2: Ongoing Reports (Valuer is working on it)
        var ongoing = joinedItems.Where(x =>
            x.ValuationStatus == ValuationStatus.Assigned &&
            x.ReportStatus == ReportStatus.Ongoing).ToList();
        dashboardData.OngoingReports = ongoing.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.OngoingReportCount = dashboardData.OngoingReports.Count;

        // Metric 3: Awaiting Completed Report (Submitted, Report is under Review, approval is still Pending)
        var awaiting = joinedItems.Where(x =>
            x.ReportStatus == ReportStatus.Reviewing &&
            x.ReportApprovalStatus == ApprovalStatus.Pending).ToList();
        dashboardData.AwaitingCompletedReports = awaiting.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.AwaitingCompletedReportCount = dashboardData.AwaitingCompletedReports.Count;

        // Metric 4: Approved Completed Report (The report has been officially Approved by CM/CMS)
        var approved = joinedItems.Where(x =>
            x.ReportApprovalStatus == ApprovalStatus.Approved).ToList();
        dashboardData.ApprovedCompletedReports = approved.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.ApprovedCompletedReportCount = dashboardData.ApprovedCompletedReports.Count;

        // Metric 5: Returned Report (The report was explicitly Rejected/Returned by the reviewer)
        var returned = joinedItems.Where(x =>
            x.ReportApprovalStatus == ApprovalStatus.Rejected).ToList();
        dashboardData.ReturnedReports = returned.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.ReturnedReportCount = dashboardData.ReturnedReports.Count;

        // Metric 6: Beyond TAT (Assigned but unresolved past your 5-day boundary matrix threshold window)
        var tatLimit = DateTime.UtcNow.AddDays(-5);
        var outsideTat = joinedItems.Where(x =>
            x.ValuationStatus == ValuationStatus.Assigned &&
            x.Facility.DateAdded < tatLimit).ToList();
        dashboardData.BeyondTat = outsideTat.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.BeyondTatCount = dashboardData.BeyondTat.Count;

        return dashboardData;
    }
}