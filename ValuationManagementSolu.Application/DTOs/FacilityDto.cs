namespace ValuationManagementSolu.Application.DTOs;

public class FacilityDto
{
    public int FacilityId { get; set; }
    public string? AccountNumber { get; set; }
    public string? CustomerName { get; set; }
    public decimal FacilityAmount { get; set; }
    public string? FacilityPurpose { get; set; }
    public string? ApprovalStatusDescription { get; set; }
    public string? ValuationStatusDescription { get; set; }
}