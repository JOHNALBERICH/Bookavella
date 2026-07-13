namespace Hoteldotnetserver.DTO.Request
{
    public class ConfirmBookingRequest
    {
        public string cardNumber { get; set; }
        public string cardHolderName { get; set; }
        public string expirationDate { get; set; }
        public string cvv { get; set; }
        public string propertyname { get; set; }

        
    }
}