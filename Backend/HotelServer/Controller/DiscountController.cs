using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.Services;
using Microsoft.AspNetCore.Mvc;
using Hoteldotnetserver.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace Hoteldotnetserver.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,PropertyOwner")]
    public class DiscountController : ControllerBase
    {
        private readonly DiscountService _discountService;

        public DiscountController(DiscountService discountService)
        {
            _discountService = discountService;
        }

        [HttpPost("Create-Discount")]
        public async Task<ActionResult<DiscountResponse>> CreateDiscount([FromBody] CreateDiscountRequest request)
        {
            var discountResponse = await _discountService.CreateDiscountAsync(request);
            return Ok(discountResponse);
        }
        [HttpGet("Get-Discount/{code}")]
        public async Task<ActionResult<DiscountResponse>> GetDiscountByCode(string code)
        {
            var discountResponse = await _discountService.GetDiscountByCodeAsync(code);
            return Ok(discountResponse);
        }
        [HttpGet("Get-All-Discounts")]
        public async Task<ActionResult<IEnumerable<DiscountResponse>>> GetAllDiscounts()
        {
            var discountResponses = await _discountService.GetAllDiscountsAsync();
            return Ok(discountResponses);
        }
        [HttpPut("Update-Discount/{code}")]
        public async Task<ActionResult<DiscountResponse>> UpdateDiscount(string code, [FromBody] UpdateDiscountRequest request)
        {
            var discountResponse = await _discountService.UpdateDiscountAsync(code, request);
            return Ok(discountResponse);
        }
        [HttpDelete("Delete-Discount/{code}")]
        public async Task<ActionResult<DeleteDiscountResponse>> DeleteDiscount(string code)
        {
            var deleteResponse = await _discountService.DeleteDiscountAsync(code);
            return Ok(deleteResponse);
        }

    }
}