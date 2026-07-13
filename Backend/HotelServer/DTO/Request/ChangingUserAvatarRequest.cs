namespace Hoteldotnetserver.DTO.Request
{
    public class ChangingUserAvatarRequest
    {
        public Guid userId { get; set; }
        public string? AvatarUrl { get; set; }
    }
}