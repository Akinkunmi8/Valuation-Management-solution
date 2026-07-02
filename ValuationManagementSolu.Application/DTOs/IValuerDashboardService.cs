using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface IValuerDashboardService
{
    Task<ValuerDashboardDataDto> GetValuerDashboardDataAsync(int valuerId);
}