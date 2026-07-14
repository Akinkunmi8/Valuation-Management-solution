using ValuationManagementSolu.Application.Events;

namespace ValuationManagementSolu.Application.IServices;

public interface INotificationEmailService
{
    Task NotifyFacilityCreatedAsync(FacilityCreatedEvent ev);
    Task NotifyFacilityApprovedAsync(FacilityApprovedEvent ev);
    Task NotifyFacilityRejectedAsync(FacilityRejectedEvent ev);
    Task NotifyValuerAssignedAsync(FacilityAssignedToValuerEvent ev);
    Task NotifyReportUploadedAsync(FacilityReportUploadedEvent ev);
    Task NotifyReportApproveAsync(FacilityReportApprovedEvent ev);
    Task NotifyReportRejectedAsync(FacilityReportRejectedEvent ev);
    //Task NotifyCustomerPaymentStatusAsync(FacilityPaymentProcessedEvent ev);
    //Task NotifyValuerPayoutStatusAsync(ValuerPaymentProcessedEvent ev);
    Task NotifyWithdrawnAndReassignedAsync(FacilityReassignedAndWithdrawnEvent ev);
    Task NotifyReportCompletedAsync(FacilityReportCompletedEvent ev);
    Task NotifyCustomerPaymentProcessedAsync(FacilityPaymentProcessedEvent ev);
    Task NotifyCustomerPaymentReversedAsync(ReversedFacilityPaymentProcessedEvent ev);
    Task NotifyValuerPayoutProcessedAsync(ValuerPaymentProcessedEvent ev);
    Task NotifyValuerPayoutReversedAsync(ReverseValuerPaymentProcessedEvent ev);
}