using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ValuationManagementSolu.Application.Data;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("login/staff")]
        public async Task<IActionResult> LoginStaff([FromBody] StaffLoginModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var response = await _accountService.LoginStaffAsync(model);
            return response.ResponseCode == "00" ? Ok(response) : BadRequest(response);
        }

        [HttpPost("login/valuer")]
        public async Task<IActionResult> LoginValuer([FromBody] ValuerLoginModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var response = await _accountService.LoginValuerAsync(model);
            return response.ResponseCode == "00" ? Ok(response) : BadRequest(response);
        }

        [HttpPost("register/staff")]
        public async Task<IActionResult> RegisterStaff([FromBody] RegisterStaff model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var response = await _accountService.RegisterStaffAsync(model);
            return response.ResponseCode == "00" ? Ok(response) : BadRequest(response);
        }

        [HttpPost("register/valuer")]
        public async Task<IActionResult> RegisterValuer([FromBody] RegisterValuer model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var response = await _accountService.RegisterValuerAsync(model);
            return response.ResponseCode == "00" ? Ok(response) : BadRequest(response);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgortPassword model)
        {
            var response = await _accountService.ForgotPasswordAsync(model);
            return Ok(response);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassword model)
        {
            var response = await _accountService.ResetPasswordAsync(model);
            return response.ResponseCode == "00" ? Ok(response) : BadRequest(response);
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChanagePassword model)
        {
            var response = await _accountService.ChangePasswordAsync(model);
            return response.ResponseCode == "00" ? Ok(response) : BadRequest(response);
        }
    }
}