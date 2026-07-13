using Microsoft.AspNetCore.Mvc;
using Hoteldotnetserver.Services;
using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace Hoteldotnetserver.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public readonly AuthService _authService;
        public readonly JwtService jwtService;

        public AuthController(AuthService authService, JwtService jwtService)
        {
            _authService = authService;
            this.jwtService = jwtService;
        }

        
        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterAuthRequest request)
        {
            var result = await _authService.UserRegisterAsync(request, request.email, "Users");
            return Ok(result);
        }
        
        [HttpPost("ResetPassword")]
        [Authorize(Roles = "Users,Admin,PropertyOwner")]
        public async Task<ActionResult<ResetPasswordResponse>> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _authService.ResetPasswordAsync(request);
            return Ok(result);
        }
        [HttpPost("Admin/Register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> AdminRegister ([FromBody] RegisterAuthRequest request)
        {
            var result = await _authService.UserRegisterAsync(request, request.email, "Admin");
            return Ok(result);
        }
        [HttpPost("PropertyOwner/Register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> PropertyOwnerRegister ([FromBody] RegisterAuthRequest request)
        {
            var result = await _authService.UserRegisterAsync(request, request.email, "PropertyOwner");
            return Ok(result);
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
              
            var user = await _authService.UserLoginAsync(request);
         
            
            return Ok(user);
        }      
        [HttpPut("Update-Infor")]
        [Authorize(Roles = "Users,Admin,PropertyOwner")]
        public async Task<ActionResult<UserResponse>> UpdateUserInfor([FromBody] UpdateUserInforRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _authService.UpdateUserInforAsync(request);
            return Ok(result);
        }
        [HttpPatch("Change-Avatar")]
        [Authorize(Roles = "Users,Admin,PropertyOwner")]
        public async Task<ActionResult<ChangingUserAvatarResponse>> ChangeUserAvatar([FromBody] ChangingUserAvatarRequest request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _authService.ChangeUserAvatarAsync(request);
            return Ok(result);
        }
    }
}
