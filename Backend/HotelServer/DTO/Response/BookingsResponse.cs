using Hoteldotnetserver.Entities;

namespace Hoteldotnetserver.DTO.Response
{
    public record BookingsResponse
    {
        public Guid bookingId { get; set; }
        public string PropertyName { get; set; }
        public string RoomName { get; set; }
        public BedType BedType { get; set; }
        public DateTime checkindate { get; set; }
        public DateTime checkOut { get; set; }       
        public int numGuests { get; set; }
        public BookingStatus status { get; set; }
        public int prices { get; set; }
        

    }
}
