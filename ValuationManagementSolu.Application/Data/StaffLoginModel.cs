using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Data
{
    public class StaffLoginModel
    {
        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
        [Required]
        public string? SoftToken { get; set; }
    }

    public class ValuerLoginModel
    {
        public string Username { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
        [Required]
        public string? SoftToken { get; set; }
    }

    public class RegisterStaff
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
    }

    public class RegisterValuer
    {
        public string? AccountNumber { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        //public ValuerStatus Status { get; set; }
    }

    public class ForgortPassword
    {
        public string? Email { get; set; }
    }
    public class ResetPassword
    {
        public string? Email { get; set; }
        public string? ResetToken { get; set; }
    }

    public class ChanagePassword
    {
        public string? Email { get; set; }
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
    }

    public class UserResponse
    {
        public string? ResponseCode { get; set; }
        public string? Message { get; set; }
        public object? User { get; set; }
    }

}
