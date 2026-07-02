using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditDashboardController : ControllerBase
{
    private readonly IAuditDashboardService _dashboardService;

    public AuditDashboardController(IAuditDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("system-summary")]
    public async Task<IActionResult> GetSystemSummaryMetrics()
    {
        try
        {
            var data = await _dashboardService.GetAuditDashboardDataAsync();
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error executing global security audit diagnostics.", Details = ex.Message });
        }
    }
}