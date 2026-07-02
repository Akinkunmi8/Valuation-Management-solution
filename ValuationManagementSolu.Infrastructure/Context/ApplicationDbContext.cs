using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ValuationManagementSolu.Domain;

namespace ValuationManagementSolu.Infrastructure.Context;

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
    public DbSet<ValuationReport> valuationReports { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // 1. Crucial: Call base configurations for Identity tables mapping first
        base.OnModelCreating(builder);

        // ==========================================
        // FACILITY CONFIGURATION
        // ==========================================
        builder.Entity<Facility>(entity =>
        {
            // Configure FacilityReference as an explicit Unique/Alternate Key 
            // so other tables can confidently target it as a Foreign Key anchor point.
            entity.HasAlternateKey(f => f.FacilityReference);

            entity.Property(e => e.FacilityAmount).HasPrecision(18, 2);
            entity.Property(e => e.OpenMarketValue).HasPrecision(18, 2);
            entity.Property(e => e.ForceSalesValue).HasPrecision(18, 2);
            entity.Property(e => e.InsuranceValue).HasPrecision(18, 2);
        });

        // ==========================================
        // COLLATERAL CONFIGURATION
        // ==========================================
        builder.Entity<Collateral>(entity =>
        {
            entity.Property(e => e.BranchValuationSum).HasPrecision(18, 2);
            entity.Property(e => e.FeesCharged).HasPrecision(18, 2);

            // Relate Collateral to Facility using FacilityReference string pointer
            entity.HasOne(c => c.Facility)
                  .WithMany()
                  .HasForeignKey(c => c.FacilityReference)
                  .HasPrincipalKey(f => f.FacilityReference)
                  .OnDelete(DeleteBehavior.Cascade);

            // Link Valuer to Collateral using ValuerId
            entity.HasOne(c => c.Valuer)
                  .WithMany()
                  .HasForeignKey(c => c.ValuerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ==========================================
        // TRANSACTION CONFIGURATION
        // ==========================================
        builder.Entity<Transaction>(entity =>
        {
            entity.Property(t => t.TranAmt).HasPrecision(18, 2);

            // Relate Transaction directly to Facility using FacilityReference string pointer
            entity.HasOne<Facility>()
                  .WithMany()
                  .HasForeignKey(t => t.FacilityReference)
                  .HasPrincipalKey(f => f.FacilityReference)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ==========================================
        // VALUATION REPORT CONFIGURATION
        // ==========================================
        builder.Entity<ValuationReport>(entity =>
        {
            // Relate ValuationReport to Facility using FacilityRef string pointer
            entity.HasOne(r => r.facility)
                  .WithMany()
                  .HasForeignKey(r => r.FacilityRef)
                  .HasPrincipalKey(f => f.FacilityReference)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ==========================================
        // VALUER PROFILE CONFIGURATION (Link to User table)
        // ==========================================
        builder.Entity<Valuer>(entity =>
        {
            // 1-to-1 matching relationship between Valuer profile and base Identity ApplicationUser login.
            // (Assuming your Valuer entity features a string 'UserId' property targeting AspNetUsers).
            entity.HasOne<ApplicationUser>()
                  .WithOne()
                  .HasForeignKey<Valuer>(v => v.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}