using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CmsDashboardController : ControllerBase
{
    private readonly ICmsDashboardService _dashboardService;

    public CmsDashboardController(ICmsDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("supervisor-metrics")]
    public async Task<IActionResult> GetSupervisorMetrics()
    {
        try
        {
            var data = await _dashboardService.GetCmsDashboardDataAsync();
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error compiling supervisor metrics collections.", Details = ex.Message });
        }
    }
}