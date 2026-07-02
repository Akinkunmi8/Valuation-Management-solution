using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.DTOs
{
    public class CreateValuationReportDto
    {
        // Changed to decimal for exact calculations
        [Required]
        [StringLength(20, MinimumLength = 10)]
        public string? FacilityReference { get; set; }
        public string? CustomerName { get; set; }
        public decimal CollateralValue { get; set; } = 0.00m;
        public string? Owner { get; set; }
        public string? City {  get; set; }
        public string? State { get; set; }
        public string? LocalGov { get; set; }
        public string? PropertyDescription { get; set; }
        public string? Landsize { get; set; }
        public AssetCategory AssetCategoryId { get; set; }
        public DateTime? DateAssigned { get; set; }
        public DateTime? ValuationDate { get; set; }

       public int ValuerId { get; set; }
        public decimal? OpenMarketValue { get; set; }
        public decimal? ForceSalesValue { get; set; }
        public decimal? InsuranceValue { get; set; }

        public string? SalesLocation { get; set; }
        public DateTime? SalesDate { get; set; }

        public IFormFile ValuatioinReport { get; set; }
    }
}
