using System;

namespace ValuationManagementSolu.Application.DTOs;

public class CompletedValuationReportDto
{
    public string? FacilityRef { get; set; }
    public decimal FacilityAmount { get; set; } = 0.00m;
    public string? Status { get; set; } = "N/A";
    public string? OperativeAcc { get; set; }
    public string? State { get; set; }
    public string? LocalGov { get; set; }
    public string? PropertyDescription { get; set; }
    public string? Landsize { get; set; }
    public DateTime? ValuationDate { get; set; }

    // Value metrics
    public decimal? OpenMarketValue { get; set; }
    public decimal? ForceSalesValue { get; set; }
    public decimal? InsuranceValue { get; set; }
    public string? SalesLocation { get; set; }
    public DateTime? SalesDate { get; set; }

    public string? ValuationRePortName { get; set; }
    public string? ValuersName { get; set; }
    public DateTime? DateAssigned { get; set; }

    // Stored File Payload
    public string? ValuationReportBase64 { get; set; }
    public string? ContentType { get; set; }
}