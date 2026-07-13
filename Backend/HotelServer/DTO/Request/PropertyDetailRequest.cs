using Hoteldotnetserver.Entities;

namespace Hoteldotnetserver.DTO.Request
{
    public class PropertyDetailRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public PropertyStatus status { get; set; }
        public string propertyType { get; set; }
        public int value_perNight { get; set; }
        public int maxGuests { get; set; }
    }
}
