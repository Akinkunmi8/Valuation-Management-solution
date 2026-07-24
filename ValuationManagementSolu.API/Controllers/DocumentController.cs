using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;

    public DocumentController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }

    /// <summary>
    /// Views or downloads a stored file directly by providing its saved database path.
    /// </summary>
    /// <param name="filePath">e.g. /uploads/title-docs/b8f2d1d9_Credit_Monitor.docx</param>
    /// <param name="download">Set to true to force download, false to preview in browser</param>
    [HttpGet("view-file")]
    public async Task<IActionResult> ViewFile([FromQuery] string filePath, [FromQuery] bool download = false)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            return BadRequest("File path is required.");

        var fileResult = await _fileStorageService.GetFileAsync(filePath);

        if (fileResult == null)
            return NotFound($"The requested file at path '{filePath}' was not found.");

        var fileData = fileResult.Value;

        if (download)
        {
            // Triggers "Save As" file download dialog
            return File(fileData.FileBytes, fileData.ContentType, fileData.FileName);
        }

        // Sets header to preview inline inside the browser (useful for PDFs/Images)
        Response.Headers.Append("Content-Disposition", $"inline; filename=\"{fileData.FileName}\"");
        return File(fileData.FileBytes, fileData.ContentType);
    }
}