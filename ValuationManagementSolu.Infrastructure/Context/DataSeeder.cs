using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Context
{
    public static class DataSeeder
    {
        public static async Task SeedRolesAndAdminAsync(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            // Roles required across the credit and asset valuation pipeline
            string[] roles = { "BM", "RM", "CM", "CMS", "Valuer", "Admin", "Audit" };

            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Seed a default system admin account
            var adminUsername = "superadmin";
            var adminEmail = "admin@valuationmgmt.local";

            var defaultAdmin = await userManager.FindByNameAsync(adminUsername);
            if (defaultAdmin == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = adminUsername,
                    Email = adminEmail,
                    FullName = "System Administrator",
                    //StaffId = "SYS-ADM-001",
                    IsActive = true,
                    EmailConfirmed = true
                };

                // Password strictly follows standard strong policy rules
                var result = await userManager.CreateAsync(adminUser, "SecureP@ss123!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }
}
