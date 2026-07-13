using Hoteldotnetserver.Data;
using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Microsoft.EntityFrameworkCore;
using Hoteldotnetserver.Implementation;
namespace HotelServer.Implementation
{
    public class PropertiesImpl : IPropertiesRepository

    {
        public readonly HotelDbContext _db;
        public PropertiesImpl(HotelDbContext db)
        {
            this._db = db;
        }
        public async Task<IEnumerable<Properties>> SearchPropertiesAsync(PropertiesFilterRequest request)
        {
            var query = _db.properties.AsQueryable();
            if(!string.IsNullOrEmpty(request.Name)) //searching name
            {
                query = query.Where(p => p._propertyName.Contains(request.Name));
            }
            if(request.MinPrice.HasValue) //filter with lowest values
            {                 query = query.Where(p => p.ValuePerNight >= request.MinPrice.Value);
            }
            if(request.MaxPrice.HasValue) //filter with highest values
            {
                query = query.Where(p => p.ValuePerNight <= request.MaxPrice.Value);
            }
            if(!string.IsNullOrEmpty(request.PropertyType)) //filter with property type
            {
                query = query.Where(p => p.propertyType == request.PropertyType);
            }
            if(!string.IsNullOrEmpty(request.City)) //filter with city
            {
                query = query.Where(p => p.city == request.City);
            }
            if(!string.IsNullOrEmpty(request.Country)) //filter with country
            {
                query = query.Where(p => p.country == request.Country);
            }
            if(!string.IsNullOrEmpty(request.Address)) //filter with address
            {
                query = query.Where(p => p.Address.Contains(request.Address));
            }
            if (request.OwnerId.HasValue)
            {
                query = query.Where(x => x._propertyOwnerId == request.OwnerId.Value);
            }
            
            query = request.SortBy switch
            {
                "price_asc" => query.OrderBy(p => p.ValuePerNight),
                "price_desc" => query.OrderByDescending(p => p.ValuePerNight),
                _ => query.OrderBy(p => p.createdAt) //default order by created date
            };
            return await query.ToListAsync();
            
        }
        public async Task<Properties?> GetPropertiesAsync(Guid id)
        {
            return await _db.properties
                .Include(p => p.PropertyImages)
                .Include(p => p.PropertyAmenities)
                .ThenInclude(pa => pa.Amenity)
                .Include(p => p.Rooms)
                .ThenInclude(r => r.RoomImages)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p._propertyId == id);
        }
        public async Task<PaginationResponse<Properties>> GetAllAsync()
        {
            var properties = await _db.properties.ToListAsync();
            return new PaginationResponse<Properties>
            {
                Items = properties,
                TotalCount = properties.Count
            };
        }
        
        public async Task<Properties> CreatePropertyAsync(Properties property)
        {
            var exit = await _db.properties.AnyAsync(p => p._propertyName == property._propertyName);
            if (exit)            {
                throw new InvalidOperationException("Property with the same name already exists.");
            }
            using var transaction = await _db.Database.BeginTransactionAsync();
            try
            {
                _db.properties.Add(property);// Add the property to the context
                
                
                await _db.SaveChangesAsync();
                await transaction.CommitAsync();
                return property;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw ;
            }
            
          
        }
        public async Task UpdatePropertyAsync(Properties property)
        {
            var existingProperty = await _db.properties.Include(p => p.PropertyImages)
                .Include(p => p.PropertyAmenities)
                .FirstOrDefaultAsync(p => p._propertyId == property._propertyId);   
           
            using var transaction = await _db.Database.BeginTransactionAsync();
            try
            { // Copy các field
        existingProperty._propertyName = property._propertyName;
        existingProperty._propertyDescription = property._propertyDescription;
        existingProperty.city = property.city;
        existingProperty.country = property.country;
        existingProperty.Address = property.Address;
        existingProperty.propertyType = property.propertyType;
        existingProperty.ValuePerNight = property.ValuePerNight;
        existingProperty.status = property.status;
                _db.propertyImages.RemoveRange(_db.propertyImages.Where(pi => pi._propertyId == property._propertyId));
                _db.PropertyAmenities.RemoveRange(_db.PropertyAmenities.Where(pa => pa._propertyId == property._propertyId));
                foreach(var image in property.PropertyImages)
                {
                    _db.propertyImages.Add(image);
                }
                foreach(var amenity in property.PropertyAmenities)
                {
                    _db.PropertyAmenities.Add(amenity);
                }
                Console.WriteLine(existingProperty == null);

Console.WriteLine(property._propertyName);
Console.WriteLine(property._propertyDescription);
Console.WriteLine(property.city);
Console.WriteLine(property.country);
                await _db.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch(Exception ex)
            {
                await transaction.RollbackAsync();
                 Console.WriteLine(ex);
    Console.WriteLine(ex.InnerException?.Message);
                throw;
            }
              
           
        }
        public async Task DeletePropertyAsync(Guid id)
        {
            var property = await _db.properties.FindAsync(id);
            if (property != null)
            {
                property.MarkUnavailable();
                await _db.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Properties>> GetTrendingPropertiesAsync()
        {
            var fromdate = DateTime.UtcNow.AddDays(-30); // Define the time frame for trending properties (e.g., last 30 days)
            var trendingProperties = await _db.properties
               .Where(p=> p.Reviews.Average(r => r._rating) >= 4.0) // Filter properties with average rating >= 4.0
                .OrderByDescending(p => p.createdAt) // Order by the number of bookings or any other metric you prefer
                 .Take(5) // Get the top 5 trending properties
                 .ToListAsync();

            return trendingProperties;
        }

        public async Task<PropertyFavoriteCountResponse> GetPropertyFavoriteCountAsync(Guid propertyId)
        {
            var favoriteCount = await _db.Favorites
                .Where(f => f.Property._propertyId == propertyId)
                .CountAsync();

            return new PropertyFavoriteCountResponse
            {
                FavoriteCount = favoriteCount
            };
        }
        public async Task<IEnumerable<Properties>> GetPropertiesByOwnerIdAsync(Guid ownerId)
        {
            return await _db.properties
                .Where(p => p._propertyOwnerId == ownerId && p.status == PropertyStatus.available)
                .ToListAsync();
        }
        
    }
}
