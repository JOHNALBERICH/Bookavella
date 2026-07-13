namespace Hoteldotnetserver.DTO.Response
{
    public class GetFavoriteResponse
    {
    public Guid FavoriteId { get; set; }
    public DateTime CreatedDate { get; set; }

    public Guid PropertyId { get; set; }
    public string PropertyName { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Address { get; set; } 

    public int? LowestRoomPrice { get; set; }
    public double AverageRating { get; set; }
    }
}