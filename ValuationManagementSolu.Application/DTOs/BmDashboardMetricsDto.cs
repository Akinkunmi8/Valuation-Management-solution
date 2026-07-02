namespace ValuationManagementSolu.Application.DTOs;

public class BmDashboardMetricsDto
{
    public int TotalPendingPaymentCount { get; set; }
    public int TotalSubmittedCount { get; set; } // Successful payments
    public int TotalApprovedCount { get; set; }
    public int TotalRejectedCount { get; set; }
    public int TotalCompletedCount { get; set; }
    public int TotalBeyondTatCount { get; set; }
}

public class TopRmDto
{
    public string RmName { get; set; } = null!;
    public string RmPhone { get; set; } = null!;
    public int CompletedFacilitiesCount { get; set; }
}

public class BmDashboardDataDto
{
    public BmDashboardMetricsDto Metrics { get; set; } = new();

    // Grouped lists for card clicks
    public List<RmDashboardFacilitySummaryDto> PendingPayment { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> Submitted { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> Approved { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> Rejected { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> Completed { get; set; } = new();
    public List<RmDashboardFacilitySummaryDto> BeyondTat { get; set; } = new();

    // Branch Leaderboard
    public List<TopRmDto> TopPerformingRMs { get; set; } = new();
}