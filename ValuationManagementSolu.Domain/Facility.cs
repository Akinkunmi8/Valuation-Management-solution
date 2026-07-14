using System.ComponentModel.DataAnnotations;

namespace ValuationManagementSolu.Domain;

public class Facility
{
    [Key]
    public int FacilityId { get; set; }
    public string? AccountNumber { get; set; }
    public string? SOLID { get; set; }
    public string? FacilityPurpose { get; set; }
    public string? CustomerName { get; set; }
    public int ValuationProcessesStatus { get; set; } = 0;
    public bool IsAllCollateralApproved { get; set; } = false;
    public string? CustomerCity { get; set; }
    public string? CustomerCountry { get; set; }
    public DateTime? DateAdded { get; set; }
    public string? CreatedBy { get; set; }

    public string? FacilityReviewBy { get; set; }
    public string? CustomerAddress { get; set; }
    public string? RMsSolId { get; set; }
    public string? RMsAddress { get; set; }
    public string? FacilityAcc { get; set; } = "N/A";

    // Changed to decimal for exact calculations
    public decimal FacilityAmount { get; set; } = 0.00m;
    public string? Status { get; set; } = "N/A";
    public string? OperativeAcc { get; set; }
    public string? State { get; set; }
    public string? LocalGov { get; set; }
    public string? PropertyDescription { get; set; }
    public string? Landsize { get; set; }
    public DateTime? ValuationDate { get; set; }

    // Value metrics converted to decimals
    public decimal? OpenMarketValue { get; set; }
    public decimal? ForceSalesValue { get; set; }
    public decimal? InsuranceValue { get; set; }

    public string? SalesLocation { get; set; }
    public DateTime? SalesDate { get; set; }
    public string? CurrencyCode { get; set; }
    public bool IsFacilityClosed { get; set; } = false;
    public string? RelationshipManagersPhone { get; set; }
    public string? DepartmentHeadName { get; set; }
    public string? Costcode { get; set; }
    public string? FacilityReference { get; set; }
    public string? BankId { get; set; }
    public bool IsDeleted { get; set; } = false;
    public string? ReviewerReason { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public ValuationStatus ValuationStatus { get; set; }
    public string? RejectionComment { get; set; }
}
