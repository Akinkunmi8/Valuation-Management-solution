using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Repository;

public interface IUnitOfWork : IDisposable
{
    IFacilityRepository Facilities { get; }
    ICollateralRepository Collaterals { get; }
    IGenericRepository<Transaction> Transactions { get; }
    IGenericRepository<Valuer> Valuers { get; }
    //IGenericRepository<ValuationReport> ValuationReports { get; }
    IGenericRepository<ApplicationUser> Users { get; }
    IValuationReportRepository ValuationReports { get; }
    IGenericRepository<EventOutbox> EventOutbox { get; }

    Task<int> CompleteAsync();

    // Add transaction support
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
    
}