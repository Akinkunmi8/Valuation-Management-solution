using ValuationManagementSolu.Application.Data;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices
{
    public interface IFacilityService
    {
        Task<IEnumerable<GetFacilityDetailsDto>> GetAllActiveFacilitiesAsync();
        Task<GetFacilityDetailsDto?> GetFacilityByIdAsync(string FacilityReference);
        Task<bool> CreateNewFacilityAsync(CreateFacilityRequest request, string username);
        Task<string> CreateFacilityWithCollateralAsync(FacilityDto dto);

        Task<bool> EditAndResubmitFacilityAsync(string facilityRef, FacilityResubmitDto dto);
        Task<bool> DeleteCancelledFacilityAsync(string facilityRef);


    }
}