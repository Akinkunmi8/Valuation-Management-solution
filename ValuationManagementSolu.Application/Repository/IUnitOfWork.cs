using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Repository
{
    public interface IUnitOfWork : IDisposable
    {
        IFacilityRepository Facilities { get; }
        ICollateralRepository Collaterals { get; }
        IGenericRepository<Transaction> Transactions { get; }
        IGenericRepository<Valuer> Valuers { get; }
        Task<int> CompleteAsync(); // Executes SaveChangesAsync safely
    }
}