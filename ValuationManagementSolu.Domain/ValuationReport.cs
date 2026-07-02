using System;
using System.Collections.Generic;
using System.Text;

namespace ValuationManagementSolu.Domain
{
    public class ValuationReport
    {
        public Guid Id { get; set; }
        public string? FacilityRef { get; set; }

        public virtual Facility? facility { get; set; }
        public string? ValuationRePortName { get; set; }
        public virtual Valuer? Valuer { get; set; }
        public string? ValuersName { get; set; }
        public DateTime? DateAssigned { get; set; }
        public ReportStatus reportStatus { get; set; }

        public ApprovalStatus approvalStatus { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public string? RejectionComment { get; set; }
    }
}
