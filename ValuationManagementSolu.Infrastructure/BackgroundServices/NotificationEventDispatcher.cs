using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using ValuationManagementSolu.Application.Events;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;

namespace ValuationManagementSolu.Infrastructure.BackgroundServices;

public class NotificationEventDispatcher : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<NotificationEventDispatcher> _logger;
    private readonly TimeSpan _pollingInterval = TimeSpan.FromSeconds(10); // Wakes up every 10 seconds

    public NotificationEventDispatcher(IServiceProvider serviceProvider, ILogger<NotificationEventDispatcher> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Notification Event Dispatcher Engine initiated successfully.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await DispatchPendingEventsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred in the Event Polling background process loop.");
            }

            await Task.Delay(_pollingInterval, stoppingToken);
        }
    }

    private async Task DispatchPendingEventsAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        var notificationMailService = scope.ServiceProvider.GetRequiredService<INotificationEmailService>(); // Your UI/Mail formatter

        // Fetch a small controlled batch of pending events
        var pendingEvents = (await unitOfWork.EventOutbox.GetAllAsync())
            .Where(e => !e.IsDispatched && e.RetryCount < 3)
            .OrderBy(e => e.CreatedAt)
            .Take(20)
            .ToList();

        if (!pendingEvents.Any()) return;

        foreach (var ev in pendingEvents)
        {
            if (stoppingToken.IsCancellationRequested) break;

            try
            {
                // ROUTING ARCHITECTURE: Match event strings back onto concrete action handlers
                switch (ev.EventType)
                {
                    case nameof(FacilityCreatedEvent):
                        var createdData = JsonSerializer.Deserialize<FacilityCreatedEvent>(ev.Payload);
                        if (createdData != null) await notificationMailService.NotifyFacilityCreatedAsync(createdData);
                        break;

                    case nameof(FacilityApprovedEvent):
                        var approvedData = JsonSerializer.Deserialize<FacilityApprovedEvent>(ev.Payload);
                        if (approvedData != null) await notificationMailService.NotifyFacilityApprovedAsync(approvedData);
                        break;

                    case nameof(FacilityRejectedEvent):
                        var rejectedData = JsonSerializer.Deserialize<FacilityRejectedEvent>(ev.Payload);
                        if (rejectedData != null) await notificationMailService.NotifyFacilityRejectedAsync(rejectedData);
                        break;

                    case nameof(FacilityAssignedToValuerEvent):
                        var assignData = JsonSerializer.Deserialize<FacilityAssignedToValuerEvent>(ev.Payload);
                        if (assignData != null) await notificationMailService.NotifyValuerAssignedAsync(assignData);
                        break;

                    case nameof(FacilityReportUploadedEvent):
                        var uploadData = JsonSerializer.Deserialize<FacilityReportUploadedEvent>(ev.Payload);
                        if (uploadData != null) await notificationMailService.NotifyReportUploadedAsync(uploadData);
                        break;

                    case nameof(FacilityReportApprovedEvent):
                        var reportApproveData = JsonSerializer.Deserialize<FacilityReportApprovedEvent>(ev.Payload);
                        if (reportApproveData != null) await notificationMailService.NotifyReportApproveAsync(reportApproveData);
                        break;

                    case nameof(FacilityReportRejectedEvent):
                        var reportRejectData = JsonSerializer.Deserialize<FacilityReportRejectedEvent>(ev.Payload);
                        if (reportRejectData != null) await notificationMailService.NotifyReportRejectedAsync(reportRejectData);
                        break;

                    case nameof(FacilityPaymentProcessedEvent):
                        var customerPay = JsonSerializer.Deserialize<FacilityPaymentProcessedEvent>(ev.Payload);
                        if (customerPay != null) await notificationMailService.NotifyCustomerPaymentProcessedAsync(customerPay);
                        break;

                    case nameof(ReversedFacilityPaymentProcessedEvent):
                        var customerReverse = JsonSerializer.Deserialize<ReversedFacilityPaymentProcessedEvent>(ev.Payload);
                        if (customerReverse != null) await notificationMailService.NotifyCustomerPaymentReversedAsync(customerReverse);
                        break;

                    case nameof(ValuerPaymentProcessedEvent):
                        var valuerPayout = JsonSerializer.Deserialize<ValuerPaymentProcessedEvent>(ev.Payload);
                        if (valuerPayout != null) await notificationMailService.NotifyValuerPayoutProcessedAsync(valuerPayout);
                        break;

                    case nameof(ReverseValuerPaymentProcessedEvent):
                        var valuerReverse = JsonSerializer.Deserialize<ReverseValuerPaymentProcessedEvent>(ev.Payload);
                        if (valuerReverse != null) await notificationMailService.NotifyValuerPayoutReversedAsync(valuerReverse);
                        break;
                    case nameof(FacilityReassignedAndWithdrawnEvent):
                        var withdrawData = JsonSerializer.Deserialize<FacilityReassignedAndWithdrawnEvent>(ev.Payload);
                        if (withdrawData != null) await notificationMailService.NotifyWithdrawnAndReassignedAsync(withdrawData);
                        break;

                    case nameof(FacilityReportCompletedEvent):
                        var completedData = JsonSerializer.Deserialize<FacilityReportCompletedEvent>(ev.Payload);
                        if (completedData != null) await notificationMailService.NotifyReportCompletedAsync(completedData);
                        break;


                    // ... Implement remaining simple handler routing mapping clauses similarly
                    default:
                        _logger.LogWarning($"No explicit consumer handler mapped for notification event type: {ev.EventType}");
                        break;


                }

                ev.IsDispatched = true;
                ev.DispatchedAt = DateTime.UtcNow;
            }
            catch (Exception ex)
            {
                ev.RetryCount++;
                ev.ErrorLog = $"Error processing dispatch: {ex.Message}. StackTrace: {ex.StackTrace}";
                _logger.LogError(ex, $"Failed to dispatch event ID {ev.Id}, Event Type: {ev.EventType}. Attempt #{ev.RetryCount}");
            }
        }

        // Commit execution changes safely back onto the database logs together
        await unitOfWork.CompleteAsync();
    }
}