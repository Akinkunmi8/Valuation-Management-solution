using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using System;
using System.IO;
using System.Threading.Tasks;
using ValuationManagementSolu.Application.IServices;

namespace ValuationManagementSolu.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;

    public FileStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Uploaded file cannot be empty.");

        // 1. Establish the path to the root web folder (wwwroot)
        string wwwRootPath = _environment.WebRootPath;

        // Fallback for environments where WebRootPath might not be initialized on startup
        if (string.IsNullOrEmpty(wwwRootPath))
        {
            wwwRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        // 2. Combine paths to point to wwwroot/uploads/{folderName}
        string targetDirectory = Path.Combine(wwwRootPath, "uploads", folderName);

        // 3. Ensure the directory exists on the physical disk
        if (!Directory.Exists(targetDirectory))
        {
            Directory.CreateDirectory(targetDirectory);
        }

        // 4. Generate a unique name to prevent overwriting existing files
        string uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        string fullPhysicalPath = Path.Combine(targetDirectory, uniqueFileName);

        // 5. Stream the multi-part file directly to disk
        using (var fileStream = new FileStream(fullPhysicalPath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        // 6. Return a unified web-friendly relative path to store in the Database
        // Example output: "/uploads/title-docs/abc-123-filename.pdf"
        return $"/uploads/{folderName}/{uniqueFileName}";
    }

    public async Task<(byte[] FileBytes, string ContentType, string FileName)?> GetFileAsync(string relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath))
            return null;

        string wwwRootPath = _environment.WebRootPath;
        if (string.IsNullOrEmpty(wwwRootPath))
        {
            wwwRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        // Sanitize path formatting
        string cleanRelativePath = relativePath.TrimStart('/', '\\');
        string fullPhysicalPath = Path.Combine(wwwRootPath, cleanRelativePath);

        // Security Guard: Path Traversal Prevention
        var fullRootPath = Path.GetFullPath(wwwRootPath);
        var resolvedPhysicalPath = Path.GetFullPath(fullPhysicalPath);
        if (!resolvedPhysicalPath.StartsWith(fullRootPath, StringComparison.OrdinalIgnoreCase))
        {
            return null; // Attempted directory traversal outside wwwroot
        }

        if (!File.Exists(resolvedPhysicalPath))
        {
            return null;
        }

        // Resolve Content-Type (.pdf, .docx, .png, etc.)
        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(resolvedPhysicalPath, out var contentType))
        {
            contentType = "application/octet-stream";
        }

        byte[] fileBytes = await File.ReadAllBytesAsync(resolvedPhysicalPath);
        string fileName = Path.GetFileName(resolvedPhysicalPath);

        return (fileBytes, contentType, fileName);
    }

    public Task DeleteFileAsync(string relativePath)
    {
        if (string.IsNullOrEmpty(relativePath)) return Task.CompletedTask;

        try
        {
            string wwwRootPath = _environment.WebRootPath;
            if (string.IsNullOrEmpty(wwwRootPath))
            {
                wwwRootPath = Path.Combine(_environment.ContentRootPath, "wwwroot");
            }

            // Normalize the relative path formatting and join to root
            string cleanRelativePath = relativePath.TrimStart('/');
            string physicalPath = Path.Combine(wwwRootPath, cleanRelativePath);

            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
            }
        }
        catch (Exception)
        {
            // Fail silently or log to avoid interrupting core transactional rollback flows
        }

        return Task.CompletedTask;
    }
}