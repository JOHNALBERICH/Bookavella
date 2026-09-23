using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;

namespace Hoteldotnetserver.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Users,Admin,PropertyOwner")]
    public class BookingController : ControllerBase
    {
        public readonly BookingService BookingService;
        public readonly PropertyServices PropertyServices;
        public BookingController(BookingService bookingService, PropertyServices propertyServices)
        {
            this.BookingService = bookingService;
            this.PropertyServices = propertyServices;
        }
        
        [HttpPost("Create-Booking")]
        
        public async Task<ActionResult<BookingsResponse>> CreateBooking([FromBody] CreateBookingRequest request)
        {  
//             Console.WriteLine("========== NEW REQUEST ==========");
//              Console.WriteLine("Controller 1");
//              Console.WriteLine("TRACE = " + HttpContext.TraceIdentifier);
             
//             Console.WriteLine(Guid.NewGuid());
// Console.WriteLine("CreateBooking");
// Console.WriteLine(DateTime.Now);
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            // Console.WriteLine("Controller 2");
            var result = await BookingService.CreateBookingAsync(request, userId);
            // Console.WriteLine("Controller 3");
            // Console.WriteLine("========================");
            return Ok(result);
            // Console.WriteLine("Controller2");
        }
        [HttpPatch("Confirm")]
        
        public async Task<ActionResult<ConfirmBookingResponse>> ConfirmBooking([FromBody] ConfirmBookingRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(await BookingService.ConfirmBookingAsync(userId, request));
        }
        [HttpPatch("Cancel")]
       
        public async Task<ActionResult<CancelBookingResponse>> CancelBooking([FromBody] CancelBookingRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(await BookingService.CancelBookingAsync(userId, request));
        }
        [HttpGet("Booking-History")]
        [AllowAnonymous]
        public async Task<ActionResult<PaginationResponse<BookingsResponse?>>> GetBookingHistory()
        {
            return Ok(await BookingService.GetBookingHistory());
        }
    }
}
