using Hoteldotnetserver.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hoteldotnetserver.Data
{
    public class HotelDbContext : DbContext
    {
        public HotelDbContext(DbContextOptions<HotelDbContext> options) : base(options) 
        {

        }
        public DbSet<Users> Users { get; set; }

        public DbSet<Amenities> Amenities { get; set; }

        public DbSet<Bookings> Bookings { get; set; }

        public DbSet<Payments> Payments { get; set; }

        public DbSet<Properties> properties { get; set; }

        public DbSet<PropertyAmenities> PropertyAmenities { get; set; }

        public DbSet<PropertyImages> propertyImages { get; set; }

        public DbSet<Reviews> Reviews { get; set; }
        public DbSet<Rooms> Rooms { get; set; }
        public DbSet<RoomImages> RoomImages { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Favorites> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PropertyAmenities>()
                .HasKey(pa => new { pa._propertyId, pa._amenityId });

            modelBuilder.Entity<Properties>()
                .HasOne(p => p.User)
                .WithMany(u => u.Properties)
                .HasForeignKey(p => p._propertyOwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Bookings>()
                .HasOne(b => b.Property)
                .WithMany(p => p.Bookings)
                .HasForeignKey(b => b._propertyId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Bookings>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b._userId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Bookings>()
                .HasOne(b => b.Rooms)
                .WithMany(r => r.Bookings)
                .HasForeignKey(b => b._roomId)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Favorites>()
                .HasIndex(x => new { x.UserId, x.PropertyId })
                .IsUnique();
        }
    }
}
