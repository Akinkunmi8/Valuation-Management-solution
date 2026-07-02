using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValuationManagementSolu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNullableToValuerIdCollateral : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collaterals_Facilities_FacilityReference",
                table: "Collaterals");

            migrationBuilder.DropForeignKey(
                name: "FK_Collaterals_Valuers_ValuerId",
                table: "Collaterals");

            migrationBuilder.AlterColumn<int>(
                name: "ValuerId",
                table: "Collaterals",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Collaterals_Facilities_FacilityReference",
                table: "Collaterals",
                column: "FacilityReference",
                principalTable: "Facilities",
                principalColumn: "FacilityReference",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Collaterals_Valuers_ValuerId",
                table: "Collaterals",
                column: "ValuerId",
                principalTable: "Valuers",
                principalColumn: "ValuerId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collaterals_Facilities_FacilityReference",
                table: "Collaterals");

            migrationBuilder.DropForeignKey(
                name: "FK_Collaterals_Valuers_ValuerId",
                table: "Collaterals");

            migrationBuilder.AlterColumn<int>(
                name: "ValuerId",
                table: "Collaterals",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Collaterals_Facilities_FacilityReference",
                table: "Collaterals",
                column: "FacilityReference",
                principalTable: "Facilities",
                principalColumn: "FacilityReference",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Collaterals_Valuers_ValuerId",
                table: "Collaterals",
                column: "ValuerId",
                principalTable: "Valuers",
                principalColumn: "ValuerId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
