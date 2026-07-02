namespace ValuationManagementSolu.Application.IServices;

public interface ICmActionService
{
    Task<bool> ApproveReportAsync(string facilityRef);
    Task<bool> RejectReportAsync(string facilityRef, string comment);
    Task<bool> ApproveFacilityAsync(string facilityRef);
    Task<bool> RejectFacilityAsync(string facilityRef, string comment);
}

public interface ICmsActionService
{
    Task<bool> AssignFacilityAsync(string facilityRef, int valuerId, string valuerName);
    Task<bool> CancelFacilityAsync(string facilityRef);
}