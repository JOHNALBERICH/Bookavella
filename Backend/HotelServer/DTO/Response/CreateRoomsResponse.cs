using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.DTO.Response
{
    public class CreateRoomsResponse
    {
        public string RoomName { get; set; }
        public string RoomDescription { get; set; }
        public RoomType RoomType { get; set; }
        public BedType BedType { get; set; }
        public int BedCount { get; set; }
        public int valuePerNight { get; set; }
        public int MaxGuests { get; set; }
        public RoomStatus RoomStatus { get; set; }
        public List<string> ImageUrls { get; set; }
    }
}