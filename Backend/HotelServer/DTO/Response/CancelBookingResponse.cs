namespace Hoteldotnetserver.DTO.Response
{
    public class CancelBookingResponse
    {
        public string bookingId { get; set; }
        public string bookingStatus { get; set; }
        public DateTime? lastBookingDate { get; set; }
        public string cancellationReason { get; set; }

    }
}
