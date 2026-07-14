using Microsoft.Extensions.Configuration;
using System.Xml.Serialization;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.Events;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _config;

    public PaymentService(IUnitOfWork unitOfWork, IConfiguration config)
    {
        _unitOfWork = unitOfWork;
        _config = config;
    }

    private async Task StageOutboxEventAsync<T>(string facilityRef, T eventData) where T : class
    {
        var outboxEntry = new EventOutbox
        {
            Id = Guid.NewGuid(), // Ensure this matches your DB type (Guid or string representation)
            FacilityReference = facilityRef,
            EventType = typeof(T).Name,
            Payload = System.Text.Json.JsonSerializer.Serialize(eventData),
            IsDispatched = false,
            RetryCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.EventOutbox.AddAsync(outboxEntry);
    }

    // ==========================================
    // 1. PROCESS FACILITY FEES (Customer Debit)
    // ==========================================
    public async Task<bool> ProcessFacilityFeesAsync(string facilityRef)
    {
        var facility = (await _unitOfWork.Facilities.GetAllAsync()).FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility reference {facilityRef} not found.");

        var collateral = (await _unitOfWork.Collaterals.GetAllAsync()).FirstOrDefault(c => c.FacilityReference == facilityRef);
        if (collateral == null) throw new KeyNotFoundException($"Collateral not found for reference {facilityRef}.");

        string cmAccount = _config["BankingConfigs:CmAccount"] ?? "1014918875";
        string drAccount = facility.AccountNumber ?? throw new InvalidOperationException("Customer account is missing.");
        decimal amount = collateral.FeesCharged;

        string reservedField = $"{facilityRef}/{facility.FacilityAmount:F2}/Valuation Fees";

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            bool success = await ExecuteFinaclePostingAsync(facilityRef, drAccount, cmAccount, amount, reservedField, "Facility Fees", TransactionType.CustomerFee);

            // Stage notification event
            var paymentEvent = new FacilityPaymentProcessedEvent(

                facilityRef,
                TransactionType.CustomerFee.ToString(),
                facility.CreatedBy,
                success ? "Successful" : "Failed",
                amount,
                DateTime.UtcNow
           ); 
            await StageOutboxEventAsync(facilityRef, paymentEvent);

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return success;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ==========================================
    // 2. REVERSE FACILITY FEES
    // ==========================================
    public async Task<bool> ReverseFacilityFeesAsync(string facilityRef)
    {
        var facility = (await _unitOfWork.Facilities.GetAllAsync()).FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility reference {facilityRef} not found.");
        var collateral = (await _unitOfWork.Collaterals.GetAllAsync()).FirstOrDefault(c => c.FacilityReference == facilityRef);

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            bool success = await ExecuteReversalAsync(facilityRef, "Facility Fees Reversal", TransactionType.CustomerFee);

            if (success)
            {
                var paymentEvent = new ReversedFacilityPaymentProcessedEvent(

               facilityRef,
               TransactionType.CustomerFee.ToString(),
               facility.CreatedBy,
               success ? "Successful" : "Failed",
               "Facility Fees Reversal",
               collateral.FeesCharged,
               DateTime.UtcNow
          );
                await StageOutboxEventAsync(facilityRef, paymentEvent);
            }

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return success;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ==========================================
    // 3. PROCESS VALUER FEES (Valuer Payout)
    // ==========================================
    public async Task<bool> ProcessValuerFeesAsync(string facilityRef)
    {
        var facility = (await _unitOfWork.Facilities.GetAllAsync()).FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility reference {facilityRef} not found.");

        var collateral = (await _unitOfWork.Collaterals.GetAllAsync()).FirstOrDefault(c => c.FacilityReference == facilityRef);
        if (collateral == null) throw new KeyNotFoundException($"Collateral not found for reference {facilityRef}.");

        if (!collateral.ValuerId.HasValue)
            throw new InvalidOperationException("No valuer has been assigned to this collateral tracking profile yet.");

        var valuer = await _unitOfWork.Valuers.GetByIdAsync(collateral.ValuerId.Value);
        if (valuer == null || string.IsNullOrEmpty(valuer.AccountNumber))
            throw new InvalidOperationException("The assigned valuer does not have a verified account profiled.");

        string cmAccount = _config["BankingConfigs:CmAccount"] ?? "1014918875";
        string crAccount = valuer.AccountNumber;
        decimal amount = collateral.FeesCharged;

        string reservedField = $"{facilityRef}/{facility.CustomerName}/{collateral.FeesCharged:F2}";

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            bool success = await ExecuteFinaclePostingAsync(facilityRef, cmAccount, crAccount, amount, reservedField, "Valuer Fees Payout", TransactionType.ValuerPayout);

            // Stage notification event
            var payoutEvent = new ValuerPaymentProcessedEvent
            (
                facilityRef,
                TransactionType.ValuerPayout.ToString(),
                valuer.ValuerEmail,
                success ? "Successful" : "Failed",
                amount,
                DateTime.UtcNow
            );
            await StageOutboxEventAsync(facilityRef, payoutEvent);

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return success;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ==========================================
    // 4. REVERSE VALUER FEES
    // ==========================================
    public async Task<bool> ReverseValuerFeesAsync(string facilityRef)
    {
        var collateral = (await _unitOfWork.Collaterals.GetAllAsync()).FirstOrDefault(c => c.FacilityReference == facilityRef);
        if (collateral == null) throw new KeyNotFoundException($"Collateral not found for reference {facilityRef}.");

        if (!collateral.ValuerId.HasValue)
            throw new InvalidOperationException("No valuer has been assigned to this collateral profile.");

        var valuer = await _unitOfWork.Valuers.GetByIdAsync(collateral.ValuerId.Value);
        if (valuer == null) throw new InvalidOperationException("The assigned valuer records could not be loaded.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            bool success = await ExecuteReversalAsync(facilityRef, "Valuer Fees Reversal", TransactionType.ValuerPayout);

            if (success)
            {
                var payoutEvent = new ReverseValuerPaymentProcessedEvent
            (
                facilityRef,
                TransactionType.ValuerPayout.ToString(),
                valuer.ValuerEmail,
                success ? "Successful" : "Failed",
                collateral.FeesCharged,
                DateTime.UtcNow
            );
                await StageOutboxEventAsync(facilityRef, payoutEvent);
            }

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return success;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<IEnumerable<ValuerReportItemDto>> GetTransactionsByStatusAsync(string status)
    {
        var allTx = await _unitOfWork.Transactions.GetAllAsync();
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();

        var query = from t in allTx
                    join f in allFacilities on t.FacilityReference equals f.FacilityReference
                    select new { Tx = t, Fac = f };

        if (status.Equals("Successful", StringComparison.OrdinalIgnoreCase))
            query = query.Where(x => x.Tx.Status == PaymentStatus.Successful);
        else if (status.Equals("Declined", StringComparison.OrdinalIgnoreCase))
            query = query.Where(x => x.Tx.Status == PaymentStatus.Declined);
        else if (status.Equals("Reversed", StringComparison.OrdinalIgnoreCase))
            query = query.Where(x => x.Tx.Status == PaymentStatus.Reversed);

        return query.Select(x => new ValuerReportItemDto
        {
            FacilityReference = x.Tx.FacilityReference,
            CustomerName = x.Fac.CustomerName,
            PaymentStatus = x.Tx.Status.ToString(),
            ApprovalStatus = x.Tx.Narration,
            DateAssigned = x.Tx.TransDate
        }).ToList();
    }

    #region Shared Private Processing Engines
    private async Task<bool> ExecuteFinaclePostingAsync(string facilityRef, string drAcc, string crAcc, decimal amt, string reservedField, string contextLabel, TransactionType txType)
    {
        string stan = DateTime.UtcNow.Ticks.ToString().Substring(0, 13);
        var xmlRequest = new FinacleXmlRequestDto
        {
            STAN = stan,
            TranDateTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss"),
            TranAmt = (amt * 100).ToString("F0"),
            ValueDate = DateTime.UtcNow.ToString("yyyyMMdd"),
            DrAcctNum = drAcc,
            CrAcctNum = crAcc,
            ReservedFld1 = reservedField
        };

        string reqXml = SerializeToXml(xmlRequest);
        string soapResponse = MockFinacleGatewayEndpointCall(reqXml, drAcc);
        var resObj = ExtractResponseObject(soapResponse);

        string message = FinacleResponseTranslator.GetActionMessage(resObj.ActionCode);

        var dbTransaction = new Transaction
        {
            FacilityReference = facilityRef,
            TranAmt = amt,
            Status = resObj.ActionCode == "000" ? PaymentStatus.Successful : PaymentStatus.Declined,
            Narration = $"[{contextLabel}] Code: {resObj.ActionCode} | Description: {message}",
            TransDate = DateTime.UtcNow,
            TransactionType = txType // Dynamically mapping context classifier type
        };

        await _unitOfWork.Transactions.AddAsync(dbTransaction);
        await _unitOfWork.CompleteAsync(); // Using global SaveChangesAsync baseline

        return dbTransaction.Status == PaymentStatus.Successful;
    }

    private async Task<bool> ExecuteReversalAsync(string facilityRef, string contextLabel, TransactionType txType)
    {
        var allTx = await _unitOfWork.Transactions.GetAllAsync();

        // Match both the FacilityReference AND the correct specialized Type subclass trace
        var targetedTx = allTx.FirstOrDefault(t => t.FacilityReference == facilityRef
                                                && t.Status == PaymentStatus.Successful
                                                && t.TransactionType == txType);

        if (targetedTx == null)
            throw new KeyNotFoundException($"No successful {txType} transactions found to reverse for reference {facilityRef}.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            targetedTx.Status = PaymentStatus.Reversed;
            targetedTx.Narration += $" | [{contextLabel}] Executed on {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}";

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return true;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private string SerializeToXml<T>(T obj)
    {
        var serializer = new XmlSerializer(typeof(T));
        using var writer = new StringWriter();
        serializer.Serialize(writer, obj);
        return writer.ToString();
    }

    private FinacleXmlResponseDto ExtractResponseObject(string soapEnvelope)
    {
        int start = soapEnvelope.IndexOf("&lt;C24TRANRES&gt;");
        int end = soapEnvelope.IndexOf("&lt;/C24TRANRES&gt;") + 19;
        if (start == -1) return new FinacleXmlResponseDto { ActionCode = "000" };

        string unescapedXml = soapEnvelope.Substring(start, end - start)
                                          .Replace("&lt;", "<")
                                          .Replace("&gt;", ">")
                                          .Replace("&quot;", "\"");

        var serializer = new XmlSerializer(typeof(FinacleXmlResponseDto));
        using var reader = new StringReader(unescapedXml);
        return (FinacleXmlResponseDto)serializer.Deserialize(reader)!;
    }

    private string MockFinacleGatewayEndpointCall(string requestXml, string drAccount)
    {
        string responseActionCode = "000";
        if (drAccount == "1023523291") responseActionCode = "913";
        else if (drAccount.StartsWith("999")) responseActionCode = "116";

        return $@"<NS1:Envelope xmlns:NS1=""http://schemas.xmlsoap.org/soap/envelope/"">
            <NS1:Body>
                <NS2:sendTransactionResponse xmlns:NS2=""http://finaclews.org"">
                <return>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;&lt;C24TRANRES&gt;&lt;ACTION_CODE&gt;{responseActionCode}&lt;/ACTION_CODE&gt;&lt;STAN&gt;3224656711121&lt;/STAN&gt;&lt;TRAN_DATE_TIME&gt;20260726105630&lt;/TRAN_DATE_TIME&gt;&lt;AVAILABLE_BALANCE&gt;+0000001945951574&lt;/AVAILABLE_BALANCE&gt;&lt;LEDGER_BALANCE&gt;+0000001945951574&lt;/LEDGER_BALANCE&gt;&lt;BALANCE_CURRENCY&gt;NGN&lt;/BALANCE_CURRENCY&gt;&lt;COUNTRY_CODE&gt;NGA&lt;/COUNTRY_CODE&gt;&lt;/C24TRANRES&gt;</return>
                </NS2:sendTransactionResponse>
            </NS1:Body>
        </NS1:Envelope>";
    }
    #endregion
}