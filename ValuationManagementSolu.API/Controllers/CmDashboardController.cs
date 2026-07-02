using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CmDashboardController : ControllerBase
{
    private readonly ICmDashboardService _dashboardService;

    public CmDashboardController(ICmDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("global-metrics")]
    public async Task<IActionResult> GetGlobalMetrics()
    {
        try
        {
            var data = await _dashboardService.GetCmDashboardDataAsync();
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error gathering Collateral Manager workflow parameters.", Details = ex.Message });
        }
    }
}