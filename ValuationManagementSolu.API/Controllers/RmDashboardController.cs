using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RmDashboardController : ControllerBase
{
    private readonly IRmDashboardService _dashboardService;

    public RmDashboardController(IRmDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("metrics")]
    public async Task<IActionResult> GetRmDashboardMetrics([FromQuery] string createdBy, [FromQuery] string solId)
    {
        if (string.IsNullOrEmpty(createdBy) || string.IsNullOrEmpty(solId))
        {
            return BadRequest("CreatedBy identifier and Branch SolId are required.");
        }

        try
        {
            var data = await _dashboardService.GetRmDashboardDataAsync(createdBy, solId);
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error gathering RM Dashboard statistics.", Details = ex.Message });
        }
    }
}