using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ValuationManagementSolu.Domain
{
    public class ApprovedLocation
    {
        [Key]
        public int LocationId { get; set; }
        public string? Location { get; set; }

        public int StateId { get; set; }
    }
}
