using System;
using System.Collections.Generic;
using System.Text;

namespace ValuationManagementSolu.Application.DTOs
{
    public class CmsApprovalResultDto
    {
        public bool IsSuccess { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
