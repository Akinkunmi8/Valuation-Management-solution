using ValuationManagementSolu.Application.Data;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices
{
    public interface IFacilityService
    {
        Task<IEnumerable<FacilityDto>> GetAllActiveFacilitiesAsync();
        Task<FacilityDto?> GetFacilityByIdAsync(int id);
        Task<bool> CreateNewFacilityAsync(CreateFacilityRequest request, string username);
    }
}