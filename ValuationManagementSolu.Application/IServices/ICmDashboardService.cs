using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface ICmDashboardService
{
    Task<CmDashboardDataDto> GetCmDashboardDataAsync();
}