using Hoteldotnetserver.Data;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Implementation
{
    public class PropertyAmenitiesImpl : IPropertyAmenities
    {
        public readonly HotelDbContext db;
        public PropertyAmenitiesImpl(HotelDbContext db)
        {
            this.db = db;
        }
        public async Task<IEnumerable<PropertyAmenities>> GetAllAmenitiesAsync()
        {
            return await db.PropertyAmenities.ToListAsync();
        }
        public async Task<PropertyAmenities> CreatePropertyAmenitiesAsync(PropertyAmenities propertyAmenities)
        {
            db.PropertyAmenities.Add(propertyAmenities);
            await db.SaveChangesAsync();
            return propertyAmenities;
        }
        public async Task UpdatePropertyAmenitiesAsync(PropertyAmenities propertyAmenities)
        {
            db.PropertyAmenities.Update(propertyAmenities);
            await db.SaveChangesAsync();
        }
        public async Task<IEnumerable<PropertyAmenities>> GetAmenitiesByPropertyIdAsync(Guid propertyId)
        {
            return await db.PropertyAmenities
                .Where(pa => pa._propertyId == propertyId)
                .Include(pa => pa.Amenity)
                .ToListAsync();
        }

    }
}