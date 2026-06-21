using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ValuationManagementSolu.Application.Data;
using ValuationManagementSolu.Application.DTOs;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FacilitiesController : ControllerBase
    {
        private readonly IFacilityService _facilityService;

        public FacilitiesController(IFacilityService facilityService)
        {
            _facilityService = facilityService;
        }

        [HttpGet]
        public async Task<IActionResult> GetActiveFacilities()
        {
            var results = await _facilityService.GetAllActiveFacilitiesAsync();
            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFacility(int id)
        {
            var facility = await _facilityService.GetFacilityByIdAsync(id);
            if (facility == null) return NotFound(new { Message = "Facility record not found or flagged archived." });
            return Ok(facility);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateFacility([FromBody] CreateFacilityRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Fetch name identifier context safely out of user JWT claims payload
            var username = User.Identity?.Name ?? "System";

            var success = await _facilityService.CreateNewFacilityAsync(request, username);
            if (!success) return StatusCode(500, "A database processing error occurred saving facility records.");

            return StatusCode(201, new { Status = "Success", Message = "Facility registered successfully." });
        }
    }
}