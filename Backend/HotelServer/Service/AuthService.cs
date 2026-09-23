
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Mapster;
using MapsterMapper;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
namespace Hoteldotnetserver.Services
{
    public class AuthService 
    {

        private readonly IAuthRepository authRepository;
        private readonly IMapper mapper;
        private readonly JwtService jwtService;
        public AuthService(IAuthRepository authRepository, IMapper mapper, JwtService jwtService)
        {
            this.authRepository = authRepository;
            this.mapper = mapper;
            this.jwtService = jwtService;
    
        }
        
        public async Task<AuthResponse> UserRegisterAsync(RegisterAuthRequest request, string email, string Role)
        {
            if (request == null
        || string.IsNullOrWhiteSpace(email)
        || string.IsNullOrWhiteSpace(request.password)
        || string.IsNullOrWhiteSpace(request.confirmpassword))
        {
            throw new ArgumentException("Request fields must not be null or empty.");
        }

        if (!string.Equals(request.password, request.confirmpassword, StringComparison.Ordinal))
        {
            throw new ArgumentException("Passwords do not match.");
        }

        if (await authRepository.ExistByEmailAsync(email))
        {
            throw new InvalidOperationException("An account with this email already exists.");
        }
            var user = mapper.Map<Users>(request);          
            user.Role = Role; // Assign the provided role
            user.password = BCrypt.Net.BCrypt.HashPassword(request.password); // Hash the password       
            await authRepository.CreateUserAsync(user);
            var token = jwtService.GenerateToken(user);
            return new AuthResponse
            {
                token = token,
                email = user.email,
                role = string.Join(", ", user.Role),
                name = user.name,
                phoneNumber = user.phoneNumber
            };
        }
        public async Task<AuthResponse> UserLoginAsync(LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.email) || string.IsNullOrWhiteSpace(request.password))
            {
                 throw new ArgumentException("Request fields must not be null or empty."); // Missing email or password
            }

            var user = await authRepository.GetByUserEmailAsync(request.email);
            //Console.WriteLine("Role in DB = '" + user.Role + "'");
            if (user == null || string.IsNullOrEmpty(user.password))
            {
                throw new ArgumentException("Invalid email or password.");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.password, user.password))
            {
                throw new ArgumentException("Password is not match."); // Invalid email or password
            }

            var token = jwtService.GenerateToken(user);
            // Console.WriteLine("Role count: " + user.Role.Length);

            // foreach (var role in user.Role)
            // {
            //     Console.WriteLine(role);
            // }
            return new AuthResponse
            {
                token = token,
                email = user.email,
                role = user.Role,
                name = user.name,
                phoneNumber = user.phoneNumber
            };
        }
        public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.email) || string.IsNullOrWhiteSpace(request.newPassword))
            {
                throw new ArgumentException("Request fields must not be null or empty.");
            }

            var user = await authRepository.GetByUserEmailAsync(request.email);
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }

            user.password = BCrypt.Net.BCrypt.HashPassword(request.newPassword);
            await authRepository.UpdateUserAsync(user);

            return new ResetPasswordResponse
            {
                message = "Password reset successfully."
            };
        }
        
        public async Task<UserResponse> UpdateUserInforAsync(UpdateUserInforRequest request)
        {
            var user = await authRepository.GetByUserIdAsync(request.userId);
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }
            var users = mapper.Map<UpdateUserInforRequest>(request);

            // Update user information based on the request
            if (!string.IsNullOrWhiteSpace(request.name))
            {
                users.name = request.name;
            }
            if (!string.IsNullOrWhiteSpace(request.phoneNumber))
            {
                users.phoneNumber = request.phoneNumber;
            }
            if (!string.IsNullOrWhiteSpace(request.AvatarUrl))
            {
                users.AvatarUrl = request.AvatarUrl;
            }
            if (!string.IsNullOrWhiteSpace(request.Gender))
            {
                users.Gender = request.Gender;
            }
            if (!string.IsNullOrWhiteSpace(request.Nationality))
            {
                users.Nationality = request.Nationality;
            }

            await authRepository.UpdateUserAsync(user);
            var response = mapper.Map<UserResponse>(user);
            return response;
        }
        public async Task<ChangingUserAvatarResponse> ChangeUserAvatarAsync(ChangingUserAvatarRequest request)
        {
            var user = await authRepository.GetByUserIdAsync(request.userId);
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }
            var users = mapper.Map<ChangingUserAvatarRequest>(request);
            // Update the user's avatar URL
            users.AvatarUrl = request.AvatarUrl;

            await authRepository.UpdateUserAsync(user);

            return new ChangingUserAvatarResponse
            {
                message = "Avatar updated successfully."
            };
        }
        
       
      
    }
}