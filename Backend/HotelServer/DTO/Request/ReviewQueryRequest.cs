using Hoteldotnetserver.DTO.Request;
namespace Hoteldotnetserver.DTO.Request
{
    public record ReviewQueryRequest
    {
        public string? Search { get; set; }
        public string? PropertyId { get; set; }
        public PaginationRequest Pagination { get; set; }
    }
}