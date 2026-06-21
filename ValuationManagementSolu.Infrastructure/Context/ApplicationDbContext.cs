using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Facility> Facilities { get; set; }
        public DbSet<Collateral> Collaterals { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Valuer> Valuers { get; set; }
        public DbSet<ApprovedLocation> ApprovedLocations { get; set; }
        public DbSet<StateAndCapital> StatesAndCapitals { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Crucial: Call base configurations for Identity tables mapping
            base.OnModelCreating(builder);

            // Precision setup for Decimal properties to avoid EF Core truncation warnings
            builder.Entity<Facility>(entity =>
            {
                entity.Property(e => e.FacilityAmount).HasPrecision(18, 2);
                entity.Property(e => e.OpenMarketValue).HasPrecision(18, 2);
                entity.Property(e => e.ForceSalesValue).HasPrecision(18, 2);
                entity.Property(e => e.InsuranceValue).HasPrecision(18, 2);
            });

            builder.Entity<Collateral>(entity =>
            {
                entity.Property(e => e.BranchValuationSum).HasPrecision(18, 2);
                entity.Property(e => e.FeesCharged).HasPrecision(18, 2);

                // Configure explicit relationships if required
                entity.HasOne(c => c.Facility)
                      .WithMany()
                      .HasForeignKey(c => c.FacilityId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<Transaction>()
                .Property(t => t.TranAmt).HasPrecision(18, 2);
        }
    }
}