using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ValuationManagementSolu.Domain
{
    public class StateAndCapital
    {
        [Key]
        public int StateId { get; set; }
        public string? State { get; set; }
        public string? Capital { get; set; }
        public string? CountryId { get; set; }
    }
}
