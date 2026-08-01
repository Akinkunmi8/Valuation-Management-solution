using System.Collections.Generic;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;

namespace ValuationManagementSolu.Application.IServices;

public interface IPaymentService
{
    // Facility Fees Operations
    Task<bool> ProcessFacilityFeesAsync(string facilityRef);
    Task<bool> ReverseFacilityFeesAsync(string facilityRef);

    // Valuer Fees Operations
    Task<bool> ProcessValuerFeesAsync(string facilityRef);
    Task<bool> ReverseValuerFeesAsync(string facilityRef);

    // History Archive
    Task<IEnumerable<ValuerReportItemDto>> GetTransactionsByStatusAsync(string status);
    Task<bool> ValidateFacilityFeePaymentStatusAsync(string FacilityRef);
    Task<bool> ValidateValuerFeePaymentStatusAsync(string FacilityRef);
    Task<CmsApprovalResultDto> ProcessCmsEmailApprovalAsync(string facilityRef, string token, string action);
}