namespace ValuationManagementSolu.Domain;

public class EventOutbox
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FacilityReference { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty; // Holds nameof(EventRecord)
    public string Payload { get; set; } = string.Empty;   // Serialized JSON data
    public bool IsDispatched { get; set; } = false;
    public int RetryCount { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DispatchedAt { get; set; }
    public string? ErrorLog { get; set; }
}