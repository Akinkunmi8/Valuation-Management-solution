using System.Text.Json;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Services;

public interface IEventPublisher
{
    Task PublishAsync<T>(string facilityRef, T eventPayload) where T : class;
}

public class DbEventPublisher : IEventPublisher
{
    private readonly IUnitOfWork _unitOfWork;

    public DbEventPublisher(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task PublishAsync<T>(string facilityRef, T eventPayload) where T : class
    {
        var outboxEntry = new EventOutbox
        {
            FacilityReference = facilityRef,
            EventType = typeof(T).Name,
            Payload = JsonSerializer.Serialize(eventPayload),
            CreatedAt = DateTime.UtcNow
        };

        // This stays attached to the active scoped DB context transaction
        await _unitOfWork.EventOutbox.AddAsync(outboxEntry);
    }
}