using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Microsoft.AspNetCore.Mvc;
using Hoteldotnetserver.Services;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
namespace Hoteldotnetserver.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Admin,PropertyOwner")]
    public class RoomsController : ControllerBase
    {
        private readonly RoomsService _roomsService;
        public RoomsController(RoomsService roomsService)
        {
            _roomsService = roomsService;
        }
  
        [HttpGet("Get-All-Rooms")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllRooms()
        {
            var response = await _roomsService.GetAllRoomsAsync();
            return Ok(response);
        }
        [HttpGet("Details/{roomId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRoomById(Guid roomId)
        {
            var response = await _roomsService.GetRoomByIdAsync(roomId);
            if (response == null)
            {
                return NotFound(new { message = "Room not found." });
            }
            return Ok(response);
        }
        [HttpGet("type/{roomType}")]
        public async Task<IActionResult> GetRoomsByType(RoomType roomType)
        {
            var response = await _roomsService.GetRoomsByTypeAsync(roomType);
            return Ok(response);
        }
        [HttpGet("status/{roomStatus}")]
        public async Task<IActionResult> GetRoomsByStatus(RoomStatus roomStatus)
        {
            var response = await _roomsService.GetRoomsByStatusAsync(roomStatus);
            return Ok(response);
        }
        [HttpGet("bedtype/{bedType}")]
        public async Task<IActionResult> GetRoomsByBedType(BedType bedType)
        {
            var response = await _roomsService.GetRoomsByBedTypeAsync(bedType);
            return Ok(response);
        }
        [HttpDelete("{roomId}")]
        public async Task<IActionResult> DeleteRoom(Guid roomId)    {
            try
            {
                await _roomsService.DeleteRoomAsync(roomId);
                return Ok(new { message = "Room deleted successfully." });
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the room.", details = ex.Message });
            }
        }

    }
}