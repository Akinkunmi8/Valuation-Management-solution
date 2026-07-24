using System;
using System.Collections.Generic;

namespace ValuationManagementSolu.Application.DTOs;

public class ValuationReportMetricsDto
{
    public int OngoingCount { get; set; }
    public int CompletedCount { get; set; }
}

public class ValuationReportTableItemDto
{
    public Guid ReportId { get; set; }
    public string FacilityReference { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;

    // Required Valuer & Payment Fields
    public string ValuerName { get; set; } = string.Empty;
    public int ValuerId { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;

    // Status Meta
    public string ReportStatus { get; set; } = string.Empty;
    public string ReportApprovalStatus { get; set; } = string.Empty;

    // Financials & Dates
    public decimal OpenMarketValue { get; set; }
    public decimal ForceSalesValue { get; set; }
    public decimal InsuranceValue { get; set; }
    public DateTime? DateAssigned { get; set; }
    public string ReportFileName { get; set; } = string.Empty;
}

public class ValuationReportDashboardDto
{
    public ValuationReportMetricsDto Metrics { get; set; } = new();
    public List<ValuationReportTableItemDto> Reports { get; set; } = new();
}