namespace ValuationManagementSolu.Application.Events;

// --- FACILITY LIFECYCLE EVENTS ---
public record FacilityCreatedEvent(string FacilityReference, string CustomerName, string AccountNumber, string CreatedByEmail, string SolId, DateTime Timestamp);
public record FacilityPendingEvent(string FacilityReference, string CustomerName, string CurrentStage, DateTime Timestamp);
public record FacilityApprovedEvent(string FacilityReference, string ApprovedBy, DateTime Timestamp);
public record FacilityRejectedEvent(string FacilityReference, string RejectedBy, string Comment, DateTime Timestamp);
public record FacilityReassignedRmEvent(string FacilityReference, string OldRmEmail, string NewRmEmail, string ReassignedBy, DateTime Timestamp);

// --- PAYMENT TRANSITION EVENTS ---
public record FacilityPaymentProcessedEvent(string FacilityReference, string TransactionType, string Status, decimal Amount, DateTime Timestamp);
public record ValuerPaymentProcessedEvent(string FacilityReference, string TransactionType, string Status, decimal Amount, DateTime Timestamp);

// --- VALUATION WORKFLOW EVENTS ---
public record FacilityAssignedToValuerEvent(string FacilityReference, int ValuerId, string ValuerName, DateTime Timestamp);
public record FacilityReassignedAndWithdrawnEvent(string FacilityReference, int OldValuerId, int? NewValuerId, string Reason, DateTime Timestamp);
public record FacilityReportUploadedEvent(string FacilityReference, string ValuerName, string ReportPath, DateTime Timestamp);
public record FacilityReportApprovedEvent(string FacilityReference, string ApprovedBy, DateTime Timestamp);
public record FacilityReportRejectedEvent(string FacilityReference, string RejectedBy, string Comment, DateTime Timestamp);
public record FacilityReportCompletedEvent(string FacilityReference, DateTime Timestamp);