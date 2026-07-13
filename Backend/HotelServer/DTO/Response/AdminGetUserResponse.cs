namespace Hoteldotnetserver.DTO.Response
{
    public record AdminGetUserResponse
    {
        public string UserName { get; set; }
        public string AvatarUrl { get; set; }
        public string Role { get; set; } // fixed before it was string[] Role
        public string PhoneNumber { get; set; }
        public string Nationality { get; set; }
        public string Email { get; set; }
        public bool IsBanned { get; set; }
        public bool IsActivated { get; set; }

    }
}
