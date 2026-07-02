using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;
using ValuationManagementSolu.Infrastructure.Context;

namespace ValuationManagementSolu.Infrastructure.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction; // Track active transaction
    private IGenericRepository<ApplicationUser> _users;

    public IFacilityRepository Facilities { get; }
    public ICollateralRepository Collaterals { get; }
    public IGenericRepository<Transaction> Transactions { get; }
    public IGenericRepository<Valuer> Valuers { get; }
    public IValuationReportRepository ValuationReports { get; }
    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Facilities = new FacilityRepository(_context);
        Collaterals = new CollateralRepository(_context);
        Transactions = new GenericRepository<Transaction>(_context);
        Valuers = new GenericRepository<Valuer>(_context);
        ValuationReports = new ValuationReportRepository(_context);
    }

    public IGenericRepository<ApplicationUser> Users => _users ??= new GenericRepository<ApplicationUser>(_context);

    //public IGenericRepository<ValuationReport> ValuationReports => throw new NotImplementedException();

    public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();

    // Transaction implementations
    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }

    //public Task SaveAsync()
    //{
    //    throw new NotImplementedException();
    //}
}