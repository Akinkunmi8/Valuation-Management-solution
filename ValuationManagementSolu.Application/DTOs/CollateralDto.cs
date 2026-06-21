using System;
using System.Collections.Generic;
using System.Text;

namespace ValuationManagementSolu.Application.DTOs
{
    public class CollateralDto
    {
        public int CollateralId { get; set; }
        public int FacilityId { get; set; }
        public string? CustomerName { get; set; }
        public string? CollateralAddress { get; set; }
        public decimal BranchValuationSum { get; set; }
        public string? ValuerName { get; set; }
        public DateTime ValuationStartDate { get; set; }
        public DateTime? ValuationEndDate { get; set; }
    }
}
