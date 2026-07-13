using Hoteldotnetserver.Entities;

namespace Hoteldotnetserver.DTO.Response
{
    public record PropertySearchResponse
    {
        public string id { get; set; }
        public string propertyname { get; set; }
        public string ownername { get; set; }
        public string propertytype { get; set; }
        public int pricePernight { get; set; }
        public string description { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public PropertyStatus status;
    }
}
