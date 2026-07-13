namespace Hoteldotnetserver.DTO.Response
{
    public class AuthResponse
    {
        public string token { get; set; }
        public string email { get; set; }
        public string role { get; set; }
        public string name { get; set; }
        public string phoneNumber { get; set; }
    }
}