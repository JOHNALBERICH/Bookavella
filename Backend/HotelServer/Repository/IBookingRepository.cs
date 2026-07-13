using Hoteldotnetserver.Entities;
using Hoteldotnetserver.DTO.Response;
namespace Hoteldotnetserver.Repository
{
    public interface IBookingRepository
    {
        Task<bool> HasOverLapAsync(Guid roomId, DateTime checkIn, DateTime checkOut, Guid? excludeBookingId = null);
        Task<Bookings?> GetByIdAsync(Guid id);
        Task<Bookings>CreateBookingAsync(Bookings bookings);
        Task UpdateBookingAsync(Bookings bookings);

        Task<PaginationResponse<Bookings>> GetAllBooking();
        

         

    }
}
