using Hoteldotnetserver.Entities;
using Hoteldotnetserver.DTO.Response;
namespace Hoteldotnetserver.Repository
{
    public interface IFavoritesRepository
    {
        Task<Favorites> CreateFavoriteAsync(Favorites favorite);
        Task DeleteFavoriteAsync(Guid id);
        Task<PaginationResponse<Favorites>> GetFavoritesByUserIdAsync(Guid userId);
        Task<Favorites?> GetFavoriteByUserIdAndPropertyIdAsync(Guid userId, Guid propertyId);
    }
}