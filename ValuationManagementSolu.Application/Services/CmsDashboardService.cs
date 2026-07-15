using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Services;

public class CmsDashboardService : ICmsDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public CmsDashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CmsDashboardDataDto> GetCmsDashboardDataAsync()
    {
        // 1. Ingest base entities out of the storage repository layer
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var allTransactions = await _unitOfWork.Transactions.GetAllAsync();
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var allCollateral = await _unitOfWork.Collaterals.GetAllAsync();

        // 2. Compute the complete combined in-memory domain dataset tracking context
        var joinedItems = (from f in allFacilities
                           join t in allTransactions on f.FacilityReference equals t.FacilityReference into txGroup
                           join c in allCollateral on f.FacilityReference equals c.FacilityReference into colGroup
                           from c in colGroup.DefaultIfEmpty()
                           join r in allReports on f.FacilityReference equals r.FacilityRef into reportGroup
                           from r in reportGroup.DefaultIfEmpty()
                           select new
                           {
                               Facility = f,
                               FeesCharged = c != null ? c.FeesCharged : 0m,
                               ValuerId = (c != null && c.ValuerId.HasValue) ? c.ValuerId.Value : 0,

                               CustomerPaymentStatus = txGroup.Any(x => x.TransactionType == TransactionType.CustomerFee && x.Status == PaymentStatus.Successful)
                                   ? PaymentStatus.Successful
                                   : txGroup.Any(x => x.TransactionType == TransactionType.CustomerFee && x.Status == PaymentStatus.Declined)
                                       ? PaymentStatus.Declined
                                       : PaymentStatus.UnProcessed,

                               ValuerPaymentStatus = txGroup.Any(x => x.TransactionType == TransactionType.ValuerPayout && x.Status == PaymentStatus.Successful)
                                   ? PaymentStatus.Successful
                                   : txGroup.Any(x => x.TransactionType == TransactionType.ValuerPayout && x.Status == PaymentStatus.Declined)
                                       ? PaymentStatus.Declined
                                       : PaymentStatus.UnProcessed,

                               ValuationStatus = f.ValuationStatus,
                               ReportStatus = r != null ? r.reportStatus : (ReportStatus?)null,
                               ReportApprovalStatus = r != null ? r.approvalStatus : ApprovalStatus.Pending
                           }).ToList();

        var dashboardData = new CmsDashboardDataDto();

        // Shared element transformation factory block
        Func<dynamic, CMsDashboardFacilitySummaryDto> mapToSummary = x => new CMsDashboardFacilitySummaryDto
        {
            FacilityReference = x.Facility.FacilityReference,
            CustomerName = x.Facility.CustomerName,
            AccountNumber = x.Facility.AccountNumber,
            FacilityPurpose = x.Facility.FacilityPurpose,
            CollateralValue = x.Facility.FacilityAmount,
            UpdatedValuationFees = x.FeesCharged,
            OpenMarketValue = x.Facility.OpenMarketValue,
            ForceSalesValue = x.Facility.ForceSalesValue,
            InsuranceValue = x.Facility.InsuranceValue,
            DateAdded = x.Facility.DateAdded,
            FacilityApprovalStatus = x.Facility.ApprovalStatus.ToString(),
            ReportApprovalStatus = x.ReportApprovalStatus.ToString(),
            ValuerPaymentStatus = x.ValuerPaymentStatus.ToString(),
            ValuationStatus = x.ValuationStatus != null ? x.ValuationStatus.ToString() : "Unassigned",
            ReportStatus = x.ReportStatus != null ? x.ReportStatus.ToString() : "Not Started"
        };

        // Metric 1: Awaiting Assignment
        var awaitingAssignItems = joinedItems.Where(x =>
            x.Facility.ApprovalStatus == ApprovalStatus.Approved &&
            x.ValuationStatus == ValuationStatus.UnAssigned &&
            x.ValuerPaymentStatus == PaymentStatus.UnProcessed).ToList();
        dashboardData.AwaitingAssignment = awaitingAssignItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.AwaitingAssignmentCount = dashboardData.AwaitingAssignment.Count;

        // Metric 2: Ongoing Facility
        var ongoingItems = joinedItems.Where(x =>
            x.ValuationStatus == ValuationStatus.Assigned &&
            x.Facility.ApprovalStatus == ApprovalStatus.Approved &&
            // It's only ongoing if it HASN'T been submitted for review yet
            (x.ReportStatus == null || x.ReportStatus == ReportStatus.NotStarted || x.ReportStatus == ReportStatus.Ongoing)
        ).ToList();

        dashboardData.OngoingFacility = ongoingItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.OngoingFacilityCount = dashboardData.OngoingFacility.Count;

        // Metric 3: Completed Facility
        // Note: Checking for ReportStatus cast string matches since 'Reviewing' might be an intermediate layout or text flag
        var completedItems = joinedItems.Where(x =>
            x.Facility.ApprovalStatus == ApprovalStatus.Approved &&
            x.ValuationStatus == ValuationStatus.Completed &&
            (x.ReportStatus == ReportStatus.Completed || x.ReportStatus == ReportStatus.Reviewing)).ToList();
        dashboardData.CompletedFacility = completedItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.CompletedFacilityCount = dashboardData.CompletedFacility.Count;

        // Metric 4: Pending Valuer Payment
        // Metric 4: Pending Valuer Payment
        var pendingPaymentItems = joinedItems.Where(x =>
            // Valuer gets tracked for payment as soon as they upload it for review OR if it's already completed
            (x.ReportStatus == ReportStatus.Reviewing || x.ReportStatus == ReportStatus.Completed) &&
            (x.ValuerPaymentStatus == PaymentStatus.UnProcessed || x.ValuerPaymentStatus == PaymentStatus.Declined)
        ).ToList();

        dashboardData.PendingValuerPayment = pendingPaymentItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.PendingValuerPaymentCount = dashboardData.PendingValuerPayment.Count;

        // Metric 5: Overdue Facility (Beyond TAT benchmark limit window of 5 days)
        var tatDeadline = DateTime.UtcNow.AddDays(-5);
        var overdueItems = joinedItems.Where(x =>
            x.ValuationStatus == ValuationStatus.Assigned &&
            x.Facility.DateAdded != null &&
            x.Facility.DateAdded < tatDeadline).ToList();
        dashboardData.OverdueFacility = overdueItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();
        dashboardData.Metrics.OverdueFacilityCount = dashboardData.OverdueFacility.Count;

        return dashboardData;
    }
}