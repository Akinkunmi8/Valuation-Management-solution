using System;
using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;

namespace ValuationManagementSolu.Application.Services;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminDashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<AdminDashboardDataDto> GetAdminDashboardDataAsync()
    {
        var allUsers = await _unitOfWork.Users.GetAllAsync();

        // Assuming your UnitOfWork exposes your registered Valuer table repository
        // If your valuer entity has a specific registration status, you can filter by it here
        var allValuers = await _unitOfWork.Valuers.GetAllAsync();

        var dashboardData = new AdminDashboardDataDto();

        // Populate counts
        dashboardData.Metrics.TotalUsersCount = allUsers.Count();
        dashboardData.Metrics.TotalActiveUsersCount = allUsers.Count(u => u.IsActive == true);
        dashboardData.Metrics.TotalValuersCount = allValuers.Count();

        return dashboardData;
    }
}