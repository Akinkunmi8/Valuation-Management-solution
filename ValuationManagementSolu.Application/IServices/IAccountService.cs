using System.Threading.Tasks;
using ValuationManagementSolu.Application.Data;

namespace ValuationManagementSolu.Application.IServices
{
    public interface IAccountService
    {
        Task<UserResponse> LoginStaffAsync(StaffLoginModel model);
        Task<UserResponse> LoginValuerAsync(ValuerLoginModel model);
        Task<UserResponse> RegisterStaffAsync(RegisterStaff model);
        Task<UserResponse> RegisterValuerAsync(RegisterValuer model);
        Task<UserResponse> ForgotPasswordAsync(ForgortPassword model);
        Task<UserResponse> ResetPasswordAsync(ResetPassword model);
        Task<UserResponse> ChangePasswordAsync(ChanagePassword model);
    }
}