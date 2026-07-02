using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface IValuationReportService
{
    Task<bool> CreateValuationReportAsync(CreateValuationReportDto dto, string valuerName);
    // Categorized evaluation list queries
    Task<IEnumerable<ValuerReportItemDto>> GetReportsByCategoryAsync(string category);

    // Workforce reassignment automation
    Task<bool> WithdrawAndReassignValuationAsync(string facilityRef, int newValuerId, string newValuerName);

    Task<bool> EditAndResubmitReportAsync(string facilityRef, CreateValuationReportDto dto, string valuerName);
}