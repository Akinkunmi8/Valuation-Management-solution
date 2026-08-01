using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ValuationManagementSolu.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CmsApprovalEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ApproveValuerFeesPayment",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "CmsPaymentApprovalToken",
                table: "Facilities",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CmsPaymentApprovalTokenExpiry",
                table: "Facilities",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApproveValuerFeesPayment",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "CmsPaymentApprovalToken",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "CmsPaymentApprovalTokenExpiry",
                table: "Facilities");
        }
    }
}
