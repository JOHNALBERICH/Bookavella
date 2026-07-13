using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using MapsterMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel.DataAnnotations;
using CsvHelper;
using System.Globalization;
using System.Text;
namespace Hoteldotnetserver.Services
{
    public class AdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly IMapper _mapper;

        public AdminService(IUserRepository userRepository, IMapper mapper, IReviewRepository reviewRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _reviewRepository = reviewRepository;
        }

       public async Task<PaginationResponse<AdminGetUserResponse>> GetAllUsersAsync(AdminUserQueryRequest request)
        {
            var users = await _userRepository.GetAllUsersAsync(request);
            return _mapper.Map<PaginationResponse<AdminGetUserResponse>>(users);
        }

        public async Task<AdminGetUserResponse?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return null;
            }
            return _mapper.Map<AdminGetUserResponse>(user);
        }

        public async Task<BannedUserResponse?> DeleteUserAsync(Guid id)
        {
            var user = await _userRepository.DeleteUser(id);
            if (user == null)
            {
                return null;
            }
            return new BannedUserResponse { Message = $"User with ID {id} has been banned." };
        }
        public async Task<AdminStatsResponse> GetAdminStatsAsync()
        {
            return await _userRepository.GetAdminStatsAsync();
        }
        public async Task<PaginationResponse<ReviewResponse>> AdminGetAllReviewsAsync(ReviewQueryRequest request)
        {
            var reviews = await _reviewRepository.GetAllReviewsAsync(request);
            var response = _mapper.Map<PaginationResponse<ReviewResponse>>(reviews);
            return response;
        }

        public async Task<MemoryStream> ExportToCsvAsync(AdminExportCsvRequest request)
        {
            var record = await _userRepository.ExportToCsvAsync();
            var config = new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                Delimiter = ","
            };
            var memoryStream = new MemoryStream();
            using (var streamWriter = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
            using (var csvWriter = new CsvWriter(streamWriter, config))
            {
                csvWriter.WriteRecords(record);
                await streamWriter.FlushAsync();
            }
            memoryStream.Position = 0; // Reset the position of the stream to the beginning
            return memoryStream;
        }
         
    }
}