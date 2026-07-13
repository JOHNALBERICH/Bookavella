using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Hoteldotnetserver.Entities
{
    public class PropertyAmenities

    {
        [Required,NotNull,ForeignKey(nameof(Property))]
        public Guid _propertyId { get;  set; }
        [Required, NotNull, ForeignKey(nameof(Amenity))]
        public Guid _amenityId { get;  set; }

        public virtual Properties Property { get; set; }
        public virtual Amenities Amenity { get; set; }
    }
}
