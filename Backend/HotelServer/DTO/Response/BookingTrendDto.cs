namespace Hoteldotnetserver.DTO.Response
{
    public record BookingTrendDto
    {
        public int Month { get; init; }
        public int Year { get; init; }
        public int BookingCount { get; init; }
    }
}