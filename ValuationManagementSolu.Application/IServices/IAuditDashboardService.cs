using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface IAuditDashboardService
{
    Task<AuditDashboardDataDto> GetAuditDashboardDataAsync();
}