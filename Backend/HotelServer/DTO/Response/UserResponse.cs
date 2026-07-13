namespace Hoteldotnetserver.DTO.Response
{
    public record UserResponse
    {
        public string UserName { get; set; }
        public string AvatarUrl { get; set; }

        public string PhoneNumber { get; set; }
        public string Nationality { get; set; }
        public string Email { get; set; }
    }
}