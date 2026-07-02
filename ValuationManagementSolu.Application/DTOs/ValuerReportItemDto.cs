namespace ValuationManagementSolu.Application.DTOs;

public class ValuerReportItemDto
{
    public string FacilityReference { get; set; } = null!;
    public string? CustomerName { get; set; }
    public string? ValuersName { get; set; }
    public int? ValuerId { get; set; }
    public string ReportStatus { get; set; } = null!;
    public string ApprovalStatus { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
    public DateTime? DateAssigned { get; set; }
}