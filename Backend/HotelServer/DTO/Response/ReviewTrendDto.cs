namespace Hoteldotnetserver.DTO.Response
{
    public record ReviewTrendDto
    {
        public int Year { get; init; }
        public int Month { get; init; }
        public int ReviewCount { get; init; }
    }
}