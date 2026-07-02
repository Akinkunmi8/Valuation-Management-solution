namespace ValuationManagementSolu.Application.DTOs;

public class ValuerDashboardMetricsDto
{
    public int AssignedFacilityCount { get; set; }
    public int OngoingReportCount { get; set; }
    public int AwaitingCompletedReportCount { get; set; }
    public int ApprovedCompletedReportCount { get; set; }
    public int ReturnedReportCount { get; set; }
    public int BeyondTatCount { get; set; }
}

public class ValuerDashboardDataDto
{
    public ValuerDashboardMetricsDto Metrics { get; set; } = new();

    // Grouped lists for card click binding
    public List<ValuerDashboardFacilitySummaryDto> AssignedFacilities { get; set; } = new();
    public List<ValuerDashboardFacilitySummaryDto> OngoingReports { get; set; } = new();
    public List<ValuerDashboardFacilitySummaryDto> AwaitingCompletedReports { get; set; } = new();
    public List<ValuerDashboardFacilitySummaryDto> ApprovedCompletedReports { get; set; } = new();
    public List<ValuerDashboardFacilitySummaryDto> ReturnedReports { get; set; } = new();
    public List<ValuerDashboardFacilitySummaryDto> BeyondTat { get; set; } = new();
}

public class ValuerDashboardFacilitySummaryDto
{
    public string FacilityReference { get; set; } = null!;
    public string? CustomerName { get; set; }
    public string? AccountNumber { get; set; }
    public string? FacilityPurpose { get; set; }
    public decimal CollateralValue { get; set; }
    public string ApprovalStatus { get; set; } = null!;
    public string ValuerPaymentStatus { get; set; } = null!;
    public string ValuationStatus { get; set; } = null!;
    public string ReportStatus { get; set; } = null!;
    public DateTime? DateAdded { get; set; }
}