using Microsoft.AspNetCore.Http;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.DTOs;

public class FacilityDto
{
    //public int FacilityId { get; set; }
    public string? AccountNumber { get; set; }
    public string? SolId { get; set; }
    public string? FacilityPurpose { get; set; }
    public string? CustomerName { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? FacilityAddress { get; set; }
    public string? RMsNumber { get; set; }
    public string? CreatedBy { get; set; }
    // fill collater details
    public string? CollateraOwener { get; set; }
    public string? collateralType { get; set; }
    public string? StateOfCollateral { get; set; }
    public string? Location { get; set; }
    public string? OtherDetails { get; set; }
    public decimal? CollateralValue { get; set; }
    public decimal? ValuationsFees { get; set; }
    public IFormFile? TitleDocument { get; set; }
    public IFormFile? ApprovalFile { get; set; }
    public IFormFile? IndemityLetter {  get; set; }
}

public class GetFacilityDetailsDto
{
    public string? FacilityReference { get; set; }
    public string? AccountNumber { get; set; }
    public string? SolId { get; set; }
    public string? FacilityPurpose { get; set; }
    public string? CustomerName { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? FacilityAddress { get; set; }
    public string? RMsNumber { get; set; }
    public string? CreatedBy { get; set; }
    // fill collater details
    public string? CollateraOwener { get; set; }
    public string? collateralType { get; set; }
    public string? StateOfCollateral { get; set; }
    public string? Location { get; set; }
    public string? OtherDetails { get; set; }
    public decimal? CollateralValue { get; set; }
    public decimal? ValuationsFees { get; set; }
    public DateTime? DateAdded { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public ValuationStatus ValuationStatus { get; set; }
    public string? SavedTitleDocumentPath { get; set; } 
    public string? SavedApprovalFilePath { get; set; }
    public string? SavedIndemnityLetterPath { get; set; }

}