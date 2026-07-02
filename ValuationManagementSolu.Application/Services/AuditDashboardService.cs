using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Services;

public class AuditDashboardService : IAuditDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public AuditDashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<AuditDashboardDataDto> GetAuditDashboardDataAsync()
    {
        // 1. Load data from target repositories
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var allTransactions = await _unitOfWork.Transactions.GetAllAsync();
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();

        // Assuming your UnitOfWork exposes your application's user table repository
        var allUsers = await _unitOfWork.Users.GetAllAsync();

        // 2. Compute relational mapping using your exact FacilityRef column property layout
        var joinedItems = (from f in allFacilities
                           join t in allTransactions on f.FacilityReference equals t.FacilityReference into txGroup
                           from t in txGroup.DefaultIfEmpty()
                           join r in allReports on f.FacilityReference equals r.FacilityRef into reportGroup
                           from r in reportGroup.DefaultIfEmpty()
                           select new
                           {
                               Facility = f,
                               PaymentStatus = r != null ? r.PaymentStatus : (t != null ? t.Status : PaymentStatus.UnProcessed),
                               ReportStatus = r != null ? r.reportStatus : (ReportStatus?)null,
                               ApprovalStatus = r != null ? r.approvalStatus : ApprovalStatus.Pending
                           }).ToList();

        var dashboardData = new AuditDashboardDataDto();

        // Structural projection data mapper
        Func<dynamic, RmDashboardFacilitySummaryDto> mapToSummary = x => new RmDashboardFacilitySummaryDto
        {
            FacilityReference = x.Facility.FacilityReference,
            CustomerName = x.Facility.CustomerName,
            AccountNumber = x.Facility.AccountNumber,
            FacilityPurpose = x.Facility.FacilityPurpose,
            DateAdded = x.Facility.DateAdded,
            ApprovalStatus = x.Facility.ApprovalStatus.ToString(),
            PaymentStatus = x.PaymentStatus.ToString(),
            ValuationStatus = x.ApprovalStatus.ToString(),
            ReportStatus = x.ReportStatus != null ? x.ReportStatus.ToString() : "Not Started"
        };

        // Populate comprehensive list metrics
        dashboardData.AllFacilities = joinedItems.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();

        var completed = joinedItems.Where(x => x.ReportStatus == ReportStatus.Completed).ToList();
        dashboardData.CompletedFacilities = completed.Select(mapToSummary).OrderByDescending(x => x.DateAdded).ToList();

        // 3. Populate Statistical Metric Summaries
        dashboardData.Metrics.TotalFacilityCreatedCount = dashboardData.AllFacilities.Count;
        dashboardData.Metrics.TotalCompletedFacilityCount = dashboardData.CompletedFacilities.Count;

        // Total successfully processed fee or valuer payment entries
        dashboardData.Metrics.TotalPaymentProcessedCount = joinedItems.Count(x => x.PaymentStatus == PaymentStatus.Successful);

        // Calculate identity metrics (Assumes a boolean property or your specific enum setup for Active accounts)
        dashboardData.Metrics.TotalAllUsersCount = allUsers.Count();
        dashboardData.Metrics.TotalActiveUsersCount = allUsers.Count(u => u.IsActive == true);

        return dashboardData;
    }
}