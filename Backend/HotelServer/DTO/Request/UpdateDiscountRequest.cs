namespace Hoteldotnetserver.DTO.Request
{
    public class UpdateDiscountRequest
    {
        public Guid roomId { get; set; }
        public string? discountCode { get; set; }
        public int discountPercentage { get; set; }
        public DateTime endDate { get; set; }
        public DateTime startDate { get; set; }
        public bool isActive { get; set; }
    }
}