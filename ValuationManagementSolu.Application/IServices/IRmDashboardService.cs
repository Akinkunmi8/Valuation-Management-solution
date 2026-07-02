using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface IRmDashboardService
{
    Task<RmDashboardDataDto> GetRmDashboardDataAsync(string createdBy, string solId);
}