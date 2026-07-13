namespace Hoteldotnetserver.DTO.Request
{
    public class CreateDiscountRequest
    {
        public Guid propertyId { get; set; }
        public Guid roomId { get; set; }
        public string discountCode { get; set; }
        public decimal discountPercentage { get; set; }
        public DateTime endDate { get; set; }
        public DateTime startDate { get; set; }
        public bool isActive { get; set; }
    }
}