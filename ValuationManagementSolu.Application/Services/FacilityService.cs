using System;
using System.Text.Json;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.Data;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.Events;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Application.Static;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Application.Services;

public class FacilityService : IFacilityService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorage;

    public FacilityService(IUnitOfWork unitOfWork, IFileStorageService fileStorage)
    {
        _unitOfWork = unitOfWork;
        _fileStorage = fileStorage;
    }

    private async Task StageOutboxEventAsync<T>(string facilityRef, T eventData) where T : class
    {
        var outboxEntry = new EventOutbox
        {
            Id = Guid.NewGuid(),
            FacilityReference = facilityRef,
            EventType = typeof(T).Name,
            Payload = JsonSerializer.Serialize(eventData),
            IsDispatched = false,
            RetryCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.EventOutbox.AddAsync(outboxEntry);
    }
    public async Task<string> CreateFacilityWithCollateralAsync(FacilityDto dto)
    {
        // 1. Generate the custom unique reference
        string facilityRef = ReferenceGenerator.GenerateFacilityReference();

        // 2. Safely upload files if they exist in the incoming DTO
        string? titlePath = dto.TitleDocument != null ? await _fileStorage.SaveFileAsync(dto.TitleDocument, "title-docs") : null;
        string? approvalPath = dto.ApprovalFile != null ? await _fileStorage.SaveFileAsync(dto.ApprovalFile, "approvals") : null;
        string? indemnityPath = dto.IndemityLetter != null ? await _fileStorage.SaveFileAsync(dto.IndemityLetter, "indemnity") : null;

        // 3. Begin an atomic database transaction via Unit of Work wrapper
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // 4. Map and add the Facility Entity using your concrete repository property
            var facility = new Facility
            {
                FacilityReference = facilityRef,
                AccountNumber = dto.AccountNumber,
                SOLID = dto.SolId,
                FacilityAmount = dto.CollateralValue ?? 0,
                FacilityPurpose = dto.FacilityPurpose,
                CustomerName = dto.CustomerName,
                CustomerCity = dto.City,
                CustomerCountry = dto.Country,
                RelationshipManagersPhone = dto.RMsNumber,
                CreatedBy = dto.CreatedBy,
                DateAdded = DateTime.UtcNow
            };
            await _unitOfWork.Facilities.AddAsync(facility);

            // 5. Map and add the Collateral Entity linked via the generated Reference
            var collateral = new Collateral
            {
                FacilityReference = facilityRef,
                Owner = dto.CollateraOwener,
                CollateralAddress = dto.FacilityAddress,
                TitleType = dto.collateralType,
                State = dto.StateOfCollateral,
                Location = dto.Location,
                OtherDetails = dto.OtherDetails,
                BranchValuationSum = dto.CollateralValue ?? 0,
                FeesCharged = dto.ValuationsFees ?? 0,
                FileName = titlePath,
                ApprovalFileName = approvalPath,
                IndemnityFileName = indemnityPath
            };

            var ev = new FacilityCreatedEvent
            (
                facilityRef,
                dto.CustomerName,
                dto.AccountNumber,
                dto.CreatedBy,
                dto.SolId,
                DateTime.UtcNow

            );
            await _unitOfWork.Collaterals.AddAsync(collateral);

            // 6. Save changes and commit transaction atomically
            await StageOutboxEventAsync(facilityRef, ev);
            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();

            return facilityRef;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();

            // Clean up files from storage if the DB save fails to prevent orphaned file leak
            if (titlePath != null) await _fileStorage.DeleteFileAsync(titlePath);
            if (approvalPath != null) await _fileStorage.DeleteFileAsync(approvalPath);
            if (indemnityPath != null) await _fileStorage.DeleteFileAsync(indemnityPath);

            throw;
        }
    }

    public Task<bool> CreateNewFacilityAsync(CreateFacilityRequest request, string username)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteCancelledFacilityAsync(string facilityRef)
    {
        if (string.IsNullOrEmpty(facilityRef))
            throw new ArgumentException("Facility reference parameter cannot be empty.");

        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = allFacilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility with reference {facilityRef} not found.");

        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var associatedReport = allReports.FirstOrDefault(r => r.FacilityRef == facilityRef);

        if (associatedReport == null || associatedReport.approvalStatus != ApprovalStatus.Rejected)
        {
            throw new InvalidOperationException("Only facilities that have been explicitly cancelled can be deleted.");
        }

        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();
        var collateral = allCollaterals.FirstOrDefault(c => c.FacilityReference == facilityRef);

        // Track all file paths before we delete the database rows
        string? titleFilePath = collateral?.FileName;
        string? approvalFilePath = collateral?.ApprovalFileName;
        string? indemnityFilePath = collateral?.IndemnityFileName;
        string? reportFilePath = associatedReport?.ValuationRePortName;

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // 1. Delete rows from EF tracking memory
            if (collateral != null)
            {
                _unitOfWork.Collaterals.Delete(collateral);
            }

            if (associatedReport != null)
            {
                _unitOfWork.ValuationReports.Delete(associatedReport);
            }

            _unitOfWork.Facilities.Delete(facility);

            // 2. Commit database changes
            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();

            // 3. SUCCESS: Purge all physical files from server storage natively
            if (!string.IsNullOrEmpty(titleFilePath)) await _fileStorage.DeleteFileAsync(titleFilePath);
            if (!string.IsNullOrEmpty(approvalFilePath)) await _fileStorage.DeleteFileAsync(approvalFilePath);
            if (!string.IsNullOrEmpty(indemnityFilePath)) await _fileStorage.DeleteFileAsync(indemnityFilePath);
            if (!string.IsNullOrEmpty(reportFilePath)) await _fileStorage.DeleteFileAsync(reportFilePath);

            return true;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<bool> EditAndResubmitFacilityAsync(string facilityRef, FacilityResubmitDto dto)
    {
        if (string.IsNullOrEmpty(facilityRef) || dto == null)
            throw new ArgumentException("Invalid request arguments or payload mapping data.");

        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = allFacilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility with reference {facilityRef} not found.");

        if (facility.ApprovalStatus != ApprovalStatus.Rejected)
        {
            throw new InvalidOperationException("Only facilities with a status of 'Rejected' can be edited and resubmitted.");
        }

        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();
        var collateral = allCollaterals.FirstOrDefault(c => c.FacilityReference == facilityRef);

        await _unitOfWork.BeginTransactionAsync();

        // Track newly uploaded files so we can clean them up if the DB transaction fails
        string? newTitlePath = null;
        string? newApprovalPath = null;
        string? newIndemnityPath = null;

        // Track old files to delete ONLY after a successful DB commit
        string? oldTitlePath = collateral?.FileName;
        string? oldApprovalPath = collateral?.ApprovalFileName;
        string? oldIndemnityPath = collateral?.IndemnityFileName;

        try
        {
            // 1. Map new changes onto the Facility Entity
            facility.CustomerName = dto.CustomerName;
            facility.AccountNumber = dto.AccountNumber;
            facility.SOLID = dto.SolId;
            facility.FacilityPurpose = dto.FacilityPurpose;
            facility.CustomerCity = dto.City;
            facility.CustomerCountry = dto.Country;
            facility.RelationshipManagersPhone = dto.RMsNumber;
            facility.RejectionComment = null;

            // RESET WORKFLOW FLAGS: Returns the facility to a clean slate for processing
            facility.ApprovalStatus = ApprovalStatus.Pending;
            facility.ValuationStatus = ValuationStatus.UnAssigned;

            // 2. Process new file uploads if provided in the DTO
            if (collateral != null)
            {
                if (dto.TitleDocument != null && dto.TitleDocument.Length > 0)
                {
                    newTitlePath = await _fileStorage.SaveFileAsync(dto.TitleDocument, "title-docs");
                    collateral.FileName = newTitlePath;
                }
                if (dto.ApprovalFile != null && dto.ApprovalFile.Length > 0)
                {
                    newApprovalPath = await _fileStorage.SaveFileAsync(dto.ApprovalFile, "approval-docs");
                    collateral.ApprovalFileName = newApprovalPath;
                }
                if (dto.IndemnityLetter != null && dto.IndemnityLetter.Length > 0)
                {
                    newIndemnityPath = await _fileStorage.SaveFileAsync(dto.IndemnityLetter, "indemnity-docs");
                    collateral.IndemnityFileName = newIndemnityPath;
                }

                // Map other collateral info cleanly
                collateral.Owner = dto.CollateralOwner;
                collateral.TitleType = dto.CollateralType;
                collateral.State = dto.StateOfCollateral;
                collateral.Location = dto.Location;
                collateral.OtherDetails = dto.OtherDetails;
                collateral.BranchValuationSum = dto.CollateralValue;
                collateral.FeesCharged = dto.ValuationsFees;
            }

            var ev = new FacilityCreatedEvent
            (
                facilityRef,
                dto.CustomerName,
                dto.AccountNumber,
                facility.CreatedBy,
                dto.SolId,
                DateTime.UtcNow

            );
            await StageOutboxEventAsync(facilityRef, ev);
            await _unitOfWork.CompleteAsync(); // Persist explicitly to DB context layer
            await _unitOfWork.CommitTransactionAsync();

            // 3. SUCCESS: Safely delete the old overwritten files from disk
            if (dto.TitleDocument != null && !string.IsNullOrEmpty(oldTitlePath)) await _fileStorage.DeleteFileAsync(oldTitlePath);
            if (dto.ApprovalFile != null && !string.IsNullOrEmpty(oldApprovalPath)) await _fileStorage.DeleteFileAsync(oldApprovalPath);
            if (dto.IndemnityLetter != null && !string.IsNullOrEmpty(oldIndemnityPath)) await _fileStorage.DeleteFileAsync(oldIndemnityPath);

            return true;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();

            // CRITICAL CLEANUP: If DB failed, delete the newly uploaded files to prevent disk clutter
            if (!string.IsNullOrEmpty(newTitlePath)) await _fileStorage.DeleteFileAsync(newTitlePath);
            if (!string.IsNullOrEmpty(newApprovalPath)) await _fileStorage.DeleteFileAsync(newApprovalPath);
            if (!string.IsNullOrEmpty(newIndemnityPath)) await _fileStorage.DeleteFileAsync(newIndemnityPath);
            throw;
        }
    }

    //public Task<IEnumerable<FacilityDto>> GetAllActiveFacilitiesAsync()
    //{
    //    throw new NotImplementedException();
    //}

    public async Task<GetFacilityDetailsDto?> GetFacilityByIdAsync(string FacilityReference)
    {
        // 1. Fetch all facilities and locate the target record by database ID
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = allFacilities.FirstOrDefault(f => f.FacilityReference == FacilityReference);

        if (facility == null) return null;

        // 2. Fetch the collateral matching the unique facility tracking reference
        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();
        var collateral = allCollaterals.FirstOrDefault(c => c.FacilityReference == facility.FacilityReference);

        // 3. Map both models seamlessly back into the comprehensive creation DTO
        return new GetFacilityDetailsDto
        {
            FacilityReference = facility.FacilityReference,
            AccountNumber = facility.AccountNumber,
            SolId = facility.SOLID,
            FacilityPurpose = facility.FacilityPurpose,
            CustomerName = facility.CustomerName,
            City = facility.CustomerCity,
            Country = facility.CustomerCountry,
            RMsNumber = facility.RelationshipManagersPhone,
            CreatedBy = facility.CreatedBy,
            DateAdded = facility.DateAdded,
            ApprovalStatus = facility.ApprovalStatus,
            ValuationStatus = facility.ValuationStatus,

            // Collateral details required by the Credit Manager for review
            CollateraOwener = collateral?.Owner,
            FacilityAddress = collateral?.CollateralAddress,
            collateralType = collateral?.TitleType,
            StateOfCollateral = collateral?.State,
            Location = collateral?.Location,
            OtherDetails = collateral?.OtherDetails,
            CollateralValue = collateral?.BranchValuationSum,
            ValuationsFees = collateral?.FeesCharged,

            // Retain saved file paths so the frontend can generate preview/download links
            SavedTitleDocumentPath = collateral?.FileName,
            SavedApprovalFilePath = collateral?.ApprovalFileName,
            SavedIndemnityLetterPath = collateral?.IndemnityFileName
        };
    }

    public async Task<IEnumerable<GetFacilityDetailsDto>> GetAllActiveFacilitiesAsync()
    {
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();

        // Filter for workflows needing attention (e.g., Pending review items)
        var activeFacilities = allFacilities.Where(f => f.ApprovalStatus == ApprovalStatus.Pending);

        var resultList = new List<GetFacilityDetailsDto>();

        foreach (var facility in activeFacilities)
        {
            var collateral = allCollaterals.FirstOrDefault(c => c.FacilityReference == facility.FacilityReference);

            resultList.Add(new GetFacilityDetailsDto
            {
                FacilityReference = facility.FacilityReference,
                AccountNumber = facility.AccountNumber,
                SolId = facility.SOLID,
                CustomerName = facility.CustomerName,
                CollateralValue = collateral?.BranchValuationSum,
                DateAdded = facility.DateAdded,
                ApprovalStatus = facility.ApprovalStatus
            });
        }

        return resultList;
    }
}