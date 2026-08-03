using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Infrastructure.Services;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValuationReportController : ControllerBase
{
    private readonly IValuationReportService _reportService;
    private readonly IValuationReportDashboardService _valuationReportDashboardService;
    private readonly IUnitOfWork _unitOfWork;

    public ValuationReportController(IValuationReportService reportService, IUnitOfWork unitOfWork, IValuationReportDashboardService valuationReportDashboardService)
    {
        _reportService = reportService;
        _unitOfWork = unitOfWork;
        _valuationReportDashboardService = valuationReportDashboardService;
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitReport( CreateValuationReportDto dto)
    {
        try
        {
            // Dynamically ingest name from active auth user claims context or pass through profile parameter
            string currentValuer = User.Identity?.Name ?? "Assigned Valuer Vendor";

            var success = await _reportService.CreateValuationReportAsync(dto, currentValuer);
            return Ok(new { Success = true, Message = "Valuation report files successfully compiled and dispatched." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error occurred mapping submission pipeline.", Details = ex.Message });
        }
    }

    [HttpGet("download")]
    public async Task<IActionResult> DownloadReportFile([FromQuery] string facilityRef)
    {
        if (string.IsNullOrEmpty(facilityRef)) return BadRequest("Facility Reference pointer is required.");

        var allReports = await _unitOfWork.ValuationReports.GetAllAsync();
        var report = allReports.FirstOrDefault(r => r.FacilityRef == facilityRef);

        if (report == null || string.IsNullOrEmpty(report.ValuationRePortName))
        {
            return NotFound("No target valuation report documents exist matching this structural reference key.");
        }

        // Reconstruct physical file network tracking path layout using local system environment root boundaries
        string relativePath = report.ValuationRePortName.TrimStart('/');
        string physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);

        if (!System.IO.File.Exists(physicalPath))
        {
            return NotFound("The target physical document file has been moved or is currently unavailable on this server host node.");
        }

        // Evaluate binary stream MIME content type accurately
        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(physicalPath, out var contentType))
        {
            contentType = "application/octet-stream"; // Safe default binary array payload mask
        }

        var fileBytes = await System.IO.File.ReadAllBytesAsync(physicalPath);
        string cleanFileName = Path.GetFileName(physicalPath);

        // Streaming binary file layout out of the platform controller engine
        return File(fileBytes, contentType, cleanFileName);
    }

    [HttpGet("list-by-category")]
    public async Task<IActionResult> GetCategorizedReports([FromQuery] string category)
    {
        if (string.IsNullOrEmpty(category)) return BadRequest("Category parameter (Pending, CompletedUnpaid, CompletedPaid) required.");

        try
        {
            var data = await _reportService.GetReportsByCategoryAsync(category);
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error executing categorized queries.", Details = ex.Message });
        }
    }

    [HttpPost("reassign")]
    public async Task<IActionResult> ReassignValuerTask([FromQuery] string facilityRef, [FromQuery] int newValuerId, [FromQuery] string newValuerName)
    {
        if (string.IsNullOrEmpty(facilityRef) || newValuerId <= 0)
            return BadRequest("Invalid reassignment target request configurations.");

        try
        {
            var result = await _reportService.WithdrawAndReassignValuationAsync(facilityRef, newValuerId, newValuerName);
            return Ok(new { Success = true, Message = "Valuation assignment successfully withdrawn and re-allocated cleanly." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error completing workload substitution.", Details = ex.Message });
        }
    }

    [HttpPut("edit-resubmit/{facilityRef}")]
    public async Task<IActionResult> EditAndResubmitReport([FromRoute] string facilityRef, [FromForm] CreateValuationReportDto dto)
    {
        try
        {
            // Extract active authenticated user name context
            string currentValuer = User.Identity?.Name ?? "Assigned Valuer Vendor";

            var success = await _reportService.EditAndResubmitReportAsync(facilityRef, dto, currentValuer);
            return Ok(new { Success = true, Message = "Valuation report successfully updated and routed back for CM review." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error processing report resubmission pipeline.", Details = ex.Message });
        }
    }

    [HttpGet("details/{facilityRef}")]
    public async Task<IActionResult> GetReportDetails(string facilityRef)
    {
        // Build base URL dynamically from HTTP request context (works across localhost and SmarterASP.NET cloud)
        string baseUrl = $"{Request.Scheme}://{Request.Host}";

        var details = await _reportService.GetValuationReportDetailsAsync(facilityRef, baseUrl);
        return Ok(details);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetReportDashboard()
    {
        var dashboardData = await _valuationReportDashboardService.GetReportDashboardDataAsync();
        return Ok(dashboardData);
    }

    /// <summary>
    /// Gets a completed valuation report and its Base64 file contents using the customer account number.
    /// </summary>
    /// <param name="accountNumber">The target account number (e.g. 1014918875)</param>
    [HttpGet("completed-by-account/{accountNumber}")]
    public async Task<IActionResult> GetCompletedReportByAccountNumber(string accountNumber)
    {
        if (string.IsNullOrWhiteSpace(accountNumber))
            return BadRequest("Account number is required.");

        var result = await _reportService.GetCompletedReportByAccountNumberAsync(accountNumber);

        if (result == null)
            return NotFound($"No completed valuation report found for account number '{accountNumber}'.");

        return Ok(result);
    }

    /// <summary>
    /// Validates whether the facility payout and valuation report have been approved or rejected.
    /// </summary>
    /// <param name="facilityRef">The facility reference number</param>
    [HttpGet("validate-approval/{facilityRef}")]
    public async Task<IActionResult> ValidateApprovalStatus(string facilityRef)
    {
        if (string.IsNullOrWhiteSpace(facilityRef))
            return BadRequest("Facility reference parameter is required.");

        var result = await _reportService.ValidateApprovalStatusAsync(facilityRef);

        if (result == null)
            return NotFound($"Facility reference '{facilityRef}' could not be located.");

        return Ok(result);
    }
}