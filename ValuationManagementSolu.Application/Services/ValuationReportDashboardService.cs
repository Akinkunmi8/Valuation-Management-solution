using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Services;

public class ValuationReportDashboardService : IValuationReportDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public ValuationReportDashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ValuationReportDashboardDto> GetReportDashboardDataAsync()
    {
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();

        // 1. Join Reports with Facilities and Collateral to extract ValuerId and metadata
        var joinedTableData = (from r in allReports
                               join f in allFacilities on r.FacilityRef equals f.FacilityReference into facGroup
                               from f in facGroup.DefaultIfEmpty()
                               join c in allCollaterals on r.FacilityRef equals c.FacilityReference into colGroup
                               from c in colGroup.DefaultIfEmpty()
                               select new ValuationReportTableItemDto
                               {
                                   ReportId = r.Id,
                                   FacilityReference = r.FacilityRef,
                                   CustomerName = f?.CustomerName ?? "N/A",

                                   // Valuer & Payment context mapping
                                   ValuerName = string.IsNullOrWhiteSpace(r.ValuersName) ? "Unassigned" : r.ValuersName,
                                   ValuerId = (c != null && c.ValuerId.HasValue) ? c.ValuerId.Value : 0,
                                   PaymentStatus = r.PaymentStatus.ToString(),

                                   // Status Flags
                                   ReportStatus = r.reportStatus.ToString(),
                                   ReportApprovalStatus = r.approvalStatus.ToString(),

                                   // Values & Dates
                                   OpenMarketValue = f?.OpenMarketValue ?? 0m,
                                   ForceSalesValue = f?.ForceSalesValue ?? 0m,
                                   InsuranceValue = f?.InsuranceValue ?? 0m,
                                   DateAssigned = r.DateAssigned,
                                   ReportFileName = r.ValuationRePortName ?? string.Empty
                               }).OrderByDescending(x => x.DateAssigned).ToList();

        // 2. Compute Dashboard Counts
        // Ongoing: Reports currently underway or under review/approval
        int ongoingCount = joinedTableData.Count(x =>
            x.ReportStatus == ReportStatus.Ongoing.ToString() ||
            x.ReportStatus == ReportStatus.Reviewing.ToString() ||
            x.ReportStatus == ReportStatus.NotStarted.ToString());

        // Completed: Reports fully finalized
        int completedCount = joinedTableData.Count(x =>
            x.ReportStatus == ReportStatus.Completed.ToString());

        return new ValuationReportDashboardDto
        {
            Metrics = new ValuationReportMetricsDto
            {
                OngoingCount = ongoingCount,
                CompletedCount = completedCount
            },
            Reports = joinedTableData
        };
    }
}