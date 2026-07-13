namespace Hoteldotnetserver.DTO.Request
{
    public class CreateCommentRequest
    {
        public string? comment { get; set; }
        public int? rating { get; set; }
        public Guid propertyId { get; set; }
    }
}