using System.ComponentModel.DataAnnotations;

namespace Hoteldotnetserver.Entities
{
    public class Amenities
    {

        [Key]
        public Guid _amenityId { get;  set; }
        public string _amenityName { get; set; }

        public virtual ICollection<PropertyAmenities> PropertyAmenities { get; set; } = new List<PropertyAmenities>();
    }
}
