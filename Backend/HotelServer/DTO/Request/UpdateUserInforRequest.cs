namespace Hoteldotnetserver.DTO.Request
{
    public class UpdateUserInforRequest
    {
        public Guid userId { get; set; }
        public string? name { get; set; }
        public string? phoneNumber { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Gender { get; set; }
        public string? Nationality { get; set; }
    }
}