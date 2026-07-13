using Hoteldotnetserver.Entities;

namespace Hoteldotnetserver.DTO.Response
{
    public record ConfirmBookingResponse
    {
        public string bookingId { get; set; }
        public DateTime checkindate { get; set; }
        public DateTime checkOutdate { get; set; }
        public BookingStatus bookingStatus { get; set; }
        public int totalprice { get; set; }
        public DateTime createdAt { get; set; }
    }
}
