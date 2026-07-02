using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValuationManagementSolu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRejectCommentColum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RejectionComment",
                table: "valuationReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RejectionComment",
                table: "Facilities",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RejectionComment",
                table: "valuationReports");

            migrationBuilder.DropColumn(
                name: "RejectionComment",
                table: "Facilities");
        }
    }
}
