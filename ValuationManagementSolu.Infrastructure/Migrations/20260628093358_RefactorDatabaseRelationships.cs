using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValuationManagementSolu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorDatabaseRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collaterals_Facilities_FacilityId",
                table: "Collaterals");

            migrationBuilder.DropForeignKey(
                name: "FK_Collaterals_Valuers_ValuerId",
                table: "Collaterals");

            migrationBuilder.DropIndex(
                name: "IX_Collaterals_FacilityId",
                table: "Collaterals");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Valuers",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FacilityReference",
                table: "Transactions",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FacilityReference",
                table: "Facilities",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FacilityReference",
                table: "Collaterals",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtherDetails",
                table: "Collaterals",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Facilities_FacilityReference",
                table: "Facilities",
                column: "FacilityReference");

            migrationBuilder.CreateTable(
                name: "valuationReports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FacilityRef = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ValuationRePortName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValuerId = table.Column<int>(type: "int", nullable: true),
                    ValuersName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    reportStatus = table.Column<int>(type: "int", nullable: false),
                    approvalStatus = table.Column<int>(type: "int", nullable: false),
                    PaymentStatus = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_valuationReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_valuationReports_Facilities_FacilityRef",
                        column: x => x.FacilityRef,
                        principalTable: "Facilities",
                        principalColumn: "FacilityReference",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_valuationReports_Valuers_ValuerId",
                        column: x => x.ValuerId,
                        principalTable: "Valuers",
                        principalColumn: "ValuerId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Valuers_UserId",
                table: "Valuers",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_FacilityReference",
                table: "Transactions",
                column: "FacilityReference");

            migrationBuilder.CreateIndex(
                name: "IX_Collaterals_FacilityReference",
                table: "Collaterals",
                column: "FacilityReference");

            migrationBuilder.CreateIndex(
                name: "IX_valuationReports_FacilityRef",
                table: "valuationReports",
                column: "FacilityRef");

            migrationBuilder.CreateIndex(
                name: "IX_valuationReports_ValuerId",
                table: "valuationReports",
                column: "ValuerId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Facilities_FacilityReference",
                table: "Transactions",
                column: "FacilityReference",
                principalTable: "Facilities",
                principalColumn: "FacilityReference",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Valuers_AspNetUsers_UserId",
                table: "Valuers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
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

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Facilities_FacilityReference",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Valuers_AspNetUsers_UserId",
                table: "Valuers");

            migrationBuilder.DropTable(
                name: "valuationReports");

            migrationBuilder.DropIndex(
                name: "IX_Valuers_UserId",
                table: "Valuers");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_FacilityReference",
                table: "Transactions");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Facilities_FacilityReference",
                table: "Facilities");

            migrationBuilder.DropIndex(
                name: "IX_Collaterals_FacilityReference",
                table: "Collaterals");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Valuers");

            migrationBuilder.DropColumn(
                name: "FacilityReference",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "FacilityReference",
                table: "Collaterals");

            migrationBuilder.DropColumn(
                name: "OtherDetails",
                table: "Collaterals");

            migrationBuilder.AlterColumn<string>(
                name: "FacilityReference",
                table: "Facilities",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Collaterals_FacilityId",
                table: "Collaterals",
                column: "FacilityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Collaterals_Facilities_FacilityId",
                table: "Collaterals",
                column: "FacilityId",
                principalTable: "Facilities",
                principalColumn: "FacilityId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Collaterals_Valuers_ValuerId",
                table: "Collaterals",
                column: "ValuerId",
                principalTable: "Valuers",
                principalColumn: "ValuerId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
