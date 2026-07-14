using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValuationManagementSolu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ReviewByAndAssignBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AssignedBy",
                table: "valuationReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReportReviewBy",
                table: "valuationReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FacilityReviewBy",
                table: "Facilities",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedBy",
                table: "valuationReports");

            migrationBuilder.DropColumn(
                name: "ReportReviewBy",
                table: "valuationReports");

            migrationBuilder.DropColumn(
                name: "FacilityReviewBy",
                table: "Facilities");
        }
    }
}
