using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using MapsterMapper;
namespace Hoteldotnetserver.Services
{
    public class OwnerService
    {
        private readonly IOwnerRepository _ownerRepository;
        private readonly IBookingRepository _bookingRepository;
        private readonly IMapper _mapper;
        public OwnerService(IOwnerRepository ownerRepository, IMapper mapper, IBookingRepository bookingRepository)
        {
            _ownerRepository = ownerRepository;
            _mapper = mapper;
            _bookingRepository = bookingRepository;
        }
        public async Task<OwnerDashboardResponse> GetOwnerDashboardAsync()
        {
            var dashboardData = await _ownerRepository.GetOwnerDashboardAsync();
            return dashboardData;
        }
        public async Task<PropertyAnalyticsResponse> GetPropertyAnalyticsAsync(Guid propertyId)
        {
            var analyticsData = await _ownerRepository.GetPropertyAnalyticsAsync(propertyId);
            return analyticsData;
        }
        public async Task<PaginationResponse<BookingsResponse>> AdminGetBookings()
        {
            var bookings = await _bookingRepository.GetAllBooking();
            var response = _mapper.Map<PaginationResponse<BookingsResponse>>(bookings);
            return response;
        }   
    }
}