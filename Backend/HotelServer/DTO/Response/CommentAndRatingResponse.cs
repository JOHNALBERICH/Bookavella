namespace Hoteldotnetserver.DTO.Response
{
    public record CommentAndRatingResponse
    {
        public string? UserName { get; init; }
        public string? UserAvatar { get; init; }
        public string? Comment { get; init; }
        public int Rating { get; init; }
    }
}