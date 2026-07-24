using System;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.DTOs;

public class ValuationReportDetailsDto
{
    // Report Info
    public Guid ReportId { get; set; }
    public string FacilityReference { get; set; } = string.Empty;
    public string ValuerName { get; set; } = string.Empty;
    public DateTime? DateAssigned { get; set; }
    public string ReportStatus { get; set; } = string.Empty;
    public string ReportApprovalStatus { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;

    // File Download Meta
    public string ReportFileName { get; set; } = string.Empty; // Relative file path or stored name
    public string FileDownloadUrl { get; set; } = string.Empty; // Full accessible URL for download

    // Facility & Location Details
    public string CustomerName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string LocalGov { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string SalesLocation { get; set; } = string.Empty;

    // Valuation Financials
    public decimal OpenMarketValue { get; set; }
    public decimal ForceSalesValue { get; set; }
    public decimal InsuranceValue { get; set; }
    public DateTime? ValuationDate { get; set; }

    // Collateral Meta
    public string CollateralOwner { get; set; } = string.Empty;
    public AssetCategory AssetCategoryId { get; set; }
    public decimal BranchValuationSum { get; set; }
    public string CollateralLocation { get; set; } = string.Empty;
    public string OtherDetails { get; set; } = string.Empty;
}