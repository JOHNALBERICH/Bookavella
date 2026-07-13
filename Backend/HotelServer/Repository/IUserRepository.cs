using Hoteldotnetserver.Entities;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.DTO.Request;
namespace Hoteldotnetserver.Repository
{
    public interface IUserRepository
    {
        Task<Users?> GetUserByEmailAsync(string email);
        Task<bool> ExistedByEmailAsync(string email); 
        Task<Users?> GetUserByIdAsync(Guid id);
        Task<PaginationResponse<Users>> GetAllUsersAsync(AdminUserQueryRequest request);
        Task<Users?> DeleteUser(Guid id);
        Task<AdminStatsResponse> GetAdminStatsAsync();
        Task<List<AdminCsvExport>> ExportToCsvAsync();

    }
}
