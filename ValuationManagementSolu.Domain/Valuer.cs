using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ValuationManagementSolu.Domain
{
    public class Valuer
    {
        [Key]
        public int ValuerId { get; set; }
        public string UserId { get; set; } = null!;
        public string? ValuersName { get; set; }
        public string? ValuerEmail { get; set; }
        public string? ValuerStatusId { get; set; }
        public string? ValuerAddress { get; set; }
        public string? TelephoneNumbers { get; set; }
        public string? AccountManager { get; set; }
        public bool IsDeleted { get; set; } = false;
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? PasswordChange { get; set; }
        public string? AccountNumber { get; set; }
        public ValuerStatus? Status { get; set; }
    }
}
