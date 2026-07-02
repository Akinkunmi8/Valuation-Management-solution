namespace ValuationManagementSolu.Application.DTOs;

public class AuditDashboardMetricsDto
{
    public int TotalFacilityCreatedCount { get; set; }
    public int TotalCompletedFacilityCount { get; set; }
    public int TotalPaymentProcessedCount { get; set; }
    public int TotalActiveUsersCount { get; set; }
    public int TotalAllUsersCount { get; set; }
}

public class AuditDashboardDataDto
{
    public AuditDashboardMetricsDto Metrics { get; set; } = new();

    // Detailed records for comprehensive data grids
    public List<RmDashboardFacilitySummaryDto> AllFacilities { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> CompletedFacilities { get; set; } = new();
}