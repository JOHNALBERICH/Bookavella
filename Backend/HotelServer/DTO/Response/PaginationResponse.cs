namespace Hoteldotnetserver.DTO.Response
{
    public record PaginationResponse<T>
    {
        public IEnumerable<T> Items { get; init; } =[];
        public int PageIndex { get; init; } 
        public int TotalCount { get; init; }
        public int TotalItems { get; init; }
        public int PageSize { get; init; }
    }
}