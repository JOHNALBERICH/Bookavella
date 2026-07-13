using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Repository
{
    public interface IAmenities
    {
        public Task<IEnumerable<Amenities>> GetAllAmenitiesAsync();
        public Task<Amenities?> GetAmenityByIdAsync(Guid id);
        public Task<Amenities> CreateAmenityAsync(Amenities amenity);
        public Task UpdateAmenityAsync(Amenities amenity);
        public Task DeleteAmenityAsync(Guid id);

    }
}