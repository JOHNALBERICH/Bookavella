namespace Hoteldotnetserver.DTO.Request
{
    public class PropertySearchRequest
    {
        public string propertyname { get; set; }
        public string type { get; set; }
        public int maxguests { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public int pricePernight { get; set; }
        public DateTime checkIn { get; set; }
        public DateTime checkOut { get; set; }
    }
}
