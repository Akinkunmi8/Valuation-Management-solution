using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Infrastructure.Services;

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
    public async Task<IActionResult> ApproveFacility([FromRoute] string facilityRef, string Username)
    {
        try
        {
            await _cmService.ApproveFacilityAsync(facilityRef, Username);
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
            await _cmService.RejectFacilityAsync(dto.FacilityReference,dto.Username, dto.Comment);
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
    public async Task<IActionResult> ApproveReport([FromRoute] string facilityRef, string Username)
    {
        try
        {
            await _cmService.ApproveReportAsync(facilityRef, Username);
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
            await _cmService.RejectReportAsync(dto.FacilityReference,dto.Username, dto.Comment);
            return Ok(new { Success = true, Message = "Valuation report rejected and returned to the valuer for modifications." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("resend-approval-link")]
    [AllowAnonymous]
    public async Task<IActionResult> ResendApprovalLink([FromQuery] string facilityRef)
    {
        bool sent = await _cmService.ResendCmsApprovalEmailAsync(facilityRef);

        if (!sent)
        {
            return Content(RenderHtmlResponse("Error", $"Facility reference '{facilityRef}' could not be located."), "text/html");
        }

        return Content(RenderHtmlResponse("New Link Dispatched",
            $"A new payment authorization link has been generated and emailed to CMS for facility <strong>{facilityRef}</strong>."), "text/html");
    }

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