using System;
using System.Collections.Generic;

namespace ValuationManagementSolu.Application.DTOs;

public class PaymentDashboardMetricsDto
{
    public int SuccessfulCount { get; set; }
    public int FailedCount { get; set; }
    public int ReversedCount { get; set; }
    public decimal TotalSuccessfulAmount { get; set; }
}

public class PaymentTransactionItemDto
{
    public string FacilityReference { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Narration { get; set; } = string.Empty;
    public DateTime TransDate { get; set; }
}

public class FacilityFeesDashboardDto
{
    public PaymentDashboardMetricsDto Metrics { get; set; } = new();
    public List<PaymentTransactionItemDto> Transactions { get; set; } = new();
}

public class ValuerFeesDashboardDto
{
    public PaymentDashboardMetricsDto Metrics { get; set; } = new();
    public List<PaymentTransactionItemDto> Transactions { get; set; } = new();
}

public class CombinedPaymentDashboardDto
{
    public FacilityFeesDashboardDto FacilityFees { get; set; } = new();
    public ValuerFeesDashboardDto ValuerFees { get; set; } = new();
}