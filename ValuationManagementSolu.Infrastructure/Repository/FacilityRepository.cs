using Microsoft.EntityFrameworkCore;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;
using ValuationManagementSolu.Infrastructure.Context;

namespace ValuationManagementSolu.Infrastructure.Repository
{
    public class FacilityRepository : GenericRepository<Facility>, IFacilityRepository
    {
        public FacilityRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Facility>> GetFacilitiesWithPendingValuationsAsync()
        {
            return await _context.Facilities
                .Where(f => f.ValuationProcessesStatus == 1 && !f.IsDeleted)
                .ToListAsync();
        }
    }
}