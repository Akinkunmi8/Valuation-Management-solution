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

public class ApprovalValidationResultDto
{
    public string FacilityReference { get; set; } = string.Empty;

    // Facility Approval Flags
    public bool IsFacilityApproved { get; set; }
    public bool IsFacilityRejected { get; set; }

    // Report Approval Flags
    public bool IsReportApproved { get; set; }
    public bool IsReportRejected { get; set; }

    // Combined Evaluation Flags
    public bool IsFullyApproved => IsFacilityApproved && IsReportApproved;
    public bool IsAnyRejected => IsFacilityRejected || IsReportRejected;
}