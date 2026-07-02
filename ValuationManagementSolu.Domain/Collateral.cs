using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ValuationManagementSolu.Domain
{
    public class Collateral
    {
        [Key]
        public int CollateralId { get; set; }
        public string? FacilityReference { get; set; }
        public string? ValuationStatusDescription { get; set; }
        public int ValuationStatusId { get; set; } = 0;
        public string? CustomerName { get; set; }
        public string? Owner { get; set; }
        public IsLocationApproved IsLocationApproved { get; set; }

        // Fixed Foreign Key implementation
        public int FacilityId { get; set; }
        public virtual Facility? Facility { get; set; }

        public string? TitleType { get; set; }
        public string? CollateralAddress { get; set; }
        public DateTime? RequestDate { get; set; }
        public decimal BranchValuationSum { get; set; }

        public int? ValuerId { get; set; }
        public virtual Valuer? Valuer { get; set; }

        public int ApprovalStatusId { get; set; } = 0;
        public ApprovalStatus ApprovalStatus { get; set; }
        public string? Approve { get; set; }
        public string? Location { get; set; }
        public string? State { get; set; }
        public string? CollateralCategory { get; set; }
        public string? SecondaryAccount { get; set; }
        public decimal FeesCharged { get; set; }
        public bool IsTaken { get; set; } = false;
        public AssetCategory AssetCategoryId { get; set; }

        public int StateId { get; set; } = 0;
        public virtual StateAndCapital? StateAndCapital { get; set; }

        public int LocationId { get; set; } = 0;
        public virtual ApprovedLocation? ApprovedLocation { get; set; }

        public string? Reference { get; set; }
        public string? FileName { get; set; }
        public string? ApprovalFileName { get; set; }
        public string? IndemnityFileName { get; set; }
        public string? ActedOnBy { get; set; }
        public DateTime? DateActedOnBy { get; set; }
        public DateTime ValuationStartDate { get; set; } = DateTime.UtcNow;
        public DateTime? ValuationEndDate { get; set; }
        public bool IsEmailSent { get; set; } = false;
        public int ShopCount { get; set; } = 0;

        public string? OtherDetails { get; set; }
    }


}
