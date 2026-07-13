using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Hoteldotnetserver.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Hoteldotnetserver.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace HotelServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "PropertyOwner,Admin")]
    public class PropertiesController : ControllerBase
    {
        public readonly PropertyServices PropertiesServices;
        public PropertiesController(PropertyServices propertiesServices)
        {
            this.PropertiesServices = propertiesServices;
        }
        [HttpGet("Search")]
        [AllowAnonymous]
        public async Task<ActionResult<PaginationResponse<PropertySearchResponse>>> Search([FromQuery] PropertiesFilterRequest request)
            => Ok(await PropertiesServices.SearchResponsesAsync(request));
        [HttpGet("Details/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<PropertyDetailResponse>> GetPropertyDetails([FromRoute]Guid id)
            => Ok(await PropertiesServices.GetPropertyDetailsAsync(id));
        [HttpPost("Create-Property")]
        
        public async Task<ActionResult<CreatePropertyResponse>> CreateProperty([FromBody] CreatePropertyRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var ownerId = Guid.Parse(userId);// Assuming you have an extension method to get the user ID from the claims
            var result = await PropertiesServices.CreatePropertyAsync(request, ownerId);

            return Ok(result);
        }
            
        
        [HttpDelete("Delete-Property/{id}")]
        public async Task<ActionResult<DeletePropertyResponse>> DeleteProperty([FromRoute]Guid id)
            => Ok(await PropertiesServices.DeletePropertyAsync(id));
        [HttpGet("Trending-Properties")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PropertiesTrendingResponse>>> GetTrendingProperties()
            => Ok(await PropertiesServices.GetTrendingPropertiesAsync());
        [HttpGet("Property-Favorite-Count/{propertyId}")]
        [AllowAnonymous]
        public async Task<ActionResult<PropertyFavoriteCountResponse>> GetPropertyFavoriteCount([FromBody] Guid propertyId)
            => Ok(await PropertiesServices.GetPropertyFavoriteCountAsync(propertyId));
        [HttpGet("Owner-Properties/{ownerId}")]
        public async Task<ActionResult<PaginationResponse<PropertySearchResponse>>> GetPropertiesByOwnerId([FromRoute]Guid ownerId)
            => Ok(await PropertiesServices.GetPropertiesByOwnerIdAsync(ownerId));
    }
}
