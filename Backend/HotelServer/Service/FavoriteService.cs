using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using MapsterMapper;
namespace Hoteldotnetserver.Services
{
    public class FavoriteService
    {
        private readonly IFavoritesRepository FavoriteRepository;
        private readonly IMapper Mapper;

        public FavoriteService(IFavoritesRepository favoriteRepository, IMapper mapper)
        {
            this.FavoriteRepository = favoriteRepository;
            this.Mapper = mapper;
        }

        public async Task<FavoriteResponse> AddToFavoritesAsync(Guid userId, FavoriteRequest request)
        {
            var favorite = new Favorites
            {
                UserId = userId,
                PropertyId = request.PropertyId
            };

            await FavoriteRepository.CreateFavoriteAsync(favorite);
            var response = Mapper.Map<FavoriteResponse>(favorite);
            return response;
        }
        public async Task RemoveFromFavoritesAsync(Guid userId, Guid propertyId)
        {
            var favorite = await FavoriteRepository.GetFavoriteByUserIdAndPropertyIdAsync(userId, propertyId);
            if (favorite == null)
            {
                throw new Exception("Favorite not found.");
            }

            await FavoriteRepository.DeleteFavoriteAsync(favorite.FavoriteId);
        }
        public async Task<PaginationResponse<FavoriteResponse>> GetFavoritesByUserIdAsync(Guid userId)
        {
            var favorites = await FavoriteRepository.GetFavoritesByUserIdAsync(userId);
            var response = Mapper.Map<PaginationResponse<FavoriteResponse>>(favorites);
            return response;
        }
        
    }
}