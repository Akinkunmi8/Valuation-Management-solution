using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ValuationManagementSolu.Application.Data
{
    public class AssignValuerRequest
    {
        [Required]
        public int CollateralId { get; set; }
        [Required]
        public int ValuerId { get; set; }
        public decimal FeesCharged { get; set; }
    }
}
