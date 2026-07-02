using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValuerDashboardController : ControllerBase
{
    private readonly IValuerDashboardService _dashboardService;

    public ValuerDashboardController(IValuerDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("metrics/{valuerId:int}")]
    public async Task<IActionResult> GetValuerMetrics([FromRoute] int valuerId)
    {
        if (valuerId <= 0)
        {
            return BadRequest("A valid positive Valuer Identifier parameter is strictly required.");
        }

        try
        {
            var data = await _dashboardService.GetValuerDashboardDataAsync(valuerId);
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error compiling designated Valuer workflow execution vectors.", Details = ex.Message });
        }
    }
}