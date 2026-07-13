using Hoteldotnetserver.Data;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Hoteldotnetserver.Services; 
using Hoteldotnetserver.DTO.Response;
using Microsoft.EntityFrameworkCore;

namespace Hoteldotnetserver.Implementation
{
    public class BookingImpl : IBookingRepository
    {
        public readonly HotelDbContext hotelDbContext;
        public BookingImpl(HotelDbContext db) => hotelDbContext = db;
       

        public async Task<bool> HasOverLapAsync(Guid roomId, DateTime checkIn, DateTime checkOut, Guid? excludeBookingId = null)
        {
            var query =  hotelDbContext.Bookings.Where(b =>
                b._roomId == roomId &&
                (excludeBookingId == null || b._bookingId != excludeBookingId) &&
                b._bookingStatus != BookingStatus.canceled &&
                checkIn < b._checkOutDate &&
                checkOut > b._checkInDate
            );
            Console.WriteLine(query.ToQueryString());

           return await query.AnyAsync();
        }
        public async Task<Bookings> CreateBookingAsync(Bookings bookings)
        {
            hotelDbContext.Add(bookings);
            await hotelDbContext.SaveChangesAsync();
            return await hotelDbContext.Bookings
            .Include(b => b.Property)
            .Include(b => b.Rooms)
            .Include(b => b.User)
            .FirstAsync(b => b._bookingId == bookings._bookingId);
        }
        public async Task UpdateBookingAsync(Bookings bookings)
        {
            hotelDbContext.Update(bookings);
            await hotelDbContext.SaveChangesAsync();
        }
        public async Task<Bookings?> GetByIdAsync(Guid id)
        {
            return await hotelDbContext.Bookings.Include(b =>  b.Property).Include(b => b.Rooms).Include(b => b.User).FirstOrDefaultAsync(b => b._bookingId == id);

        }
        public async Task<PaginationResponse<Bookings>> GetAllBooking()
        {
            var bookings = await hotelDbContext.Bookings
                .Where(b => b._createAt >= DateTime.UtcNow.AddDays(-30)) // Filter bookings created in the last 30 days
                .Include(b => b.Property)
                .ToListAsync();
            return new PaginationResponse<Bookings>
            {
                Items = bookings,
                TotalCount = bookings.Count
            };
        }

            

    }
}


