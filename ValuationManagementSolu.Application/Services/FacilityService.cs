using ValuationManagementSolu.Application.Data;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Services
{
    public class FacilityService : IFacilityService
    {
        private readonly IUnitOfWork _unitOfWork;

        public FacilityService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        public async Task<IEnumerable<FacilityDto>> GetAllActiveFacilitiesAsync()
        {
            var facilities = await _unitOfWork.Facilities.FindAsync(f => !f.IsDeleted);

            // Map Entity objects cleanly to DTO values
            return facilities.Select(f => new FacilityDto
            {
                FacilityId = f.FacilityId,
                AccountNumber = f.AccountNumber,
                CustomerName = f.CustomerName,
                FacilityAmount = f.FacilityAmount,
                FacilityPurpose = f.FacilityPurpose,
                ApprovalStatusDescription = f.ApprovalStatus.ToString(),
                ValuationStatusDescription = f.ValuationStatus.ToString()
            });
        }

        public async Task<FacilityDto?> GetFacilityByIdAsync(int id)
        {
            var f = await _unitOfWork.Facilities.GetByIdAsync(id);
            if (f == null || f.IsDeleted) return null;

            return new FacilityDto
            {
                FacilityId = f.FacilityId,
                AccountNumber = f.AccountNumber,
                CustomerName = f.CustomerName,
                FacilityAmount = f.FacilityAmount,
                FacilityPurpose = f.FacilityPurpose,
                ApprovalStatusDescription = f.ApprovalStatus.ToString(),
                ValuationStatusDescription = f.ValuationStatus.ToString()
            };
        }

        public async Task<bool> CreateNewFacilityAsync(CreateFacilityRequest request, string username)
        {
            var entity = new Facility
            {
                AccountNumber = request.AccountNumber,
                CustomerName = request.CustomerName,
                FacilityAmount = request.FacilityAmount,
                SOLID = request.SOLID,
                CreatedBy = username,
                DateAdded = DateTime.UtcNow,
                ApprovalStatus = ApprovalStatus.Pending,
                ValuationStatus = ValuationStatus.Assigned
            };

            await _unitOfWork.Facilities.AddAsync(entity);
            var result = await _unitOfWork.CompleteAsync();
            return result > 0;
        }
    }
}