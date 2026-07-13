using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.DTO.Response
{
    public record PropertiesTrendingResponse
    {
        public Guid id { get; init; }
        public string propertyname { get; init; }

        public string propertytype { get; init; }
        public int pricePernight { get; init; }
        public string description { get; init; }
        public string city { get; init; }
        public string country { get; init; }
        public string Address { get; init; }
        public DateTime CreatedAt { get; init; }
        public PropertyStatus status { get; init; }
    }
}