namespace Hoteldotnetserver.DTO.Request
{
    public class CreatePaymentRequest
    {
        public Guid bookingId { get; set; }
        public string paymentType { get; set; }

    }
}
