using Microsoft.AspNetCore.Mvc;
using ValuationManagementSolu.Application.IServices;

[ApiController]
[Route("api/[controller]")]
public class CmActionController : ControllerBase
{
    private readonly ICmActionService _cmService;

    public CmActionController(ICmActionService cmService)
    {
        _cmService = cmService;
    }

    [HttpPost("approve-facility/{facilityRef}")]
    public async Task<IActionResult> ApproveFacility([FromRoute] string facilityRef)
    {
        try
        {
            await _cmService.ApproveFacilityAsync(facilityRef);
            return Ok(new { Success = true, Message = "Facility successfully approved and forwarded to the Supervisor for assignment." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error processing facility approval.", Details = ex.Message });
        }
    }

    [HttpPost("reject-facility/{facilityRef}")]
    public async Task<IActionResult> RejectFacility([FromBody] RejectionRequestDto dto)
    {
        try
        {
            await _cmService.RejectFacilityAsync(dto.FacilityReference,dto.Comment);
            return Ok(new { Success = true, Message = "Facility rejected and returned to the Relationship Manager's dashboard." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error processing facility rejection.", Details = ex.Message });
        }
    }

    [HttpPost("approve-report/{facilityRef}")]
    public async Task<IActionResult> ApproveReport([FromRoute] string facilityRef)
    {
        try
        {
            await _cmService.ApproveReportAsync(facilityRef);
            return Ok(new { Success = true, Message = "Valuation report successfully approved and closed out by CM." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPost("reject-report/{facilityRef}")]
    public async Task<IActionResult> RejectReport([FromBody] RejectionRequestDto dto)
    {
        try
        {
            await _cmService.RejectReportAsync(dto.FacilityReference,dto.Comment);
            return Ok(new { Success = true, Message = "Valuation report rejected and returned to the valuer for modifications." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }
}