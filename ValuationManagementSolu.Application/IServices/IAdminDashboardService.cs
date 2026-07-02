using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface IAdminDashboardService
{
    Task<AdminDashboardDataDto> GetAdminDashboardDataAsync();
}