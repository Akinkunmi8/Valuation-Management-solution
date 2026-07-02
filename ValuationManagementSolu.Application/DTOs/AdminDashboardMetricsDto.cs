namespace ValuationManagementSolu.Application.DTOs;

public class AdminDashboardMetricsDto
{
    public int TotalUsersCount { get; set; }
    public int TotalActiveUsersCount { get; set; }
    public int TotalValuersCount { get; set; }
}

public class AdminDashboardDataDto
{
    public AdminDashboardMetricsDto Metrics { get; set; } = new();
}