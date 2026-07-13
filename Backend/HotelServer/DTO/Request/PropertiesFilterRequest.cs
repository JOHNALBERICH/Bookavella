using Hoteldotnetserver.DTO.Request;
namespace Hoteldotnetserver.DTO.Request
{
    public record PropertiesFilterRequest
    {
        public Guid? OwnerId { get; set; }
        public string? Name { get; set; }
        public int? MinPrice { get; set; }
        public int? MaxPrice { get; set; }
        public string? PropertyType { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Address { get; set; }
        public string? SortBy { get; set; } // "price_asc", "price_desc", or null for default sorting
        public PaginationRequest? Pagination { get; set; }
    }
}
