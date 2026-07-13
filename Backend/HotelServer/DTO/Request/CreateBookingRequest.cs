namespace Hoteldotnetserver.DTO.Request
{
    public class CreateBookingRequest
    {
        
        public Guid RoomId { get; set; }
        public string? DiscountCode { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public int NumberOfGuests { get; set; }

    }
}
