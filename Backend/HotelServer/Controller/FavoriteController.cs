using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.Services;
using Microsoft.AspNetCore.Mvc;
using Hoteldotnetserver.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace HotelServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Users,Admin,PropertyOwner")]
    public class FavoriteController : ControllerBase
    {
        public readonly FavoriteService FavoriteService;
        public FavoriteController(FavoriteService favoriteService)
        {
            this.FavoriteService = favoriteService;
        }
        [HttpPost("Add-Favorite")]
        
        public async Task<ActionResult<FavoriteResponse>> AddFavorite([FromBody] FavoriteRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(await FavoriteService.AddToFavoritesAsync(userId, request));
        }
        [HttpDelete("Remove-Favorite/{propertyId}")]
        public async Task<ActionResult> RemoveFavorite(Guid propertyId)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            await FavoriteService.RemoveFromFavoritesAsync(userId, propertyId);
            return Ok(new { Message = "Favorite removed successfully." });
        }
        [HttpGet("Get-Favorites")]
        public async Task<ActionResult<PaginationResponse<FavoriteResponse>>> GetFavorites()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var favorites = await FavoriteService.GetFavoritesByUserIdAsync(userId);
            return Ok(favorites);
        }
    }
}