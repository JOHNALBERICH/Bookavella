namespace Hoteldotnetserver.DTO.Response
{
    public record PropertyAnalyticsResponse
    {
         public int TotalProperties { get; set; }

    public int TotalRooms { get; set; }

    public int TotalBookings { get; set; }

    public decimal TotalRevenue { get; set; }

    public double AverageRating { get; set; }

    public int FavoriteCount { get; set; }

    public List<BookingTrendDto> BookingTrend { get; set; }

    public List<RevenueTrendDto> RevenueTrend { get; set; }

    public List<ReviewTrendDto> ReviewTrend { get; set; }
    }
}