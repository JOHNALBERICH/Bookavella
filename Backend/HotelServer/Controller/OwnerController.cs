using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Microsoft.AspNetCore.Mvc;
using Hoteldotnetserver.Services;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
namespace Hoteldotnetserver.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "PropertyOwner,Admin")]
    public class OwnerController : ControllerBase
    {
        private readonly OwnerService _ownerService;
        private readonly PropertyServices _propertyServices;
        private readonly RoomsService _roomsService;

        public OwnerController(OwnerService ownerService, PropertyServices propertyServices, RoomsService roomsService)
        {
            _ownerService = ownerService;
            _propertyServices = propertyServices;
            _roomsService = roomsService;
        }
        [HttpGet("dashboard")]
        public async Task<ActionResult<OwnerDashboardResponse>> GetDashboard()
        {
            var dashboardData = await _ownerService.GetOwnerDashboardAsync();
            return Ok(dashboardData);
        }
        [HttpGet("property-analytics/{propertyId}")]
        public async Task<ActionResult<PropertyAnalyticsResponse>> GetPropertyAnalytics([FromRoute]Guid propertyId)
        {
            var analyticsData = await _ownerService.GetPropertyAnalyticsAsync(propertyId);
            return Ok(analyticsData);
        }
        [HttpGet("bookings")]
        public async Task<ActionResult<PaginationResponse<BookingsResponse>>> AdminGetBookings()
        {
            var bookings = await _ownerService.AdminGetBookings();
            return Ok(bookings);
        }
        [HttpPut("Update-Property/{id}")]
        public async Task<ActionResult<PropertyDetailResponse>> UpdateProperty(Guid id, [FromBody] UpdatePropertyRequest request)
            => Ok(await _propertyServices.UpdatePropertyAsync(id, request));
            
        [HttpPost("Properties/{propertyId}/rooms/create")]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomsRequest request, [FromRoute] Guid propertyId)
        {
            try
            {
                var response = await _roomsService.CreateRoomAsync(propertyId, request);
                return Ok(response);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the room.", details = ex.Message });
            }
        }
        [HttpPut("Properties/{propertyId}/rooms/update/{roomId}")]
        public async Task<IActionResult> UpdateRoom([FromBody] UpdateRoomsRequest request, [FromRoute] Guid propertyId, [FromRoute] Guid roomId)
        {
            try
            {
                var response = await _roomsService.UpdateRoomAsync(request, propertyId, roomId);
                return Ok(response);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the room.", details = ex.Message });
            }
        }
        [HttpGet("Properties/{propertyId}/rooms")]
        public async Task<IActionResult> GetRoomsByPropertyId([FromRoute] Guid propertyId)
        {
            try
            {
                var response = await _roomsService.GetRoomsByPropertyIdAsync(propertyId);
                return Ok(response);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving rooms.", details = ex.Message });
            }
        }
    }
   
}
