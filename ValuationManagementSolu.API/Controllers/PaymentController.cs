using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Infrastructure.Services;

namespace ValuationManagementSolu.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IPaymentDashboardService _paymentDashboardService;

    public PaymentController(IPaymentService paymentService, IPaymentDashboardService paymentDashboardService)
    {
        _paymentService = paymentService;
        _paymentDashboardService = paymentDashboardService;
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

    [HttpGet("dashboard/facility-fees")]
    public async Task<IActionResult> GetFacilityFeesDashboard()
    {
        var result = await _paymentDashboardService.GetFacilityFeesDashboardAsync();
        return Ok(result);
    }

    [HttpGet("dashboard/valuer-fees")]
    public async Task<IActionResult> GetValuerFeesDashboard()
    {
        var result = await _paymentDashboardService.GetValuerFeesDashboardAsync();
        return Ok(result);
    }

    [HttpGet("cms-approval")]
    [AllowAnonymous]
    public async Task<IActionResult> HandleCmsEmailApproval(
        [FromQuery] string facilityRef,
        [FromQuery] string token,
        [FromQuery] string action)
    {
        var result = await _paymentService.ProcessCmsEmailApprovalAsync(facilityRef, token, action);

        string htmlPage = RenderHtmlResponse(result.Title, result.Message);
        return Content(htmlPage, "text/html");
    }


    // Static UI rendering helper kept in the controller layer
    private static string RenderHtmlResponse(string title, string message)
    {
        return $@"
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>{title}</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f1f5f9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }}
                .card {{
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
                    max-width: 480px;
                    text-align: center;
                }}
                h2 {{
                    color: #0f172a;
                    margin-bottom: 12px;
                    font-size: 22px;
                }}
                p {{
                    color: #475569;
                    font-size: 15px;
                    line-height: 1.6;
                }}
                .badge {{
                    display: inline-block;
                    margin-top: 15px;
                    padding: 8px 16px;
                    background-color: #e2e8f0;
                    color: #334155;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                }}
            </style>
        </head>
        <body>
            <div class='card'>
                <h2>{title}</h2>
                <p>{message}</p>
                <div class='badge'>Valuation Management System</div>
            </div>
        </body>
        </html>";
    }
}