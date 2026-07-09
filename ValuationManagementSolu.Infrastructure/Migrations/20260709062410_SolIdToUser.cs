using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValuationManagementSolu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SolIdToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SolId",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SolId",
                table: "AspNetUsers");
        }
    }
}
