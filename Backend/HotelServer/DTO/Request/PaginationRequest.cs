namespace Hoteldotnetserver.DTO.Request
{
    public record PaginationRequest
    {
        public int PageIndex { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}