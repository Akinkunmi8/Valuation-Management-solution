using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface IPaymentDashboardService
{
    Task<FacilityFeesDashboardDto> GetFacilityFeesDashboardAsync();
    Task<ValuerFeesDashboardDto> GetValuerFeesDashboardAsync();
}