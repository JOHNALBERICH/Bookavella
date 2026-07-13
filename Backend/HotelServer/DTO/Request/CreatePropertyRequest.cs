namespace Hoteldotnetserver.DTO.Request
{
    public class CreatePropertyRequest
    {
        public string Name { get; set; }
        // public Guid OwnerId { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PropertyType { get; set; }
        public int Value_perNight { get; set; }
        public int MaxGuests { get; set; }
        public string Address { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<Guid> PropertyAmenities { get; set; } = new List<Guid>();
    }
}