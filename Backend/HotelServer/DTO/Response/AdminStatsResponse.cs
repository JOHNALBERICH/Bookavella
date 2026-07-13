namespace Hoteldotnetserver.DTO.Response
{
    public record AdminStatsResponse
{
    public int TotalUsers { get; init; }

    public int TotalOwners { get; init; }

    public int TotalProperties { get; init; }

    public int TotalRooms { get; init; }

    public int TotalBookings { get; init; }

    public int PendingBookings { get; init; }

    public int ConfirmedBookings { get; init; }

    public int CancelledBookings { get; init; }

    public decimal TotalRevenue { get; init; }

    public int TotalReviews { get; init; }
}
}