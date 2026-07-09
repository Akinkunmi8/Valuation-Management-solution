using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.Data;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;

        public AccountService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _unitOfWork = unitOfWork;
        }

        public async Task<UserResponse> LoginStaffAsync(StaffLoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return new UserResponse { ResponseCode = "99", Message = "Invalid username or password." };
            }

            if (!user.IsActive)
            {
                return new UserResponse { ResponseCode = "99", Message = "User account is deactivated." };
            }

            // Verify your SoftToken here (e.g., via an internal banking 2FA or external service)
            if (string.IsNullOrEmpty(model.SoftToken))
            {
                return new UserResponse { ResponseCode = "99", Message = "Valid soft token is required." };
            }

            var roles = await _userManager.GetRolesAsync(user);
            var tokenData = await GenerateJwtTokenAsync(user, roles);

            return new UserResponse
            {
                ResponseCode = "00",
                Message = "Staff login successful.",
                User = new { tokenData.Token, tokenData.Expiration, user.FullName, user.Email, Roles = roles, user.SolId }
            };
        }

        public async Task<UserResponse> LoginValuerAsync(ValuerLoginModel model)
        {
            // For external valuers, look up their record in the custom Valuer table first
            var valuerRecord = (await _unitOfWork.Valuers.FindAsync(v => v.ValuerEmail == model.Username && v.IsDeleted == false)).FirstOrDefault();
            if (valuerRecord == null)
            {
                return new UserResponse { ResponseCode = "99", Message = "Invalid valuer credentials." };
            }

            // Authenticate against Identity Store
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return new UserResponse { ResponseCode = "99", Message = "Invalid username or password." };
            }

            var roles = await _userManager.GetRolesAsync(user);
            var tokenData = await GenerateJwtTokenAsync(user, roles);

            return new UserResponse
            {
                ResponseCode = "00",
                Message = "Valuer login successful.",
                User = new { tokenData.Token, tokenData.Expiration, valuerRecord.ValuersName, valuerRecord.ValuerEmail, valuerRecord.AccountNumber, Roles = roles, valuerRecord.ValuerId }
            };
        }

        public async Task<UserResponse> RegisterStaffAsync(RegisterStaff model)
        {
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Role))
                return new UserResponse { ResponseCode = "99", Message = "Username and Role are required." };

            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return new UserResponse { ResponseCode = "99", Message = "User already registered." };

            var roleExists = await _roleManager.RoleExistsAsync(model.Role);
            if (!roleExists)
                return new UserResponse { ResponseCode = "99", Message = $"Specified role '{model.Role}' does not exist." };

            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Username,
                FullName = model.Username,
                SolId = "S0112",
                IsActive = true
            };

            // Set up temporary password or map password parameter to the model
            var result = await _userManager.CreateAsync(user, model.Password );
            if (!result.Succeeded)
            {
                return new UserResponse { ResponseCode = "99", Message = result.Errors.FirstOrDefault()?.Description ?? "Registration failed." };
            }

            await _userManager.AddToRoleAsync(user, model.Role);
            return new UserResponse { ResponseCode = "00", Message = "Staff registered successfully." };
        }

        public async Task<UserResponse> RegisterValuerAsync(RegisterValuer model)
        {
            if (string.IsNullOrEmpty(model.AccountNumber) || string.IsNullOrEmpty(model.Role))
                return new UserResponse { ResponseCode = "99", Message = "Account number and Role are required." };

            // Look up existing profile mapping by Account Number 
            var valuerProfile = (await _unitOfWork.Valuers.FindAsync(v => v.AccountNumber == model.AccountNumber && v.IsDeleted == false)).FirstOrDefault();
            if (valuerProfile == null)
                return new UserResponse { ResponseCode = "99", Message = "No active valuer profile found with this account number." };

            if (string.IsNullOrEmpty(valuerProfile.Username))
                return new UserResponse { ResponseCode = "99", Message = "Valuer profile is missing configured web credentials." };

            var userExists = await _userManager.FindByNameAsync(valuerProfile.Username);
            if (userExists != null)
                return new UserResponse { ResponseCode = "99", Message = "Valuer login profile already exists." };

            var user = new ApplicationUser
            {
                UserName = valuerProfile.Username,
                Email = valuerProfile.ValuerEmail,
                FullName = valuerProfile.ValuersName ?? "External Valuer",
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, "ValuerP@ss123!");
            if (!result.Succeeded)
                return new UserResponse { ResponseCode = "99", Message = result.Errors.FirstOrDefault()?.Description ?? "Failed mapping credentials." };

            await _userManager.AddToRoleAsync(user, "Valuer");
            return new UserResponse { ResponseCode = "00", Message = "Valuer assigned access role successfully." };
        }

        public async Task<UserResponse> ForgotPasswordAsync(ForgortPassword model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email ?? string.Empty);
            if (user == null)
                return new UserResponse { ResponseCode = "00", Message = "If the email matches an account, a reset token has been dispatched." };

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            // Log token or interface with an external email service provider here

            return new UserResponse { ResponseCode = "00", Message = "Reset token generated successfully.", User = new { ResetToken = token } };
        }

        public async Task<UserResponse> ResetPasswordAsync(ResetPassword model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email ?? string.Empty);
            if (user == null) return new UserResponse { ResponseCode = "99", Message = "Invalid user query request." };

            var result = await _userManager.ResetPasswordAsync(user, model.ResetToken ?? string.Empty, "NewSecureP@ss123!");
            if (!result.Succeeded)
                return new UserResponse { ResponseCode = "99", Message = result.Errors.FirstOrDefault()?.Description ?? "Failed to reset password." };

            return new UserResponse { ResponseCode = "00", Message = "Password reset applied successfully." };
        }

        public async Task<UserResponse> ChangePasswordAsync(ChanagePassword model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email ?? string.Empty);
            if (user == null) return new UserResponse { ResponseCode = "99", Message = "User reference context matching email was not located." };

            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword ?? string.Empty, model.NewPassword ?? string.Empty);
            if (!result.Succeeded)
                return new UserResponse { ResponseCode = "99", Message = result.Errors.FirstOrDefault()?.Description ?? "Failed to change password." };

            return new UserResponse { ResponseCode = "00", Message = "Password updated securely." };
        }

        private async Task<(string Token, DateTime Expiration)> GenerateJwtTokenAsync(ApplicationUser user, IList<string> roles)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));
            var expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryInMinutes"] ?? "180"));

            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName!),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Fixed here
                    new Claim("FullName", user.FullName)
                };

            // Add roles to the claims array
            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: authClaims, // This must be your List<Claim>
                expires: expiration,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expiration);
        }
    }
}