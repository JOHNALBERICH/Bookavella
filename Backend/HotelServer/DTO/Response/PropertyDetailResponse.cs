using Hoteldotnetserver.Entities;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.DTO.Request;
namespace Hoteldotnetserver.DTO.Response
{
    public class PropertyDetailResponse
    {
        public string id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public PropertyStatus status { get; set; }
        public string propertyType { get; set; }
        public int value_perNight { get; set; }
        public int maxGuests { get; set; }
        public ICollection<PropertyAmenitiesResponse> propertyAmenities { get; set; }
        public ICollection<PropertyImageResponse> propertyImages { get; set; }
        public ICollection<RoomsDetailResponse> rooms { get; set; }
        public ICollection<CommentAndRatingResponse> reviews { get; set; }

    }
}
