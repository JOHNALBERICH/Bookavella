
using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;

namespace Hoteldotnetserver.Repository
{
    public interface IAuthRepository
    {
        Task<Users?> GetByUserEmailAsync(string email);
        Task<Users?> CreateUserAsync(Users user);

        Task<bool> ExistByEmailAsync(string email);
        Task<Users?> UpdateUserAsync(Users user);
        Task<Users?>GetByUserIdAsync(Guid userId);
    }
}