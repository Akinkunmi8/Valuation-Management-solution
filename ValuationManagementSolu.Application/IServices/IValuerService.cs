using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface IValuerService
{
    Task<bool> ProfileValuerAsync(ValuerProfilingDto dto);
    Task<IEnumerable<ValuerDropdownDto>> GetAllValuersForDropdownAsync();
}