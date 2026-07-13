namespace Hoteldotnetserver.DTO.Response
{
    public record RevenueTrendDto
    {
        public int Year { get; init; }
        public int Month { get; init; }
        public int Revenue { get; init; }
    }
}