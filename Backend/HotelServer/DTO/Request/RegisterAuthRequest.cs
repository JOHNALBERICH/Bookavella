namespace Hoteldotnetserver.DTO.Request
{
    public class RegisterAuthRequest
    {
        public string? username { get; set; }
        public string? email { get; set; }
        public string? phoneNumber { get; set; }
        public string? Gender { get; set; }
        public string? Nationality { get; set; }
        public string? password { get; set; }
        public string? confirmpassword { get; set; }
    }
}