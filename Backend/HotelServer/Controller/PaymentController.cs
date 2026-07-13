using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
namespace Hoteldotnetserver.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Users,Admin,PropertyOwner")]
    public class PaymentController : ControllerBase
    {
        public readonly PaymentService PaymentService;
        public PaymentController(PaymentService paymentService)
        {
            this.PaymentService = paymentService;
        }
        [HttpPost("Create-Payment")]
        
        public async Task<ActionResult<PaymentResponse>> CreatePayment([FromBody] CreatePaymentRequest request)
        {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                //call the service to create payment
                return Ok(await PaymentService.CreatePaymentAsync(request, userId));
        }
        [HttpPost("Validate-Payment")]
        
        public async Task<ActionResult<PaymentResponse>> ValidatePayment([FromBody]ValidatePaymentRequest request)
        {
            var payment = await PaymentService.ValidatePaymentAsync(request);
            if (payment == null)
            {
                return NotFound("Payment not found for the given booking ID.");
            }
            return Ok(payment);
        }
        [HttpPatch("Cancel-Payment/{bookingId}")]
        
        public async Task<ActionResult> CancelPayment([FromBody]Guid bookingId)
        {
            await PaymentService.CancelPaymentAsync(bookingId);
            return Ok();
        }
    }
}