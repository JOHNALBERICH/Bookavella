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
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;
        private readonly ReviewService _reviewService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("export-csv")]
        public async Task<IActionResult> ExportCsv([FromBody] AdminExportCsvRequest request)
        {
            var csvData = await _adminService.ExportToCsvAsync(request);
            var fileName = $"export_{DateTime.Now:yyyyMMddHHmmss}.csv";
            return File(csvData, "text/csv", fileName);
        }
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<PaginationResponse<AdminGetUserResponse>>>> GetAllUsers([FromQuery]AdminUserQueryRequest request)
        {
            var users = await _adminService.GetAllUsersAsync(request);
            return Ok(users);
        }
        [HttpPut("users/{id}/ban")]
        public async Task<ActionResult<BannedUserResponse>> BanUser([FromRoute]Guid id)
        {
            var user = await _adminService.DeleteUserAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        [HttpGet("Stats")]
        public async Task<ActionResult<AdminStatsResponse>> GetAdminStats()
        {
            var stats = await _adminService.GetAdminStatsAsync();
            return Ok(stats);
        }
        [HttpGet("reviews")]
        public async Task<ActionResult<PaginationResponse<CommentAndRatingResponse>>> AdminGetAllReviews([FromQuery] ReviewQueryRequest request)
        {
            var reviews = await _reviewService.GetAllCommentsAsync(request);
            return Ok(reviews);
        }
        
    }
}