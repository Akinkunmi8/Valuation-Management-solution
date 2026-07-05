using Microsoft.Extensions.Logging;
using ValuationManagementSolu.Application.Events;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.Infrastructure.Services;

public class NotificationEmailService : INotificationEmailService
{
    private readonly ILogger<NotificationEmailService> _logger;

    public NotificationEmailService(ILogger<NotificationEmailService> logger)
    {
        _logger = logger;
    }

    public async Task NotifyFacilityCreatedAsync(FacilityCreatedEvent ev)
    {
        _logger.LogInformation($"[Notification] Email queued for Facility Created: {ev.FacilityReference}");
        await Task.CompletedTask;
    }

    public async Task NotifyFacilityRejectedAsync(FacilityRejectedEvent ev)
    {
        _logger.LogInformation($"[Notification] Email queued for Facility Rejected: {ev.FacilityReference}. Reason: {ev.Comment}");
        await Task.CompletedTask;
    }

    public async Task NotifyValuerAssignedAsync(FacilityAssignedToValuerEvent ev)
    {
        _logger.LogInformation($"[Notification] Email queued for Valuer Assignment: {ev.FacilityReference}. Assigned to: {ev.ValuerName}");
        await Task.CompletedTask;
    }

    public async Task NotifyReportUploadedAsync(FacilityReportUploadedEvent ev)
    {
        _logger.LogInformation($"[Notification] Email queued for Report Uploaded: {ev.FacilityReference} by {ev.ValuerName}");
        await Task.CompletedTask;
    }

    public async Task NotifyReportRejectedAsync(FacilityReportRejectedEvent ev)
    {
        _logger.LogInformation($"[Notification] Email queued for Report Rejected: {ev.FacilityReference}. Reason: {ev.Comment}");
        await Task.CompletedTask;
    }

    public async Task NotifyCustomerPaymentStatusAsync(FacilityPaymentProcessedEvent ev)
    {
        _logger.LogInformation($"[Notification] Email queued for Customer Payment: {ev.FacilityReference}. Status: {ev.Status}");
        await Task.CompletedTask;
    }

    public async Task NotifyValuerPayoutStatusAsync(ValuerPaymentProcessedEvent ev)
    {
        _logger.LogInformation($"[Notification] Email queued for Valuer Payout: {ev.FacilityReference}. Status: {ev.Status}");
        await Task.CompletedTask;
    }

    public async Task NotifyWithdrawnAndReassignedAsync(FacilityReassignedAndWithdrawnEvent ev)
    {
        _logger.LogInformation($"[Notification] Email queued for Withdrawal/Reassignment: {ev.FacilityReference}. Reason: {ev.Reason}");
        await Task.CompletedTask;
    }
}