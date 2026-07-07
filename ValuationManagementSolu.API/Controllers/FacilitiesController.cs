using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Services;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FacilitiesController : ControllerBase
{
    private readonly IFacilityService _facilityService;

    public FacilitiesController(IFacilityService facilityService)
    {
        _facilityService = facilityService;
    }

    [HttpPost("create")]
    [Consumes("multipart/form-data")] // Required for IFormFile handling alongside text
    public async Task<IActionResult> CreateFacility([FromForm] FacilityDto dto)
    {
        if (dto == null) return BadRequest("Invalid facility payload data.");

        try
        {
            string referenceNumber = await _facilityService.CreateFacilityWithCollateralAsync(dto);
            return Ok(new
            {
                Success = true,
                Message = "Facility and corresponding collateral details successfully created.",
                FacilityReference = referenceNumber
            });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Success = false, Error = ex.Message });
        }
    }

    [HttpPut("edit-resubmit/{facilityRef}")]
    public async Task<IActionResult> EditAndResubmit([FromRoute] string facilityRef,[FromForm] FacilityResubmitDto dto)
    {
        try
        {
            var result = await _facilityService.EditAndResubmitFacilityAsync(facilityRef, dto);
            return Ok(new { Success = true, Message = "Facility successfully updated and queued back into pending workflows." });
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
            return StatusCode(500, new { Message = "An error occurred during modification processing.", Details = ex.Message });
        }
    }

    [HttpDelete("remove-cancelled/{facilityRef}")]
    public async Task<IActionResult> DeleteCancelled([FromRoute] string facilityRef)
    {
        try
        {
            var result = await _facilityService.DeleteCancelledFacilityAsync(facilityRef);
            return Ok(new { Success = true, Message = "Cancelled facility and its related parameters have been purged permanently." });
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
            return StatusCode(500, new { Message = "An error occurred during database removal operations.", Details = ex.Message });
        }
    }

    [HttpGet("getFacilityDetails/{facilityRefd}")]
    public async Task<IActionResult> GetFacilityDetails(string facilityRef)
    {
        var facilityDetails = await _facilityService.GetFacilityByIdAsync(facilityRef);

        if (facilityDetails == null)
        {
            return NotFound(new { message = $"Facility details for tracking ID {facilityRef} could not be resolved." });
        }

        return Ok(facilityDetails);
    }
}