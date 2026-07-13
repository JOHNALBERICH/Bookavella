using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelServer.Migrations
{
    /// <inheritdoc />
    public partial class Initcreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Amenities",
                columns: table => new
                {
                    _amenityId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _amenityName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Amenities", x => x._amenityId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    phoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    emailVerified = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActivated = table.Column<bool>(type: "bit", nullable: false),
                    Permissions = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "properties",
                columns: table => new
                {
                    _propertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _propertyName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    _propertyOwnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _propertyDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    city = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    country = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    propertyType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    value_perNight = table.Column<int>(type: "int", nullable: false),
                    maxGuests = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_properties", x => x._propertyId);
                    table.ForeignKey(
                        name: "FK_properties_Users__propertyOwnerId",
                        column: x => x._propertyOwnerId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    _bookingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _propertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _userId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _checkInDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    _checkOutDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    _totalPrice = table.Column<int>(type: "int", nullable: false),
                    _num_Guests = table.Column<int>(type: "int", nullable: false),
                    _bookingStatus = table.Column<int>(type: "int", nullable: false),
                    _createAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    _cancelAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x._bookingId);
                    table.ForeignKey(
                        name: "FK_Bookings_Users__userId",
                        column: x => x._userId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_properties__propertyId",
                        column: x => x._propertyId,
                        principalTable: "properties",
                        principalColumn: "_propertyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PropertyAmenities",
                columns: table => new
                {
                    _propertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _amenityId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyAmenities", x => new { x._propertyId, x._amenityId });
                    table.ForeignKey(
                        name: "FK_PropertyAmenities_Amenities__amenityId",
                        column: x => x._amenityId,
                        principalTable: "Amenities",
                        principalColumn: "_amenityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PropertyAmenities_properties__propertyId",
                        column: x => x._propertyId,
                        principalTable: "properties",
                        principalColumn: "_propertyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "propertyImages",
                columns: table => new
                {
                    _imageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _propertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _imageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    _isPrimary = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_propertyImages", x => x._imageId);
                    table.ForeignKey(
                        name: "FK_propertyImages_properties__propertyId",
                        column: x => x._propertyId,
                        principalTable: "properties",
                        principalColumn: "_propertyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    _reviewId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _propertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _userId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _rating = table.Column<int>(type: "int", nullable: false),
                    _comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    _createdAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x._reviewId);
                    table.ForeignKey(
                        name: "FK_Reviews_Users__userId",
                        column: x => x._userId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_properties__propertyId",
                        column: x => x._propertyId,
                        principalTable: "properties",
                        principalColumn: "_propertyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    _paymentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _paymentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    _bookingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    _totalAmount = table.Column<int>(type: "int", nullable: false),
                    _paymentStatus = table.Column<int>(type: "int", nullable: false),
                    _paymentDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x._paymentId);
                    table.ForeignKey(
                        name: "FK_Payments_Bookings__bookingId",
                        column: x => x._bookingId,
                        principalTable: "Bookings",
                        principalColumn: "_bookingId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings__propertyId",
                table: "Bookings",
                column: "_propertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings__userId",
                table: "Bookings",
                column: "_userId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments__bookingId",
                table: "Payments",
                column: "_bookingId");

            migrationBuilder.CreateIndex(
                name: "IX_properties__propertyOwnerId",
                table: "properties",
                column: "_propertyOwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyAmenities__amenityId",
                table: "PropertyAmenities",
                column: "_amenityId");

            migrationBuilder.CreateIndex(
                name: "IX_propertyImages__propertyId",
                table: "propertyImages",
                column: "_propertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews__propertyId",
                table: "Reviews",
                column: "_propertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews__userId",
                table: "Reviews",
                column: "_userId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "PropertyAmenities");

            migrationBuilder.DropTable(
                name: "propertyImages");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Amenities");

            migrationBuilder.DropTable(
                name: "properties");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
