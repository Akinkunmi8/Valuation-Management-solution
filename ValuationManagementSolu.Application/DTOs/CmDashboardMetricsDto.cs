namespace ValuationManagementSolu.Application.DTOs;

public class CmDashboardMetricsDto
{
    public int PendingReviewCount { get; set; }
    public int ApprovedCount { get; set; }
    public int RejectedCount { get; set; }
    public int AwaitingValuerAssignmentCount { get; set; }
    public int CompletedCount { get; set; }
    public int BeyondTatCount { get; set; }
    public int PendingReportReviewCount { get; set; }
}

public class CmDashboardDataDto
{
    public CmDashboardMetricsDto Metrics { get; set; } = new();

    // Grouped lists for card binding
    public List<CmDashboardFacilitySummaryDto> PendingReview { get; set; } = new();
    public List<CmDashboardFacilitySummaryDto> Approved { get; set; } = new();
    public List<CmDashboardFacilitySummaryDto> Rejected { get; set; } = new();
    public List<CmDashboardFacilitySummaryDto> AwaitingValuerAssignment { get; set; } = new();
    public List<CmDashboardFacilitySummaryDto> Completed { get; set; } = new();
    public List<CmDashboardFacilitySummaryDto> BeyondTat { get; set; } = new();
    public List<CmDashboardFacilitySummaryDto> PendingReportReview { get; set; } = new();
}

public class CmDashboardFacilitySummaryDto
{
    public string FacilityReference { get; set; } = null!;
    public string? CustomerName { get; set; }
    public string? AccountNumber { get; set; }
    public string? FacilityPurpose { get; set; }
    public decimal CollateralValue { get; set; }
    public decimal ValuationFees { get; set; }
    public int ValuerId { get; set; }
    public decimal? OpenMarketValue { get; set; }
    public decimal? ForceSalesValue { get; set; }
    public decimal? InsuranceValue { get; set; }
    public string? FacilityApprovalStatus { get; set; }
    public string? ReportApprovalStatus { get; set; }
    public string CustomerPaymentStatus { get; set; } = null!;
    public string ValuationStatus { get; set; } = null!;
    public string ReportStatus { get; set; } = null!;
    public DateTime? DateAdded { get; set; }
}