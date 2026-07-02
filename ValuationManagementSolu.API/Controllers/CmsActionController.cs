using Microsoft.AspNetCore.Mvc;
using ValuationManagementSolu.Application.IServices;

[ApiController]
[Route("api/[controller]")]
public class CmsActionController : ControllerBase
{
    private readonly ICmsActionService _cmsService;

    public CmsActionController(ICmsActionService cmsService)
    {
        _cmsService = cmsService;
    }

    [HttpPost("assign-valuer/{facilityRef}")]
    public async Task<IActionResult> AssignValuer([FromRoute] string facilityRef, [FromQuery] int valuerId, [FromQuery] string valuerName)
    {
        try
        {
            await _cmsService.AssignFacilityAsync(facilityRef, valuerId, valuerName);
            return Ok(new { Success = true, Message = "Valuer assigned successfully. Ticket moved to Ongoing field workflow." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPost("cancel-facility/{facilityRef}")]
    public async Task<IActionResult> CancelFacility([FromRoute] string facilityRef)
    {
        try
        {
            await _cmsService.CancelFacilityAsync(facilityRef);
            return Ok(new { Success = true, Message = "Facility workflow has been cancelled successfully by the supervisor." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }
}