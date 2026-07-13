using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelServer.Migrations
{
    /// <inheritdoc />
    public partial class ReFixCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Rooms_RoomsRoomId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Users__userId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_properties__propertyId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_RoomsRoomId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "RoomsRoomId",
                table: "Bookings");

            migrationBuilder.AddColumn<Guid>(
                name: "_roomId",
                table: "Bookings",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Bookings__roomId",
                table: "Bookings",
                column: "_roomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Rooms__roomId",
                table: "Bookings",
                column: "_roomId",
                principalTable: "Rooms",
                principalColumn: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Users__userId",
                table: "Bookings",
                column: "_userId",
                principalTable: "Users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_properties__propertyId",
                table: "Bookings",
                column: "_propertyId",
                principalTable: "properties",
                principalColumn: "_propertyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Rooms__roomId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Users__userId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_properties__propertyId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings__roomId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "_roomId",
                table: "Bookings");

            migrationBuilder.AddColumn<Guid>(
                name: "RoomsRoomId",
                table: "Bookings",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_RoomsRoomId",
                table: "Bookings",
                column: "RoomsRoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Rooms_RoomsRoomId",
                table: "Bookings",
                column: "RoomsRoomId",
                principalTable: "Rooms",
                principalColumn: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Users__userId",
                table: "Bookings",
                column: "_userId",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_properties__propertyId",
                table: "Bookings",
                column: "_propertyId",
                principalTable: "properties",
                principalColumn: "_propertyId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
