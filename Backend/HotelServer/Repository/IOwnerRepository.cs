using Hoteldotnetserver.Entities;
using Hoteldotnetserver.DTO.Response;
namespace Hoteldotnetserver.Repository
{
    public interface IOwnerRepository
    {
        public Task<OwnerDashboardResponse> GetOwnerDashboardAsync();
         public Task<PropertyAnalyticsResponse> GetPropertyAnalyticsAsync(Guid propertyId);
    }
}