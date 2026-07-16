using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("facility-fees/process/{facilityRef}")]
    public async Task<IActionResult> ProcessFacilityFees([FromRoute] string facilityRef)
    {
        try
        {
            var success = await _paymentService.ProcessFacilityFeesAsync(facilityRef);
            return success ? Ok(new { Success = true, Message = "Customer facility charge fees successfully collected." })
                           : BadRequest(new { Success = false, Message = "Finacle gateway declined the customer debit request." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPost("facility-fees/reverse/{facilityRef}")]
    public async Task<IActionResult> ReverseFacilityFees([FromRoute] string facilityRef)
    {
        try
        {
            await _paymentService.ReverseFacilityFeesAsync(facilityRef);
            return Ok(new { Success = true, Message = "Customer facility collection successfully reversed." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPost("valuer-fees/process/{facilityRef}")]
    public async Task<IActionResult> ProcessValuerFees([FromRoute] string facilityRef)
    {
        try
        {
            var success = await _paymentService.ProcessValuerFeesAsync(facilityRef);
            return success ? Ok(new { Success = true, Message = "Valuer vendor payout successfully transferred." })
                           : BadRequest(new { Success = false, Message = "Finacle gateway declined the valuer payout disbursement." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPost("valuer-fees/reverse/{facilityRef}")]
    public async Task<IActionResult> ReverseValuerFees([FromRoute] string facilityRef)
    {
        try
        {
            await _paymentService.ReverseValuerFeesAsync(facilityRef);
            return Ok(new { Success = true, Message = "Valuer payout disbursement successfully reversed." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("validate-facility-fee/{facilityRef}")]
    public async Task<IActionResult> ValidateFacilityFee(string facilityRef)
    {
        var isPaid = await _paymentService.ValidateFacilityFeePaymentStatusAsync(facilityRef);
        return Ok(new { facilityReference = facilityRef, isPaid = isPaid });
    }

    [HttpGet("validate-valuer-fee/{facilityRef}")]
    public async Task<IActionResult> ValidateValuerFee(string facilityRef)
    {
        var isPaid = await _paymentService.ValidateValuerFeePaymentStatusAsync(facilityRef);
        return Ok(new { facilityReference = facilityRef, isPaid = isPaid });
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetTransactionLogs([FromQuery] string status)
    {
        if (string.IsNullOrEmpty(status)) return BadRequest("Status query parameter is required.");
        try
        {
            var data = await _paymentService.GetTransactionsByStatusAsync(status);
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error gathering data entries.", Details = ex.Message });
        }
    }
}