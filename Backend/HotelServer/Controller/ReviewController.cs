using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Hoteldotnetserver.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Hoteldotnetserver.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace Hoteldotnetserver.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "PropertyOwner,Admin,User")]
    public class ReviewController : ControllerBase
    {
        public readonly ReviewService ReviewService;
        public ReviewController(ReviewService reviewService)
        {
            this.ReviewService = reviewService;
        }
        [HttpPost("Create-Review")]
        public async Task<ActionResult<ReviewResponse>> CreateReview([FromBody] CreateCommentRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(await ReviewService.CreateCommentAsync(request, userId));
        }
        [HttpGet("Get-Reviews/{propertyId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ReviewResponse>>> GetReviews(Guid ReviewId)
        {
            return Ok(await ReviewService.GetCommentByIdAsync(ReviewId));  
        } 
        [HttpPut("Update-Review/{reviewId}")]
        public async Task<ActionResult<ReviewResponse>> UpdateReview(Guid reviewId, [FromBody] UpdateCommentRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(await ReviewService.UpdateCommentAsync(request, reviewId, userId));
        }
        [HttpDelete("Delete-Review/{reviewId}")]

        public async Task<ActionResult<ReviewResponse>> DeleteReview([FromBody]Guid reviewId)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(await ReviewService.DeleteCommentAsync(reviewId, userId));
        }
        [HttpGet("Stats/{propertyId}")]
        public async Task<ActionResult<AverageReview>> GetReviewStats([FromBody] Guid propertyId)
        {
            return Ok(await ReviewService.GetAverageReviewAsync(propertyId));
        }
    }
}