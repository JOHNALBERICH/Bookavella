using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.DTO.Response
{
    public class RoomsDetailResponse
    {
        public Guid propertyId { get; set; }
        public Guid roomId { get; set; }
        public string RoomName { get; set; }
        public string RoomDescription { get; set; }
        public string RoomType { get; set; }
        public string BedType { get; set; }
        public int BedCount { get; set; }
        public int valuePerNight { get; set; }
        public int MaxGuests { get; set; }
        public string RoomStatus { get; set; }
        public List<string> ImageUrls { get; set; }
    }
}