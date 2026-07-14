namespace ValuationManagementSolu.Application.IServices;

public interface ICmActionService
{
    Task<bool> ApproveReportAsync(string facilityRef, string Username);
    Task<bool> RejectReportAsync(string facilityRef, string Username, string comment);
    Task<bool> ApproveFacilityAsync(string facilityRef, string Username);
    Task<bool> RejectFacilityAsync(string facilityRef, string Username, string comment);
}

public interface ICmsActionService
{
    Task<bool> AssignFacilityAsync(string facilityRef, int valuerId, string valuerName, string Username);
    Task<bool> CancelFacilityAsync(string facilityRef, string Username);
}