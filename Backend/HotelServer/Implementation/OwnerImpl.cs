using Hoteldotnetserver.Data;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Hoteldotnetserver.DTO.Response;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Implementation
{
    public class OwnerImpl : IOwnerRepository
    {
        private readonly HotelDbContext _dbContext;

        public OwnerImpl(HotelDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<OwnerDashboardResponse> GetOwnerDashboardAsync()
        {
            return new OwnerDashboardResponse
            {
                TotalProperties = await _dbContext.properties.CountAsync(),
                TotalBookings = await _dbContext.Bookings.CountAsync(),
                TotalRevenue = await _dbContext.Bookings.SumAsync(b => b._totalPrice),
                PendingBookings = await _dbContext.Bookings.CountAsync(b => b._bookingStatus == BookingStatus.pending),
                ConfirmedBookings = await _dbContext.Bookings.CountAsync(b => b._bookingStatus == BookingStatus.confirmed),
                CancelledBookings = await _dbContext.Bookings.CountAsync(b => b._bookingStatus == BookingStatus.canceled),
                TotalReviews = await _dbContext.Reviews.CountAsync(),
                occupancyRate = await _dbContext.Bookings.CountAsync(b => b._bookingStatus == BookingStatus.confirmed) * 100 / (await _dbContext.Bookings.CountAsync() == 0 ? 1 : await _dbContext.Bookings.CountAsync())
            };
        }
        public async Task<PropertyAnalyticsResponse> GetPropertyAnalyticsAsync(Guid propertyId)
        {
            return new PropertyAnalyticsResponse
            {
                TotalBookings = await _dbContext.properties
                    .Where(p => p._propertyId == propertyId)
                    .SelectMany(p => p.Bookings)
                    .CountAsync(),
                TotalRevenue = await _dbContext.properties
                    .Where(p => p._propertyId == propertyId)
                    .SelectMany(p => p.Bookings)
                    .SumAsync(b => b._totalPrice),
                TotalProperties = await _dbContext.properties.Where(p=>p._propertyId == propertyId).CountAsync(),
                AverageRating = await _dbContext.properties
                    .Where(p => p._propertyId == propertyId)
                    .SelectMany(p => p.Reviews)
                    .AverageAsync(r => (double?)r._rating) ?? 0,
                FavoriteCount = await _dbContext.Favorites
                    .Where(f => f.Property._propertyId == propertyId)
                    .Select(f => new 
                    { PropertyId = f.Property._propertyId, UserId = f.User.id })
                    .CountAsync(),
                BookingTrend = await _dbContext.Bookings.Where(b => b.Property._propertyId == propertyId)
                    .GroupBy(b => new { b._createAt.Year, b._createAt.Month })
                    .Select(g => new BookingTrendDto
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        BookingCount = g.Count()
                    })
                    .OrderBy(bt => bt.Year).ThenBy(bt => bt.Month)
                    .ToListAsync(),
                RevenueTrend = await _dbContext.Bookings.Where(b => b.Property._propertyId == propertyId)
                    .GroupBy(b => new { b._createAt.Year, b._createAt.Month })
                    .Select(g => new RevenueTrendDto
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        Revenue = g.Sum(b => b._totalPrice)
                    })
                    .OrderBy(rt => rt.Year).ThenBy(rt => rt.Month)
                    .ToListAsync(),
                ReviewTrend = await _dbContext.Reviews.Where(r => r.Property._propertyId == propertyId)
                    .GroupBy(r => new { r._createdAt.Year, r._createdAt.Month })
                    .Select(g => new ReviewTrendDto
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        ReviewCount = g.Count()
                    })
                    .OrderBy(rt => rt.Year).ThenBy(rt => rt.Month)
                    .ToListAsync()

            }   ;
        
        }
    }
}