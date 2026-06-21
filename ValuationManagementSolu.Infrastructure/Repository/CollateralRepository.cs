using Microsoft.EntityFrameworkCore;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;
using ValuationManagementSolu.Infrastructure.Context;

namespace ValuationManagementSolu.Infrastructure.Repository
{
    public class CollateralRepository : GenericRepository<Collateral>, ICollateralRepository
    {
        public CollateralRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Collateral>> GetCollateralsByFacilityIdAsync(int facilityId)
        {
            return await _context.Collaterals
                .Include(c => c.Valuer)
                .Where(c => c.FacilityId == facilityId)
                .ToListAsync();
        }
    }
}