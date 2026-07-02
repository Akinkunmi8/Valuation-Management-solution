using Microsoft.AspNetCore.Http;

public class FacilityResubmitDto
{
    public string? AccountNumber { get; set; }
    public string? SolId { get; set; }
    public string? FacilityPurpose { get; set; }
    public string? CustomerName { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? FacilityAddress { get; set; }
    public string? CollateralOwner { get; set; }
    public string? CollateralType { get; set; }
    public string? StateOfCollateral { get; set; }
    public string? Location { get; set; }
    public string? OtherDetails { get; set; }
    public decimal CollateralValue { get; set; }
    public decimal ValuationsFees { get; set; }
    public string? RMsNumber { get; set; }
    // CHANGED: Use IFormFile to accept real binary uploads from Swagger/Frontend
    public IFormFile? TitleDocument { get; set; }
    public IFormFile? ApprovalFile { get; set; }
    public IFormFile? IndemnityLetter { get; set; }
}