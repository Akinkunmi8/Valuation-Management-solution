using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Services;

public class BmDashboardService : IBmDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public BmDashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BmDashboardDataDto> GetBmDashboardDataAsync(string solId)
    {
        // 1. Pull data records globally
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var allTransactions = await _unitOfWork.Transactions.GetAllAsync();
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();

        // 2. Filter solely by the Branch SOLID
        var branchFacilities = allFacilities.Where(f => f.SOLID == solId).ToList();

        // 3. Construct unified relational objects
        var joinedItems = (from f in branchFacilities
                           join t in allTransactions on f.FacilityReference equals t.FacilityReference into txGroup
                           from t in txGroup.DefaultIfEmpty()
                           join r in allReports on f.FacilityReference equals r.FacilityRef into reportGroup
                           from r in reportGroup.DefaultIfEmpty()
                           select new
                           {
                               Facility = f,
                               PaymentStatus = t != null ? t.Status : PaymentStatus.UnProcessed,
                               ValuationStatus = r != null ? f.ValuationStatus : ValuationStatus.Assigned,
                               ReportStatus = r != null ? r.reportStatus : (ReportStatus?)null
                           }).ToList();

        var dashboardData = new BmDashboardDataDto();

        // Standard item mapper lambda
        Func<dynamic, RmDashboardFacilitySummaryDto> mapToSummary = x => new RmDashboardFacilitySummaryDto
        {
            FacilityReference = x.Facility.FacilityReference,
            CustomerName = x.Facility.CustomerName,
            AccountNumber = x.Facility.AccountNumber,
            FacilityPurpose = x.Facility.FacilityPurpose,
            DateAdded = x.Facility.DateAdded,
            ApprovalStatus = x.Facility.ApprovalStatus.ToString(),
            PaymentStatus = x.PaymentStatus.ToString(),
            ValuationStatus = x.ValuationStatus.ToString(),
            ReportStatus = x.ReportStatus != null ? x.ReportStatus.ToString() : "Not Started"
        };

        // Metric 1: Total Pending Payment (Unprocessed or Declined)
        var pendingPay = joinedItems.Where(x => x.PaymentStatus == PaymentStatus.UnProcessed || x.PaymentStatus == PaymentStatus.Declined).ToList();
        dashboardData.PendingPayment = pendingPay.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.TotalPendingPaymentCount = dashboardData.PendingPayment.Count;

        // Metric 2: Total Submitted (Payment Successful, pending structural approval or processing)
        var submittedPay = joinedItems.Where(x => x.PaymentStatus == PaymentStatus.Successful).ToList();
        dashboardData.Submitted = submittedPay.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.TotalSubmittedCount = dashboardData.Submitted.Count;

        // Metric 3: Total Approved
        var approved = joinedItems.Where(x => x.Facility.ApprovalStatus == ApprovalStatus.Approved).ToList();
        dashboardData.Approved = approved.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.TotalApprovedCount = dashboardData.Approved.Count;

        // Metric 4: Total Rejected
        var rejected = joinedItems.Where(x => x.Facility.ApprovalStatus == ApprovalStatus.Rejected).ToList();
        dashboardData.Rejected = rejected.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.TotalRejectedCount = dashboardData.Rejected.Count;

        // Metric 5: Total Completed Facilities
        var completed = joinedItems.Where(x => x.ValuationStatus == ValuationStatus.Completed).ToList();
        dashboardData.Completed = completed.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.TotalCompletedCount = dashboardData.Completed.Count;

        // Metric 6: Beyond TAT (Assigned/Ongoing but older than 5 days and not completed yet)
        var tatCutoff = DateTime.UtcNow.AddDays(-5);
        var outsideTat = joinedItems.Where(x =>
            x.ValuationStatus == ValuationStatus.Assigned &&
            x.Facility.DateAdded != null &&
            x.Facility.DateAdded < tatCutoff).ToList();

        dashboardData.BeyondTat = outsideTat.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.TotalBeyondTatCount = dashboardData.BeyondTat.Count;

        // Leaderboard Calculation: Group completed items by the processing RM
        dashboardData.TopPerformingRMs = joinedItems
            .Where(x => x.ValuationStatus == ValuationStatus.Completed && !string.IsNullOrEmpty(x.Facility.CreatedBy))
            .GroupBy(x => new { x.Facility.CreatedBy, x.Facility.RelationshipManagersPhone })
            .Select(g => new TopRmDto
            {
                RmName = g.Key.CreatedBy!,
                RmPhone = g.Key.RelationshipManagersPhone ?? "N/A",
                CompletedFacilitiesCount = g.Count()
            })
            .OrderByDescending(r => r.CompletedFacilitiesCount)
            .Take(5) // Extract top 5 performing RMs
            .ToList();

        return dashboardData;
    }
}