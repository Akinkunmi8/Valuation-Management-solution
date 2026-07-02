using System;
using System.Collections.Generic;
using System.Text;

namespace ValuationManagementSolu.Application.Static
{
    public static class ReferenceGenerator
    {
        private static readonly Random _random = new Random();

        public static string GenerateFacilityReference()
        {
            string timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            int randomDigits = _random.Next(100000, 999999);
            return $"{timestamp}{randomDigits}";
        }
    }
}
