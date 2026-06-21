using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ValuationManagementSolu.Application.Data
{
    public class CreateFacilityRequest
    {
        [Required]
        public string AccountNumber { get; set; } = null!;
        [Required]
        public string CustomerName { get; set; } = null!;
        [Range(1, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal FacilityAmount { get; set; }
        public string? SOLID { get; set; }
    }
}
