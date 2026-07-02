using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BmDashboardController : ControllerBase
{
    private readonly IBmDashboardService _dashboardService;

    public BmDashboardController(IBmDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("branch-metrics")]
    public async Task<IActionResult> GetBranchMetrics([FromQuery] string solId)
    {
        if (string.IsNullOrEmpty(solId))
        {
            return BadRequest("Branch SOLID parameter is strictly required.");
        }

        try
        {
            var data = await _dashboardService.GetBmDashboardDataAsync(solId);
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error gathering Branch Manager statistical matrices.", Details = ex.Message });
        }
    }
}