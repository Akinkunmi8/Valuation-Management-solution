using Microsoft.EntityFrameworkCore;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;
// Ensure you have the correct using statement pointing to your ApplicationDbContext folder
using ValuationManagementSolu.Infrastructure.Context;

namespace ValuationManagementSolu.Infrastructure.Repository;

public class ValuationReportRepository : GenericRepository<ValuationReport>, IValuationReportRepository
{
    private readonly ApplicationDbContext _context;

    // Change 'DbContext context' to 'ApplicationDbContext context'
    public ValuationReportRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }
}