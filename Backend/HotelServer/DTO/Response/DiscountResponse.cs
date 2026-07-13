namespace Hoteldotnetserver.DTO.Response
{
    public class DiscountResponse
    {
        public Guid discountId { get; set; }
        public Guid roomId { get; set; }
        public string discountCode { get; set; }
        public decimal discountPercentage { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public bool isActive { get; set; }
    }
}