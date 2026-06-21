using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Repository
{
    public interface IFacilityRepository : IGenericRepository<Facility>
    {
        Task<IEnumerable<Facility>> GetFacilitiesWithPendingValuationsAsync();
    }

    public interface ICollateralRepository : IGenericRepository<Collateral>
    {
        Task<IEnumerable<Collateral>> GetCollateralsByFacilityIdAsync(int facilityId);
    }
}