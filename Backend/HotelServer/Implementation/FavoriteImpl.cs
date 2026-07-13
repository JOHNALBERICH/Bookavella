using Hoteldotnetserver.Data;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Repository;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Implementation
{
    public class FavoriteImpl : IFavoritesRepository
    {
        private readonly HotelDbContext _dbContext;

        public FavoriteImpl(HotelDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Favorites> CreateFavoriteAsync(Favorites favorite)
        {
            _dbContext.Favorites.Add(favorite);
            await _dbContext.SaveChangesAsync();
            return favorite;
        }

        public async Task DeleteFavoriteAsync(Guid id)
        {
            var favorite = await _dbContext.Favorites.FindAsync(id);
            if (favorite != null)
            {
                _dbContext.Favorites.Remove(favorite);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<PaginationResponse<Favorites>> GetFavoritesByUserIdAsync(Guid userId)
        {
            var favorites = await _dbContext.Favorites.Where(f => f.UserId == userId).ToListAsync();
            return new PaginationResponse<Favorites>
            {
                Items = favorites,
                TotalCount = favorites.Count
            };
        }

        public async Task<Favorites?> GetFavoriteByUserIdAndPropertyIdAsync(Guid userId, Guid propertyId)
        {
            return await _dbContext.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);
        }
    }
}
        
