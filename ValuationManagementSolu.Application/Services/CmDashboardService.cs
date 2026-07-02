using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Services;

public class CmDashboardService : ICmDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public CmDashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CmDashboardDataDto> GetCmDashboardDataAsync()
    {
        // 1. Fetch entire data pools
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var allTransactions = await _unitOfWork.Transactions.GetAllAsync();
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var allCollateral = await _unitOfWork.Collaterals.GetAllAsync();


        // 2. Map and correlate records based on FacilityReference
        var joinedItems = (from f in allFacilities
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
                               ValuerId = (c != null && c.ValuerId.HasValue) ? c.ValuerId.Value : 0,
                               // Target Customer Fees specifically for upstream CM processing gatekeeper checks
                               CustomerPaymentStatus = txGroup.Any(x => x.TransactionType == TransactionType.CustomerFee && x.Status == PaymentStatus.Successful)
                                   ? PaymentStatus.Successful
                                   : txGroup.Any(x => x.TransactionType == TransactionType.CustomerFee && x.Status == PaymentStatus.Declined)
                                       ? PaymentStatus.Declined
                                       : PaymentStatus.UnProcessed,
                               // Read the actual status flag cleanly from the facility entity row itself
                               ValuationStatus = f.ValuationStatus,
                               ReportStatus = r != null ? r.reportStatus : (ReportStatus?)null,
                               ReportApprovalStatus = r != null ? r.approvalStatus : ApprovalStatus.Pending
                           }).ToList();

        var dashboardData = new CmDashboardDataDto();

        // Reusable structural projection lambda mapping
        Func<dynamic, CmDashboardFacilitySummaryDto> mapToSummary = x => new CmDashboardFacilitySummaryDto
        {
            FacilityReference = x.Facility.FacilityReference,
            CustomerName = x.Facility.CustomerName,
            AccountNumber = x.Facility.AccountNumber,
            FacilityPurpose = x.Facility.FacilityPurpose,
            CollateralValue = x.Facility.FacilityAmount,
            ValuationFees = x.FeesCharged,
            OpenMarketValue = x.Facility.OpenMarketValue,
            ForceSalesValue = x.Facility.ForceSalesValue,
            InsuranceValue = x.Facility.InsuranceValue,
            ValuerId = x.ValuerId,
            DateAdded = x.Facility.DateAdded,
            FacilityApprovalStatus = x.Facility.ApprovalStatus.ToString(),
            ReportApprovalStatus = x.ReportApprovalStatus.ToString(),
            CustomerPaymentStatus = x.CustomerPaymentStatus.ToString(),
            ValuationStatus = x.ValuationStatus.ToString(),
            ReportStatus = x.ReportStatus != null ? x.ReportStatus.ToString() : "Not Started"
        };

        // Metric 1: FIXED -> Pending Review (Customer paid, but CM has NOT reviewed/approved the facility yet)
        var pendingReviewItems = joinedItems.Where(x =>
            x.CustomerPaymentStatus == PaymentStatus.Successful &&
            x.Facility.ApprovalStatus == ApprovalStatus.Pending &&
            x.ValuationStatus == ValuationStatus.UnAssigned).ToList();
        dashboardData.PendingReview = pendingReviewItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.PendingReviewCount = dashboardData.PendingReview.Count;

        // Metric 2: Approved (Valuation engine is assigned and actively ongoing in field)
        var approvedItems = joinedItems.Where(x => x.ValuationStatus == ValuationStatus.Assigned).ToList();
        dashboardData.Approved = approvedItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.ApprovedCount = dashboardData.Approved.Count;

        // Metric 3: Rejected Facilities
        var rejectedItems = joinedItems.Where(x => x.Facility.ApprovalStatus == ApprovalStatus.Rejected).ToList();
        dashboardData.Rejected = rejectedItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.RejectedCount = dashboardData.Rejected.Count;

        // Metric 4: FIXED -> Awaiting Valuer Assignment (CM HAS approved it, but no valuer is linked yet)
        var awaitingAssignment = joinedItems.Where(x =>
            x.Facility.ApprovalStatus == ApprovalStatus.Approved &&
            x.ValuationStatus == ValuationStatus.UnAssigned).ToList();
        dashboardData.AwaitingValuerAssignment = awaitingAssignment.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.AwaitingValuerAssignmentCount = dashboardData.AwaitingValuerAssignment.Count;

        // Metric 5: Completed (Valuation workflow complete)
        var completedItems = joinedItems.Where(x => x.ValuationStatus == ValuationStatus.Completed).ToList();
        dashboardData.Completed = completedItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.CompletedCount = dashboardData.Completed.Count;

        // Metric 6: Beyond TAT (Stuck in Assigned for more than 5 days)
        var tatLimit = DateTime.UtcNow.AddDays(-5);
        var outsideTat = joinedItems.Where(x =>
            x.ValuationStatus == ValuationStatus.Assigned &&
            x.Facility.DateAdded < tatLimit).ToList();
        dashboardData.BeyondTat = outsideTat.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.BeyondTatCount = dashboardData.BeyondTat.Count;

        // Metric 7: Pending Report Review (Report is uploaded/Reviewing, waiting for final sign-off)
        var pendingReportReviewItems = joinedItems.Where(x => x.ReportStatus == ReportStatus.Reviewing).ToList();
        dashboardData.PendingReportReview = pendingReportReviewItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.PendingReportReviewCount = dashboardData.PendingReportReview.Count;

        return dashboardData;
    }
}