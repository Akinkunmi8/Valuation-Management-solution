namespace ValuationManagementSolu.Application.DTOs;

public class CmsDashboardMetricsDto
{
    public int AwaitingAssignmentCount { get; set; }
    public int OngoingFacilityCount { get; set; }
    public int CompletedFacilityCount { get; set; }
    public int PendingValuerPaymentCount { get; set; }
    public int OverdueFacilityCount { get; set; }
}

public class CmsDashboardDataDto
{
    public CmsDashboardMetricsDto Metrics { get; set; } = new();

    // Segmented arrays for dynamic table UI binding
    public List<CMsDashboardFacilitySummaryDto> AwaitingAssignment { get; set; } = new();
    public List<CMsDashboardFacilitySummaryDto> OngoingFacility { get; set; } = new();
    public List<CMsDashboardFacilitySummaryDto> CompletedFacility { get; set; } = new();
    public List<CMsDashboardFacilitySummaryDto> PendingValuerPayment { get; set; } = new();
    public List<CMsDashboardFacilitySummaryDto> OverdueFacility { get; set; } = new();
}

public class CMsDashboardFacilitySummaryDto
{
    public string FacilityReference { get; set; } = null!;
    public string? CustomerName { get; set; }
    public string? AccountNumber { get; set; }
    public string? FacilityPurpose { get; set; }
    public decimal CollateralValue { get; set; }
    public decimal UpdatedValuationFees { get; set; }
    public int ValuerId { get; set; }
    public decimal? OpenMarketValue { get; set; }
    public decimal? ForceSalesValue { get; set; }
    public decimal? InsuranceValue { get; set; }
    public string FacilityApprovalStatus { get; set; } = null!;
    public string? ReportApprovalStatus { get; set; }
    public string ValuerPaymentStatus { get; set; } = null!;
    public string ValuationStatus { get; set; } = null!;
    public string ReportStatus { get; set; } = null!;
    public DateTime? DateAdded { get; set; }
}