using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.Events;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Services;

public class ValuationReportService : IValuationReportService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;
    private readonly IConfiguration _configuration;


    public ValuationReportService(IUnitOfWork unitOfWork, IFileStorageService fileStorageService, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
        _configuration = configuration;
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
    public async Task<bool> CreateValuationReportAsync(CreateValuationReportDto dto, string valuerName)
    {
        if (dto == null || string.IsNullOrEmpty(dto.FacilityReference))
            throw new ArgumentException("Invalid report payload data or missing Facility Reference.");

        // 1. Fetch matching base entities across repositories
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = allFacilities.FirstOrDefault(f => f.FacilityReference == dto.FacilityReference);
        if (facility == null) throw new KeyNotFoundException($"Facility with reference {dto.FacilityReference} not found.");

        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();
        var collateral = allCollaterals.FirstOrDefault(c => c.FacilityReference == dto.FacilityReference);
        if (collateral == null) throw new KeyNotFoundException($"Collateral details for reference {dto.FacilityReference} not found.");

        // 2. Start database transaction sequence
        await _unitOfWork.BeginTransactionAsync();
        string generatedFilePath = string.Empty;

        try
        {
            // 3. Process File Upload with dynamic naming standard
            if (dto.ValuatioinReport != null && dto.ValuatioinReport.Length > 0)
            {
                // Upload file utilizing our existing framework storage service engine inside a targeted folder
                generatedFilePath = await _fileStorageService.SaveFileAsync(dto.ValuatioinReport, "ValuationReports");
            }

            // 4. Update the FACILITY entity table fields
            facility.CustomerName = dto.CustomerName;
            facility.CustomerCity = dto.City;
            facility.LocalGov = dto.LocalGov;
            facility.State = dto.State;
            facility.SalesLocation = dto.SalesLocation;
            facility.OpenMarketValue = dto.OpenMarketValue ?? 0m;
            facility.ForceSalesValue = dto.ForceSalesValue ?? 0m;
            facility.InsuranceValue = dto.InsuranceValue ?? 0m;
            facility.ValuationDate = dto.ValuationDate; // Usually moves to Pending/Reviewing upon submission
            facility.ValuationStatus = ValuationStatus.Assigned;
            // 5. Update the COLLATERAL entity table fields
            collateral.Owner = dto.Owner;
            collateral.AssetCategoryId = dto.AssetCategoryId;
            collateral.BranchValuationSum = dto.CollateralValue;
            collateral.Location = $"{dto.LocalGov}, {dto.City}"; // Combines local gov fields cleanly
            collateral.OtherDetails = $"Landsize: {dto.Landsize}. Description: {dto.PropertyDescription}";

            // 6. Instatiate and populate the VALUATION REPORT tracking table row
            var reportEntity = new ValuationReport
            {
                Id = Guid.NewGuid(),
                FacilityRef = dto.FacilityReference,
                ValuationRePortName = generatedFilePath,
                ValuersName = valuerName,
                DateAssigned = dto.DateAssigned,

                // FIX: Workflow state mapping. It's now under internal review!
                reportStatus = ReportStatus.Reviewing,  // Changed from Completed to Reviewing
                approvalStatus = ApprovalStatus.Pending, // Report specific approval is Pending
                PaymentStatus = PaymentStatus.UnProcessed
            };
            var CMEmail = _configuration["AppSettings:CollaterEmail"];
            var ev = new FacilityReportUploadedEvent(
            reportEntity.FacilityRef,
            reportEntity.ValuersName,
            CMEmail,
            generatedFilePath,
            DateTime.UtcNow
           );

            await StageOutboxEventAsync(reportEntity.FacilityRef, ev);
            await _unitOfWork.ValuationReports.AddAsync(reportEntity);

            // 7. Persist changes across all tracking contexts
            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();

            return true;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();

            // Clean up stranded file footprint out of disk if database storage crashed mid-flight
            if (!string.IsNullOrEmpty(generatedFilePath))
            {
                await _fileStorageService.DeleteFileAsync(generatedFilePath);
            }
            throw;
        }
    }


    public async Task<bool> EditAndResubmitReportAsync(string facilityRef, CreateValuationReportDto dto, string valuerName)
    {
        if (string.IsNullOrEmpty(facilityRef) || dto == null)
            throw new ArgumentException("Invalid request arguments or payload data mapping context.");

        // 1. Fetch foundational entities across repositories
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = allFacilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException($"Facility with reference {facilityRef} not found.");

        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();
        var collateral = allCollaterals.FirstOrDefault(c => c.FacilityReference == facilityRef);
        if (collateral == null) throw new KeyNotFoundException($"Collateral details for reference {facilityRef} not found.");

        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var report = allReports.FirstOrDefault(r => r.FacilityRef == facilityRef);
        if (report == null) throw new KeyNotFoundException($"No previous valuation report tracking log found for reference {facilityRef}.");

        // Guard Clause: Only explicitly rejected reports can be processed here
        if (report.approvalStatus != ApprovalStatus.Rejected)
        {
            throw new InvalidOperationException("Only valuation reports marked as 'Rejected' can be edited and resubmitted.");
        }

        // 2. Open internal transactional context boundaries
        await _unitOfWork.BeginTransactionAsync();

        string? newReportFilePath = null;
        string? oldReportFilePath = report.ValuationRePortName;

        try
        {
            // 3. Process File Upload ONLY if a new replacement document is provided
            if (dto.ValuatioinReport != null && dto.ValuatioinReport.Length > 0)
            {
                newReportFilePath = await _fileStorageService.SaveFileAsync(dto.ValuatioinReport, "ValuationReports");
                report.ValuationRePortName = newReportFilePath; // Overwrite file path pointer string
            }
            // If it's null, we do nothing. The existing ValuationRePortName stays completely intact.

            // 4. Update the FACILITY entity table fields
            facility.CustomerName = dto.CustomerName;
            facility.CustomerCity = dto.City;
            facility.LocalGov = dto.LocalGov;
            facility.State = dto.State;
            facility.SalesLocation = dto.SalesLocation;
            facility.OpenMarketValue = dto.OpenMarketValue ?? 0m;
            facility.ForceSalesValue = dto.ForceSalesValue ?? 0m;
            facility.InsuranceValue = dto.InsuranceValue ?? 0m;
            facility.ValuationDate = dto.ValuationDate;


            // Ensure workflow state keeps it assigned to the valuer tracking arena
            facility.ValuationStatus = ValuationStatus.Assigned;

            // 5. Update the COLLATERAL entity table fields
            collateral.Owner = dto.Owner;
            collateral.AssetCategoryId = dto.AssetCategoryId;
            collateral.BranchValuationSum = dto.CollateralValue;
            collateral.Location = $"{dto.LocalGov}, {dto.City}";
            collateral.OtherDetails = $"Landsize: {dto.Landsize}. Description: {dto.PropertyDescription}";

            // 6. Reset report status to queue back into the CM's review dashboard pool
            report.ValuersName = valuerName;
            report.DateAssigned = dto.DateAssigned;
            report.reportStatus = ReportStatus.Reviewing;
            report.approvalStatus = ApprovalStatus.Pending;
            report.RejectionComment = null;


            // 7. Persist changes across contexts
            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();

            // 8. SUCCESS: Purge the old physical document from disk ONLY if it was replaced
            if (dto.ValuatioinReport != null && !string.IsNullOrEmpty(oldReportFilePath))
            {
                await _fileStorageService.DeleteFileAsync(oldReportFilePath);
            }

            return true;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();

            // CLEANUP GUARD: Delete freshly uploaded file if database crashed mid-flight
            if (!string.IsNullOrEmpty(newReportFilePath))
            {
                await _fileStorageService.DeleteFileAsync(newReportFilePath);
            }
            throw;
        }
    }
    public async Task<IEnumerable<ValuerReportItemDto>> GetReportsByCategoryAsync(string category)
    {
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var allTransactions = await _unitOfWork.Transactions.GetAllAsync();

        // Join data collections together cleanly
        var dataQuery = (from f in allFacilities
                         join c in allCollaterals on f.FacilityReference equals c.FacilityReference
                         join r in allReports on f.FacilityReference equals r.FacilityRef into reportGroup
                         from r in reportGroup.DefaultIfEmpty()
                         join t in allTransactions on f.FacilityReference equals t.FacilityReference into txGroup
                         from t in txGroup.DefaultIfEmpty()
                         select new
                         {
                             Facility = f,
                             Collateral = c,
                             Report = r,
                             PaymentStatus = r != null ? r.PaymentStatus : (t != null ? t.Status : PaymentStatus.UnProcessed),
                             ReportStatus = r != null ? r.reportStatus : ReportStatus.Ongoing
                         }).ToList();

        // Filter collections based on your exact business requirements
        if (category.Equals("Pending", StringComparison.OrdinalIgnoreCase))
        {
            // Pending means assigned to valuer (has ValuerId attached) but not marked completed yet
            dataQuery = dataQuery.Where(x => x.Collateral.ValuerId > 0 && x.ReportStatus == ReportStatus.Ongoing).ToList();
        }
        else if (category.Equals("CompletedUnpaid", StringComparison.OrdinalIgnoreCase))
        {
            dataQuery = dataQuery.Where(x => x.ReportStatus == ReportStatus.Completed && x.PaymentStatus != PaymentStatus.Successful).ToList();
        }
        else if (category.Equals("CompletedPaid", StringComparison.OrdinalIgnoreCase))
        {
            dataQuery = dataQuery.Where(x => x.ReportStatus == ReportStatus.Completed && x.PaymentStatus == PaymentStatus.Successful).ToList();
        }

        // Project and sort dynamically by valuer name
        return dataQuery.Select(x => new ValuerReportItemDto
        {
            FacilityReference = x.Facility.FacilityReference,
            CustomerName = x.Facility.CustomerName,
            ValuersName = x.Report != null ? x.Report.ValuersName : "Assigned Vendor",
            ValuerId = x.Collateral.ValuerId,
            ReportStatus = x.ReportStatus.ToString(),
            ApprovalStatus = x.Facility.ApprovalStatus.ToString(),
            PaymentStatus = x.PaymentStatus.ToString(),
            DateAssigned = x.Facility.DateAdded
        }).OrderBy(u => u.ValuersName).ThenBy(u => u.ValuerId).ToList();
    }

    public async Task<bool> WithdrawAndReassignValuationAsync(string facilityRef, int newValuerId, string newValuerName)
    {
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = allFacilities.FirstOrDefault(f => f.FacilityReference == facilityRef);
        if (facility == null) throw new KeyNotFoundException("Target facility record reference not found.");

        var allCollaterals = await _unitOfWork.Collaterals.GetAllAsync();
        var collateral = allCollaterals.FirstOrDefault(c => c.FacilityReference == facilityRef);
        if (collateral == null) throw new KeyNotFoundException("Target collateral record link parameters missing.");

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // 1. Establish structural cancellation status trace for the failing uncompleted pipeline execution pass
            facility.ApprovalStatus = ApprovalStatus.Rejected; // Marks active context cancelled for old trace

            // 2. Wipe clean or reset legacy valuation record tracking row if any existed prematurely
            var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
            var olderReport = allReports.FirstOrDefault(r => r.FacilityRef == facilityRef);
            if (olderReport != null)
            {
                olderReport.approvalStatus = ApprovalStatus.Rejected; // Marks historic entry trace cancelled
            }

            // 3. Shift core operational parameters immediately to point over to the newly assigned valuer profile
            collateral.ValuerId = newValuerId;
            facility.ApprovalStatus = ApprovalStatus.Pending; // Returns to pending pool for the new valuer's review

            await _unitOfWork.CompleteAsync();
            await _unitOfWork.CommitTransactionAsync();
            return true;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<ValuationReportDetailsDto> GetValuationReportDetailsAsync(string facilityRef, string baseUrl)
    {
        if (string.IsNullOrWhiteSpace(facilityRef))
            throw new ArgumentException("Facility Reference must be provided.");

        // 1. Retrieve all matching records across tracking entities
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var report = allReports.OrderByDescending(r => r.DateAssigned)
                               .FirstOrDefault(r => r.FacilityRef == facilityRef);

        if (report == null)
            throw new KeyNotFoundException($"No valuation report found for reference '{facilityRef}'.");

        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = allFacilities.FirstOrDefault(f => f.FacilityReference == facilityRef);

        var allCollateral = await _unitOfWork.Collaterals.GetAllAsync();
        var collateral = allCollateral.FirstOrDefault(c => c.FacilityReference == facilityRef);

        // 2. Construct the downloadable file URL dynamically
        string downloadUrl = string.Empty;
        if (!string.IsNullOrEmpty(report.ValuationRePortName))
        {
            // Formats URL e.g., https://your-domain.com/api/ValuationReport/download/20260715100356862984
            downloadUrl = $"{baseUrl.TrimEnd('/')}/api/ValuationReport/download/{facilityRef}";
        }

        // 3. Map into response DTO
        return new ValuationReportDetailsDto
        {
            ReportId = report.Id,
            FacilityReference = report.FacilityRef,
            ValuerName = report.ValuersName,
            DateAssigned = report.DateAssigned,
            ReportStatus = report.reportStatus.ToString(),
            ReportApprovalStatus = report.approvalStatus.ToString(),
            PaymentStatus = report.PaymentStatus.ToString(),

            ReportFileName = report.ValuationRePortName,
            FileDownloadUrl = downloadUrl,

            CustomerName = facility?.CustomerName ?? string.Empty,
            City = facility?.CustomerCity ?? string.Empty,
            LocalGov = facility?.LocalGov ?? string.Empty,
            State = facility?.State ?? string.Empty,
            SalesLocation = facility?.SalesLocation ?? string.Empty,

            OpenMarketValue = facility?.OpenMarketValue ?? 0m,
            ForceSalesValue = facility?.ForceSalesValue ?? 0m,
            InsuranceValue = facility?.InsuranceValue ?? 0m,
            ValuationDate = facility?.ValuationDate,

            CollateralOwner = collateral?.Owner ?? string.Empty,
            AssetCategoryId = collateral?.AssetCategoryId ?? AssetCategory.Mortage,
            BranchValuationSum = collateral?.BranchValuationSum ?? 0m,
            CollateralLocation = collateral?.Location ?? string.Empty,
            OtherDetails = collateral?.OtherDetails ?? string.Empty
        };
    }

    public async Task<CompletedValuationReportDto?> GetCompletedReportByAccountNumberAsync(string accountNumber)
    {
        if (string.IsNullOrWhiteSpace(accountNumber)) return null;

        // 1. Fetch target facility using AccountNumber
        var allFacilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = allFacilities.FirstOrDefault(f => f.AccountNumber == accountNumber);

        if (facility == null || string.IsNullOrWhiteSpace(facility.FacilityReference))
            return null;

        // 2. Query completed valuation report associated with this FacilityRef
        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var report = allReports.FirstOrDefault(r =>
            r.FacilityRef == facility.FacilityReference &&
            r.reportStatus == ReportStatus.Completed);

        if (report == null) return null;

        // 3. Map facility & report attributes
        var dto = new CompletedValuationReportDto
        {
            FacilityRef = facility.FacilityReference,
            FacilityAmount = facility.FacilityAmount,
            Status = report.reportStatus.ToString(),
            OperativeAcc = facility.AccountNumber,
            State = facility.State,
            LocalGov = facility.LocalGov,
            PropertyDescription = facility.PropertyDescription,
            Landsize = facility.Landsize,
            ValuationDate = facility.ValuationDate,
            OpenMarketValue = facility.OpenMarketValue,
            ForceSalesValue = facility.ForceSalesValue,
            InsuranceValue = facility.InsuranceValue,
            SalesLocation = facility.SalesLocation,
            SalesDate = facility.SalesDate,
            ValuationRePortName = report.ValuationRePortName,
            ValuersName = report.ValuersName,
            DateAssigned = report.DateAssigned
        };

        // 4. Retrieve stored report document and encode to Base64
        if (!string.IsNullOrWhiteSpace(report.ValuationRePortName))
        {
            var fileResult = await _fileStorageService.GetFileAsync(report.ValuationRePortName);
            if (fileResult != null)
            {
                var (fileBytes, contentType, _) = fileResult.Value;
                dto.ValuationReportBase64 = Convert.ToBase64String(fileBytes);
                dto.ContentType = contentType;
            }
        }

        return dto;
    }

    public async Task<ApprovalValidationResultDto?> ValidateApprovalStatusAsync(string facilityRef)
    {
        if (string.IsNullOrWhiteSpace(facilityRef)) return null;

        // 1. Fetch Facility
        var facilities = await _unitOfWork.Facilities.GetAllAsync();
        var facility = facilities.FirstOrDefault(f => f.FacilityReference == facilityRef);

        if (facility == null) return null;

        // 2. Fetch Valuation Report
        var reports = await _unitOfWork.ValuationReports.GetAllAsync();
        var report = reports.FirstOrDefault(r => r.FacilityRef == facilityRef);

        // 3. Evaluate Statuses
        return new ApprovalValidationResultDto
        {
            FacilityReference = facilityRef,

            // Facility CMS Facility Approval Check
            IsFacilityApproved = facility.ApprovalStatus == ApprovalStatus.Approved,
            IsFacilityRejected = facility.ApprovalStatus == ApprovalStatus.Rejected,

            // Valuation Report Approval Checks
            IsReportApproved = report?.approvalStatus == ApprovalStatus.Approved,
            IsReportRejected = report?.approvalStatus == ApprovalStatus.Rejected
        };
    }

}