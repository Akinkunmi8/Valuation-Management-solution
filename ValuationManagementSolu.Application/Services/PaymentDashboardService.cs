using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Services;

public class PaymentDashboardService : IPaymentDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public PaymentDashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // ==========================================
    // 1. FACILITY FEES PAYMENT DASHBOARD (Customer Debit - TransactionType = 0)
    // ==========================================
    public async Task<FacilityFeesDashboardDto> GetFacilityFeesDashboardAsync()
    {
        var allTransactions = await _unitOfWork.Transactions.GetAllAsync();
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();

        // Filter strictly for Customer Fee transactions
        var customerFeeTx = (from t in allTransactions
                             where t.TransactionType == TransactionType.CustomerFee
                             join f in allFacilities on t.FacilityReference equals f.FacilityReference into facGroup
                             from f in facGroup.DefaultIfEmpty()
                             select new PaymentTransactionItemDto
                             {
                                 FacilityReference = t.FacilityReference,
                                 CustomerName = f?.CustomerName ?? "N/A",
                                 AccountNumber = f?.AccountNumber ?? "N/A",
                                 Amount = t.TranAmt,
                                 TransactionType = t.TransactionType.ToString(),
                                 Status = t.Status.ToString(),
                                 Narration = t.Narration,
                                 TransDate = t.TransDate
                             }).OrderByDescending(x => x.TransDate).ToList();

        return new FacilityFeesDashboardDto
        {
            Metrics = new PaymentDashboardMetricsDto
            {
                SuccessfulCount = customerFeeTx.Count(x => x.Status == PaymentStatus.Successful.ToString()),
                FailedCount = customerFeeTx.Count(x => x.Status == PaymentStatus.Declined.ToString()),
                ReversedCount = customerFeeTx.Count(x => x.Status == PaymentStatus.Reversed.ToString()),
                TotalSuccessfulAmount = customerFeeTx
                    .Where(x => x.Status == PaymentStatus.Successful.ToString())
                    .Sum(x => x.Amount)
            },
            Transactions = customerFeeTx
        };
    }

    // ==========================================
    // 2. VALUER FEES PAYMENT DASHBOARD (Valuer Payout - TransactionType = 1)
    // ==========================================
    public async Task<ValuerFeesDashboardDto> GetValuerFeesDashboardAsync()
    {
        var allTransactions = await _unitOfWork.Transactions.GetAllAsync();
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();

        // Filter strictly for Valuer Payout transactions
        var valuerPayoutTx = (from t in allTransactions
                              where t.TransactionType == TransactionType.ValuerPayout
                              join f in allFacilities on t.FacilityReference equals f.FacilityReference into facGroup
                              from f in facGroup.DefaultIfEmpty()
                              select new PaymentTransactionItemDto
                              {
                                  FacilityReference = t.FacilityReference,
                                  CustomerName = f?.CustomerName ?? "N/A",
                                  AccountNumber = f?.AccountNumber ?? "N/A",
                                  Amount = t.TranAmt,
                                  TransactionType = t.TransactionType.ToString(),
                                  Status = t.Status.ToString(),
                                  Narration = t.Narration,
                                  TransDate = t.TransDate
                              }).OrderByDescending(x => x.TransDate).ToList();

        return new ValuerFeesDashboardDto
        {
            Metrics = new PaymentDashboardMetricsDto
            {
                SuccessfulCount = valuerPayoutTx.Count(x => x.Status == PaymentStatus.Successful.ToString()),
                FailedCount = valuerPayoutTx.Count(x => x.Status == PaymentStatus.Declined.ToString()),
                ReversedCount = valuerPayoutTx.Count(x => x.Status == PaymentStatus.Reversed.ToString()),
                TotalSuccessfulAmount = valuerPayoutTx
                    .Where(x => x.Status == PaymentStatus.Successful.ToString())
                    .Sum(x => x.Amount)
            },
            Transactions = valuerPayoutTx
        };
    }
}