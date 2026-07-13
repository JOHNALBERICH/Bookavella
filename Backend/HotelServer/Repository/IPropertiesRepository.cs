using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.DTO.Response;
namespace Hoteldotnetserver.Repository
{
    public interface IPropertiesRepository
    {
        public Task<IEnumerable<Properties>> SearchPropertiesAsync(PropertiesFilterRequest request);
        public Task<Properties?> GetPropertiesAsync(Guid id);

        public Task<Properties> CreatePropertyAsync(Properties property);
        public Task UpdatePropertyAsync(Properties property);
        public Task DeletePropertyAsync(Guid id);
        public Task <IEnumerable<Properties>> GetTrendingPropertiesAsync();
        public Task<PropertyFavoriteCountResponse> GetPropertyFavoriteCountAsync(Guid propertyId);
        public Task<IEnumerable<Properties>> GetPropertiesByOwnerIdAsync(Guid ownerId);
    }
}
