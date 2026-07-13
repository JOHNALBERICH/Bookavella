namespace Hoteldotnetserver.DTO.Request
{
    public class ResetPasswordRequest
    {
        public string email { get; set; }
        public string newPassword { get; set; }
    }
}