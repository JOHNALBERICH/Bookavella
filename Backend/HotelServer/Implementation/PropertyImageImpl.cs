using Hoteldotnetserver.Data;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Microsoft.EntityFrameworkCore;

namespace Hoteldotnetserver.Implementation
{
    public class PropertyImageImpl : IPropertyImage
    {
        public readonly HotelDbContext db;

        public PropertyImageImpl(HotelDbContext db)
        {
            this.db = db;
        }
        public async Task<PropertyImages> CreatePropertyImageAsync(PropertyImages propertyImage)
        {
            db.propertyImages.Add(propertyImage);
            await db.SaveChangesAsync();
            return propertyImage;
        }

        public async Task DeletePropertyImageAsync(Guid id)
        {
            var propertyImage = await db.propertyImages.FindAsync(id);
            if (propertyImage != null)
            {
                db.propertyImages.Remove(propertyImage);
                await db.SaveChangesAsync();
            }
        }

        public async Task<PropertyImages?> GetPropertyImageByIdAsync(Guid id)
        {
            return await db.propertyImages.FindAsync(id);
        }

        public async Task<IEnumerable<PropertyImages>> GetPropertyImagesByPropertyIdAsync(Guid propertyId)
        {
            return await db.propertyImages.Where(pi => pi._propertyId == propertyId).ToListAsync();
        }
        public async Task UpdatePropertyImageAsync(PropertyImages propertyImage)
        {
            db.propertyImages.Update(propertyImage);
            await db.SaveChangesAsync();
        }
        public async Task<IEnumerable<PropertyImages>> GetImagesByPropertyIdAsync(Guid propertyId)
        {
            return await db.propertyImages.Where(pi => pi._propertyId == propertyId).ToListAsync();
        }
    }
}