using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Hoteldotnetserver.Data;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Implementation
{
    public class AmenitiesImpl : IAmenities
    {
        private readonly HotelDbContext db;
        public AmenitiesImpl(HotelDbContext db)
        {
            this.db = db;
        }
        public async Task<Amenities> CreateAmenityAsync(Amenities amenity)
        {
            var existingAmenity = await db.Amenities.FirstOrDefaultAsync(a => a._amenityName == amenity._amenityName);
            if (existingAmenity != null) return existingAmenity; // Amenity already exists
            else
            {
                db.Amenities.Add(amenity);
                await db.SaveChangesAsync();
                return amenity;
            }
        }
        public async Task<IEnumerable<Amenities>> GetAllAmenitiesAsync()
        {
            return await db.Amenities.ToListAsync();
        }
        public async Task<Amenities?> GetAmenityByIdAsync(Guid id)
        {
            return await db.Amenities.FirstOrDefaultAsync(a => a._amenityId == id);
        }
        public async Task UpdateAmenityAsync(Amenities amenity)
        {
            db.Amenities.Update(amenity);
            await db.SaveChangesAsync();
        }
        public async Task DeleteAmenityAsync(Guid id)
        {
            var amenity = await db.Amenities.FirstOrDefaultAsync(a => a._amenityId == id);
            if (amenity != null)
            {
                db.Amenities.Remove(amenity);
                await db.SaveChangesAsync();
            }
        }

    }
}