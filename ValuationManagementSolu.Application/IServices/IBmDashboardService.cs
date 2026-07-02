using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface IBmDashboardService
{
    Task<BmDashboardDataDto> GetBmDashboardDataAsync(string solId);
}