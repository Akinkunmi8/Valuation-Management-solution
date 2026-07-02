using System.Xml.Serialization;

namespace ValuationManagementSolu.Application.DTOs;

[XmlRoot("C24TRANREQ")]
public class FinacleXmlRequestDto
{
    [XmlElement("STAN")] public string STAN { get; set; } = null!;
    [XmlElement("TRAN_DATE_TIME")] public string TranDateTime { get; set; } = null!;
    [XmlElement("TRAN_AMT")] public string TranAmt { get; set; } = null!;
    [XmlElement("PROCESSING_CODE")] public string ProcessingCode { get; set; } = "50";
    [XmlElement("TRAN_CRNCY_CODE")] public string TranCrncryCode { get; set; } = "NGN";
    [XmlElement("COUNTRY_CODE")] public string CountryCode { get; set; } = "NGA";
    [XmlElement("VALUE_DATE")] public string ValueDate { get; set; } = null!;
    [XmlElement("DR_ACCT_NUM")] public string DrAcctNum { get; set; } = null!;
    [XmlElement("CR_ACCT_NUM")] public string CrAcctNum { get; set; } = null!;
    [XmlElement("RESERVED_FLD_1")] public string ReservedFld1 { get; set; } = null!;
}

[XmlRoot("C24TRANRES")]
public class FinacleXmlResponseDto
{
    [XmlElement("ACTION_CODE")] public string ActionCode { get; set; } = null!;
    [XmlElement("STAN")] public string STAN { get; set; } = null!;
    [XmlElement("TRAN_DATE_TIME")] public string TranDateTime { get; set; } = null!;
    [XmlElement("AVAILABLE_BALANCE")] public string? AvailableBalance { get; set; }
    [XmlElement("LEDGER_BALANCE")] public string? LedgerBalance { get; set; }
    [XmlElement("BALANCE_CURRENCY")] public string? BalanceCurrency { get; set; }
}

public static class FinacleResponseTranslator
{
    public static string GetActionMessage(string actionCode) => actionCode switch
    {
        "000" => "Transaction Successful.",
        "114" => "Invalid account number.",
        "115" => "Requested function not supported.",
        "116" => "Insufficient funds.",
        "119" => "Transaction not permitted to card holder.",
        "121" => "Withdrawal amount limit exceeded.",
        "180" => "Transfer limit exceeded.",
        "904" => "Format Error.",
        "909" => "System malfunction.",
        "911" => "Card issuer timed out.",
        "913" => "Duplicate transaction id.",
        "MSG-ERR1" => "Message format error.",
        "TMT-ERR1" => "Posting timeout error.",
        _ => $"Contact finacle administrator: {actionCode}"
    };
}