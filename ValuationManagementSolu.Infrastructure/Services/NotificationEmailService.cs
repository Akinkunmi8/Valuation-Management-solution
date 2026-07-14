using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ValuationManagementSolu.Application.Events;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Infrastructure.Configuration;

namespace ValuationManagementSolu.Infrastructure.Services;

public class NotificationEmailService : INotificationEmailService
{
    private readonly ILogger<NotificationEmailService> _logger;
    private readonly SmtpSettings _settings;

    public NotificationEmailService(ILogger<NotificationEmailService> logger, IOptions<SmtpSettings> settings)
    {
        _logger = logger;
        _settings = settings.Value;
    }

    private async Task SendEmailAsync(string recipientEmail, string subject, string htmlBody, List<string>? copy = null)
    {
        // 1. Defend against null, empty, or obviously invalid recipient emails
        if (string.IsNullOrWhiteSpace(recipientEmail) || !recipientEmail.Contains("@"))
        {
            var errorMsg = $"[SMTP Guard] Aborting dispatch. Recipient email '{recipientEmail}' is null, empty, or malformed.";
            _logger.LogError(errorMsg);
            throw new FormatException(errorMsg); // Thrown intentionally to flag the EventOutbox as failed/retry
        }

        try
        {
            using var message = new MailMessage();
            message.From = new MailAddress(_settings.SenderEmail, _settings.SenderName);
            message.To.Add(recipientEmail.Trim());
            message.Subject = subject;
            message.Body = htmlBody;
            message.IsBodyHtml = true;

            // 2. Process explicit CC parameters safely
            if (copy != null && copy.Any())
            {
                foreach (var email in copy.Where(e => !string.IsNullOrWhiteSpace(e) && e.Contains("@")))
                {
                    message.CC.Add(email.Trim());
                }
            }
            // 3. Fallback to global AppSettings CC entries safely
            else if (_settings.DefaultCcAddresses != null && _settings.DefaultCcAddresses.Any())
            {
                foreach (var email in _settings.DefaultCcAddresses.Where(e => !string.IsNullOrWhiteSpace(e) && e.Contains("@")))
                {
                    message.CC.Add(email.Trim());
                }
            }

            using var client = new SmtpClient(_settings.Host, _settings.Port);
            client.Credentials = new NetworkCredential(_settings.Username, _settings.Password);
            client.EnableSsl = _settings.EnableSsl;

            await client.SendMailAsync(message);
            _logger.LogInformation($"Successfully transmitted email notification out to: {recipientEmail}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Critical failure dispatching SMTP email message block down network port to: {recipientEmail}");
            throw; // Re-throw to trigger EventOutbox retry counter incrementation
        }
    }

    public async Task NotifyFacilityCreatedAsync(FacilityCreatedEvent ev)
    {
        string body = EmailTemplates.FacilityCreated(ev.FacilityReference);
        // Note: Replace with ev.RecipientEmail dynamic properties from your core model payloads
        await SendEmailAsync(ev.CreatedByEmail, "Alert: New Facility Created", body);
    }

    public async Task NotifyFacilityApprovedAsync(FacilityApprovedEvent ev)
    {
        string body = EmailTemplates.FacilityApproved(ev.FacilityReference);

        // Alerts the Relationship Management team that the business line is cleared
        await SendEmailAsync(ev.CreatedByEmail, $"Approved: Credit Facility {ev.FacilityReference} Finalized", body);
    }
    public async Task NotifyFacilityRejectedAsync(FacilityRejectedEvent ev)
    {
        string body = EmailTemplates.FacilityRejected(ev.FacilityReference, ev.Comment);
        await SendEmailAsync(ev.CreatedByEmail, "Rejected: Facility Request Dropped", body);
    }

    public async Task NotifyValuerAssignedAsync(FacilityAssignedToValuerEvent ev)
    {
        string body = EmailTemplates.ValuerAssigned(ev.FacilityReference, ev.ValuerName);
        await SendEmailAsync(ev.ValuerEmail, "New Asset Assignment Notice", body);
    }

    public async Task NotifyReportUploadedAsync(FacilityReportUploadedEvent ev)
    {
        string body = EmailTemplates.ReportUploaded(ev.FacilityReference, ev.ValuerName);
        await SendEmailAsync(ev.CMEmail, "Review: Asset Report Received", body);
    }

    public async Task NotifyReportApproveAsync(FacilityReportApprovedEvent ev)
    {
        string body = EmailTemplates.ReportApproved(ev.FacilityReference, ev.valuerName);
        await SendEmailAsync(ev.CMsEmail, "Review: Asset Report Approved", body);
    }

    public async Task NotifyReportRejectedAsync(FacilityReportRejectedEvent ev)
    {
        string body = EmailTemplates.ReportRejected(ev.FacilityReference, ev.Comment);
        await SendEmailAsync(ev.ValuerEmail, "Action Required: Valuation Report Returned", body);
    }

    public async Task NotifyCustomerPaymentProcessedAsync(FacilityPaymentProcessedEvent ev)
    {
        // ev.CreatedBy (or ev.CustomerEmail) acts as the recipient
        string body = EmailTemplates.CustomerPaymentProcessed(ev.FacilityReference, ev.Status, ev.Amount);
        await SendEmailAsync(ev.CreatedByEmail, $"Payment Processed: {ev.FacilityReference}", body);
    }

    public async Task NotifyCustomerPaymentReversedAsync(ReversedFacilityPaymentProcessedEvent ev)
    {
        string body = EmailTemplates.CustomerPaymentReversed(ev.FacilityReference, ev.Status, ev.TransDesc, ev.Amount);
        await SendEmailAsync(ev.CreatedByEmail, $"REVERSAL: Payment Charge Reversed - {ev.FacilityReference}", body);
    }

    public async Task NotifyValuerPayoutProcessedAsync(ValuerPaymentProcessedEvent ev)
    {
        string body = EmailTemplates.ValuerPayoutProcessed(ev.FacilityReference, ev.Status, ev.Amount);
        await SendEmailAsync(ev.ValuerEmail, $"Valuer Payout Notification: {ev.FacilityReference}", body);
    }

    public async Task NotifyValuerPayoutReversedAsync(ReverseValuerPaymentProcessedEvent ev)
    {
        string body = EmailTemplates.ValuerPayoutReversed(ev.FacilityReference, ev.Status, ev.Amount);
        await SendEmailAsync(ev.ValuerEmail, $"REVERSAL NOTICE: Valuer Payout Recalled - {ev.FacilityReference}", body);
    }

    public async Task NotifyWithdrawnAndReassignedAsync(FacilityReassignedAndWithdrawnEvent ev)
    {
        string body = EmailTemplates.WithdrawnAndReassigned(ev.FacilityReference, ev.Reason);
        await SendEmailAsync(ev.ValuerEmail, "Urgent: Assignment Withdrawal Notice", body);
    }
    public async Task NotifyReportCompletedAsync(FacilityReportCompletedEvent ev)
    {
        string body = EmailTemplates.ReportCompleted(ev.FacilityReference, ev.valuerName);

        // Dispatches to the backend verification review dashboard desks
        await SendEmailAsync(ev.CreatedByEmail, $"Completed: Valuation Report for {ev.FacilityReference}", body);
    }
}