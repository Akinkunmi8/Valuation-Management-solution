using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValuerController : ControllerBase
{
    private readonly IValuerService _valuerService;

    public ValuerController(IValuerService valuerService)
    {
        _valuerService = valuerService;
    }

    [HttpPost("profile")]
    public async Task<IActionResult> ProfileValuer([FromBody] ValuerProfilingDto dto)
    {
        try
        {
            var result = await _valuerService.ProfileValuerAsync(dto);
            return Ok(new { Success = true, Message = "Valuer profile built and user credentials successfully provisioned." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred during profiling.", Details = ex.Message });
        }
    }

    [HttpGet("dropdown")]
    public async Task<IActionResult> GetValuersDropdown()
    {
        try
        {
            var valuers = await _valuerService.GetAllValuersForDropdownAsync();
            return Ok(valuers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error retrieving valuer listings context.", Details = ex.Message });
        }
    }
}