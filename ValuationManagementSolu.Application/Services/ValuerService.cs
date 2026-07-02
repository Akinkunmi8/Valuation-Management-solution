using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Services;

public class ValuerService : IValuerService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUnitOfWork _unitOfWork;

    public ValuerService(UserManager<ApplicationUser> userManager, IUnitOfWork unitOfWork)
    {
        _userManager = userManager;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> ProfileValuerAsync(ValuerProfilingDto dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.ValuerEmail) || string.IsNullOrEmpty(dto.Username))
            throw new ArgumentException("Valuer profiling payload data parameters are invalid.");

        // 1. Initialize Database Transaction block via our UOW layer
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // 2. Map & Create the Identity User account credentials structure
            var user = new ApplicationUser
            {
                UserName = dto.Username,
                Email = dto.ValuerEmail,
                PhoneNumber = dto.TelephoneNumbers,
                FullName = dto.ValuersName,
                IsActive = true // Setting up default active flag status
            };

            var identityResult = await _userManager.CreateAsync(user, dto.Password);

            if (!identityResult.Succeeded)
            {
                var errors = string.Join(", ", identityResult.Errors.Select(e => e.Description));
                throw new Exception($"Identity account generation error layout: {errors}");
            }

            // 3. Assign to the 'Valuer' Authorization Role profile if utilizing RBAC
            await _userManager.AddToRoleAsync(user, "Valuer");

            // 4. Map the newly structured core info into your Domain Valuers schema table record
            var valuerProfile = new Valuer
            {
                UserId = user.Id, // Foreign key string bridge matching our refactored dbContext setup
                ValuersName = dto.ValuersName,
                ValuerEmail = dto.ValuerEmail,
                ValuerAddress = dto.ValuerAddress,
                TelephoneNumbers = dto.TelephoneNumbers,
                AccountManager = dto.AccountManager,
                AccountNumber = dto.AccountNumber,
                Status = ValuerStatus.Registerd,
                IsDeleted = false
            };

            // Assuming your UnitOfWork exposes your global Valuers base operations engine
            await _unitOfWork.Valuers.AddAsync(valuerProfile);
            await _unitOfWork.CompleteAsync();

            // 5. Commit everything if clean
            await _unitOfWork.CommitTransactionAsync();
            return true;
        }
        catch (Exception)
        {
            // Rollback database modifications if any component breaks downstream
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<IEnumerable<ValuerDropdownDto>> GetAllValuersForDropdownAsync()
    {
        // Fetch all records out of the database repository context
        var allValuers = await _unitOfWork.Valuers.GetAllAsync();

        // Project strictly the Id and Name, filtering to active ones if required
        return allValuers
            .Where(v => v.Status == ValuerStatus.Registerd) // Optional: only fetch registered/active values
            .Select(v => new ValuerDropdownDto
            {
                ValuerId = v.ValuerId,
                ValuerName = v.ValuersName
            })
            .OrderBy(v => v.ValuerName)
            .ToList();
    }
}