namespace Hoteldotnetserver.DTO.Response
{
    public class PaymentResponse
    {
        public Guid paymentId { get; set; }
        public Guid bookingId { get; set; }
        public string PaymentType{ get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentStatus { get; set; }
        public int Amount { get; set; }

       
    }
}