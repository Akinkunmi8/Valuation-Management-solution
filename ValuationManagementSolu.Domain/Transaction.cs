using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ValuationManagementSolu.Domain
{
    public class Transaction
    {
        [Key]
        public int ProcessId { get; set; }
        public string? FacilityReference { get; set; }
        public string? CrAccNum { get; set; }
        public string? DrAccNum { get; set; }
        public decimal TranAmt { get; set; }
        public string? Stan { get; set; }
        public string? ValueDate { get; set; }
        public string? TranDateTime { get; set; }
        public string? CountryCode { get; set; }
        public string? ProcessingCode { get; set; }
        public string? CbaResponse { get; set; }
        public string? ReservedFld1 { get; set; }

        // Strongly typed relationship pointing back to FacilityId
        public int? FacilityId { get; set; }
        public string? FacilityCreatedBy { get; set; }
        public string? ApprovedBy { get; set; }
        public string? CreatedBy { get; set; }
        public bool IsPayBack { get; set; }
        public bool IsValuerPayment { get; set; }
        public bool IsProcessed { get; set; }
        public TransactionType TransactionType { get; set; }
        public string? ApiRequest { get; set; }
        public int CollateralId { get; set; }
        public int Trial { get; set; }
        public DateTime TransDate { get; set; }
        public bool IsParent { get; set; }
        public string? OrgnTranStan { get; set; }
        public string? OrgnTranDateTime { get; set; }

        public string? Narration { get; set; }
        public PaymentStatus Status { get; set; }
    }
}
