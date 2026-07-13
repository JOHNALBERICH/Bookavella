namespace Hoteldotnetserver.DTO.Response
{
    public record OwnerDashboardResponse
    {   
    public int TotalProperties { get; set; }
    public int TotalBookings { get; set; }
    public int PendingBookings { get; set; }
    public int ConfirmedBookings { get; set; }
    public int CancelledBookings { get; set; }
    public int TotalReviews { get; set; }
    public int occupancyRate { get; set; }

    public decimal TotalRevenue { get; set; }

    public double AverageRating { get; set; }

    public int FavoriteCount { get; set; }
    
    }
}