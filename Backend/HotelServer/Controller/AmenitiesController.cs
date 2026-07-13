using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Microsoft.AspNetCore.Mvc;
using Hoteldotnetserver.Services;
using Microsoft.AspNetCore.Authorization;
namespace Hoteldotnetserver.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Admin, PropertyOwner")]
    public class AmenitiesController : ControllerBase
    {
        public readonly AmenitiesService AmenitiesService;

        public AmenitiesController(AmenitiesService amenitiesService)
        {
            AmenitiesService = amenitiesService;
        }

        [HttpPost("Create-Amenity")]
        public async Task<ActionResult<AmenitiesResponse>> CreateAmenity([FromBody] AmenitiesRequest request)
        {
            
            return Ok(await AmenitiesService.CreateAmenityAsync(request));
        }
        [HttpGet("Get-All-Amenities")]
        public async Task<ActionResult<IEnumerable<AmenitiesResponse>>> GetAllAmenities()
        {
            return Ok(await AmenitiesService.GetAllAmenitiesAsync());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<AmenitiesResponse?>> GetAmenityById(Guid id)
        {
            return Ok(await AmenitiesService.GetAmenityByIdAsync(id));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAmenity(Guid id)
        {
            await AmenitiesService.DeleteAmenityAsync(id);
            return Ok();
        }
    }
}