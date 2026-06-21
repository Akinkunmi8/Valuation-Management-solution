
using Microsoft.AspNetCore.Identity;

namespace ValuationManagementSolu.Domain
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = null!;
        //public string? StaffId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}