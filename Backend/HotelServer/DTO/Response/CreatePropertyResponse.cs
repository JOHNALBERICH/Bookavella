namespace Hoteldotnetserver.DTO.Response
{
    public class CreatePropertyResponse
    {
        public string id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string propertyType { get; set; }
        public int Value_perNight { get; set; }
        public int maxGuests { get; set; }
        public string Address { get; set; }
    }
}