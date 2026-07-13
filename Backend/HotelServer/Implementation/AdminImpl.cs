using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Hoteldotnetserver.Data;
using Hoteldotnetserver.DTO.Response;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
namespace Hoteldotnetserver.Implementation
{
    public class AdminImpl : IUserRepository
    {
        private readonly HotelDbContext _context;
        public AdminImpl(HotelDbContext context)
        {
            _context = context;
        }
        public async Task<Users?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.email == email);
        }

        public async Task<bool> ExistedByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.email == email);
        }

        public async Task<Users?> GetUserByIdAsync(Guid id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.id == id);
        }

        public async Task<Users?> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                user.IsBanned = true;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
            return user;
        }
        public async Task<PaginationResponse<Users>> GetAllUsersAsync(AdminUserQueryRequest request)
        {
            var query = await _context.Users.ToListAsync();

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(u => u.name.Contains(request.Search) || u.email.Contains(request.Search) || u.phoneNumber.Contains(request.Search)).ToList();
            }

            if (!string.IsNullOrEmpty(request.Role))
            {
                query = query.Where(u => u.Role.Contains(request.Role)).ToList();
            }
            var totalCount = query.Count();

            query = query.OrderBy(u => u.createdDate)
                              .Skip((request.PageIndex - 1) * request.PageSize)
                              .Take(request.PageSize)
                              .ToList();
    
            return new PaginationResponse<Users>
            {
                Items = query,
                TotalCount = totalCount
            };
        }
        public async Task<AdminStatsResponse> GetAdminStatsAsync()
        {
  
            return new AdminStatsResponse
            {
                TotalUsers = await _context.Users.CountAsync(u => u.Role.Contains("User")),
                TotalOwners = await _context.Users.CountAsync(u => u.Role.Contains("PropertyOwner")),
                TotalProperties = await _context.properties.CountAsync(),
                TotalRooms = await _context.Rooms.CountAsync(),
                TotalBookings = await _context.Bookings.CountAsync(),
                PendingBookings = await _context.Bookings.CountAsync(b => b._bookingStatus == BookingStatus.pending),
                ConfirmedBookings = await _context.Bookings.CountAsync(b => b._bookingStatus == BookingStatus.confirmed),
                CancelledBookings = await _context.Bookings.CountAsync(b => b._bookingStatus == BookingStatus.canceled),
                TotalRevenue = await _context.Bookings
                    .Where(b => b._bookingStatus == BookingStatus.confirmed)
                    .SumAsync(b => (decimal?)b._totalPrice) ?? 0,
                TotalReviews = await _context.Reviews.CountAsync()
            };

        
        }
        public async Task<List<AdminCsvExport>> ExportToCsvAsync()
        {
            return await _context.Bookings.AsNoTracking()
            .Where(u => u._bookingStatus == BookingStatus.confirmed)
            .Select(b => new AdminCsvExport
            {
                BookingId = b._bookingId,
                UserId = b._userId,
                PropertyId = b._propertyId,
                Revenue = b._totalPrice,
                BookingStat = b._bookingStatus.ToString(),
            }).ToListAsync();
            
        }
        
    }
}
