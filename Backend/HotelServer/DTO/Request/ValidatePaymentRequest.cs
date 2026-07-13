namespace Hoteldotnetserver.DTO.Request
{
    public class ValidatePaymentRequest
    {
        public Guid bookingId { get; set; }
        public Guid PaymentId { get; set; }
        public string PaymentType{ get; set; }

        public string CardNumber { get; set; }
        public string CardHolderName { get; set; }
        public string CVV { get; set; }


    }
}