using ValuationManagementSolu.Application.Events;

namespace ValuationManagementSolu.Application.IServices;

public interface INotificationEmailService
{
    Task NotifyFacilityCreatedAsync(FacilityCreatedEvent ev);
    Task NotifyFacilityRejectedAsync(FacilityRejectedEvent ev);
    Task NotifyValuerAssignedAsync(FacilityAssignedToValuerEvent ev);
    Task NotifyReportUploadedAsync(FacilityReportUploadedEvent ev);
    Task NotifyReportRejectedAsync(FacilityReportRejectedEvent ev);
    Task NotifyCustomerPaymentStatusAsync(FacilityPaymentProcessedEvent ev);
    Task NotifyValuerPayoutStatusAsync(ValuerPaymentProcessedEvent ev);
    Task NotifyWithdrawnAndReassignedAsync(FacilityReassignedAndWithdrawnEvent ev);
}