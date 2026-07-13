using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Repository
{
    public interface IPropertyImage
    {
        public Task<IEnumerable<PropertyImages>> GetPropertyImagesByPropertyIdAsync(Guid propertyId);
        public Task<PropertyImages?> GetPropertyImageByIdAsync(Guid id);
        public Task<PropertyImages> CreatePropertyImageAsync(PropertyImages propertyImage);
        public Task UpdatePropertyImageAsync(PropertyImages propertyImage);
        public Task DeletePropertyImageAsync(Guid id);
        public Task<IEnumerable<PropertyImages>> GetImagesByPropertyIdAsync(Guid propertyId);
    }
}