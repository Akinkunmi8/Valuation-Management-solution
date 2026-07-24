using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace ValuationManagementSolu.Application.IServices;

public interface IFileStorageService
{
    /// <summary>
    /// Saves an uploaded file to the server and returns its relative web path.
    /// </summary>
    Task<string> SaveFileAsync(IFormFile file, string folderName);

    /// <summary>
    /// Deletes a file from the server using its stored relative path.
    /// </summary>
    Task DeleteFileAsync(string relativePath);

    Task<(byte[] FileBytes, string ContentType, string FileName)?> GetFileAsync(string relativePath);
}