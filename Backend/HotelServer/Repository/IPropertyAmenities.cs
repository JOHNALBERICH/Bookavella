using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Repository
{
    public interface IPropertyAmenities
    {
        public Task<IEnumerable<PropertyAmenities>> GetAllAmenitiesAsync();
        public Task<PropertyAmenities> CreatePropertyAmenitiesAsync(PropertyAmenities propertyAmenities);
        
        public Task UpdatePropertyAmenitiesAsync(PropertyAmenities propertyAmenities);
        public Task<IEnumerable<PropertyAmenities>> GetAmenitiesByPropertyIdAsync(Guid propertyId);
    }
}