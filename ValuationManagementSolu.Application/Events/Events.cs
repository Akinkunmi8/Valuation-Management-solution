namespace ValuationManagementSolu.Application.Events;

// --- FACILITY LIFECYCLE EVENTS ---
public record FacilityCreatedEvent(string FacilityReference, string CustomerName, string AccountNumber, string CreatedByEmail, string SolId, DateTime Timestamp);
public record FacilityPendingEvent(string FacilityReference, string CustomerName, string CurrentStage, DateTime Timestamp);
public record FacilityApprovedEvent(string FacilityReference, string ApprovedBy, string CreatedByEmail,  DateTime Timestamp);
public record FacilityRejectedEvent(string FacilityReference, string RejectedBy, string CreatedByEmail, string Comment, DateTime Timestamp);
public record FacilityReassignedRmEvent(string FacilityReference, string OldRmEmail, string NewRmEmail, string ReassignedBy, DateTime Timestamp);

// --- PAYMENT TRANSITION EVENTS ---
public record FacilityPaymentProcessedEvent(string FacilityReference, string TransactionType, string CreatedByEmail, string Status, decimal Amount, DateTime Timestamp);

public record ReversedFacilityPaymentProcessedEvent(string FacilityReference, string TransactionType, string CreatedByEmail, string Status, string TransDesc, decimal Amount, DateTime Timestamp);
public record ValuerPaymentProcessedEvent(string FacilityReference, string TransactionType, string ValuerEmail, string Status, decimal Amount, DateTime Timestamp);

public record ReverseValuerPaymentProcessedEvent(string FacilityReference, string TransactionType, string ValuerEmail, string Status, decimal Amount, DateTime Timestamp);

// --- VALUATION WORKFLOW EVENTS ---
public record FacilityAssignedToValuerEvent(string FacilityReference, int ValuerId, string ValuerName, string ValuerEmail, DateTime Timestamp);
public record FacilityReassignedAndWithdrawnEvent(string FacilityReference, int OldValuerId, int? NewValuerId, string ValuerEmail, string Reason, DateTime Timestamp);
public record FacilityReportUploadedEvent(string FacilityReference, string ValuerName, string CMEmail, string ReportPath, DateTime Timestamp);
public record FacilityReportApprovedEvent(string FacilityReference, string valuerName, string CMsEmail, DateTime Timestamp);
public record FacilityReportRejectedEvent(string FacilityReference, string RejectedBy, string ValuerEmail, string Comment, DateTime Timestamp);
public record FacilityReportCompletedEvent(string FacilityReference, string CreatedByEmail, string valuerName, DateTime Timestamp);