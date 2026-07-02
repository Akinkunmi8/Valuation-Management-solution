namespace ValuationManagementSolu.Application.DTOs;

public class RmDashboardMetricsDto
{
    public int PendingWithSuccessfulPaymentCount { get; set; }
    public int AwaitingPaymentCount { get; set; }
    public int RejectedCount { get; set; }
    public int ApprovedCount { get; set; }
    public int CompletedCount { get; set; }
    public int ExpiredCount { get; set; }
}

public class RmDashboardFacilitySummaryDto
{
    public string FacilityReference { get; set; } = null!;
    public string? CustomerName { get; set; }
    public string? AccountNumber { get; set; }
    public string? FacilityPurpose { get; set; }
    public decimal CollateralValue { get; set; }
    public decimal ValuationChargeFees { get; set; }
    public string? RejectionComment { get; set; }
    public string ApprovalStatus { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
    public string ValuationStatus { get; set; } = null!;
    public string ReportStatus { get; set; } = null!;
    public DateTime? DateAdded { get; set; }
}

public class RmDashboardDataDto
{
    // The metric counts for the summary cards
    public RmDashboardMetricsDto Metrics { get; set; } = new();

    // Partitioned lists matching each individual metric card type
    public List<RmDashboardFacilitySummaryDto> PendingWithSuccessfulPayment { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> AwaitingPayment { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> Rejected { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> Approved { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> Completed { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> Expired { get; set; } = new();
}

//public class RmMetricsDto
//{
//    public int PendingWithSuccessfulPaymentCount { get; set; }
//    public int AwaitingPaymentCount { get; set; }
//    public int RejectedCount { get; set; }
//    public int ApprovedCount { get; set; }
//    public int CompletedCount { get; set; }
//    public int ExpiredCount { get; set; }
//}