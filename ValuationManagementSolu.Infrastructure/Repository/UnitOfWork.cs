using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;
using ValuationManagementSolu.Infrastructure.Context;

namespace ValuationManagementSolu.Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public IFacilityRepository Facilities { get; }
        public ICollateralRepository Collaterals { get; }
        public IGenericRepository<Transaction> Transactions { get; }
        public IGenericRepository<Valuer> Valuers { get; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Facilities = new FacilityRepository(_context);
            Collaterals = new CollateralRepository(_context);
            Transactions = new GenericRepository<Transaction>(_context);
            Valuers = new GenericRepository<Valuer>(_context);
        }

        public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();
        public void Dispose() => _context.Dispose();
    }
}