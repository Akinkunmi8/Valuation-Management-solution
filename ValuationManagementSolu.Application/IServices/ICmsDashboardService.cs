using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface ICmsDashboardService
{
    Task<CmsDashboardDataDto> GetCmsDashboardDataAsync();
}