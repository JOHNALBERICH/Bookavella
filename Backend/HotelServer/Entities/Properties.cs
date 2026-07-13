using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Hoteldotnetserver.Entities
{
    public class Properties
    {
        [Key]
        public Guid _propertyId { get;  set; }

        [Required,NotNull, StringLength(50)]
        public string _propertyName { get;  set; }

        [Required, NotNull, ForeignKey(nameof(User))]
        public Guid _propertyOwnerId{ get; set; }


        public string _propertyDescription { get;  set; }

        [Required, StringLength(50)]
        public string city { get;  set; }

        [Required, StringLength(20)]
        public string country { get;  set; }
        [Required, StringLength(20), NotNull]
        public string propertyType { get;  set; }
        [Required, NotNull]
        public int ValuePerNight { get;  set; }

        [Required, NotNull]
        public int maxGuests { get;  set; }

        [Required, NotNull]
        public PropertyStatus status { get;  set; }

        [Required, NotNull]
        public DateTime createdAt { get;  set; }
        [Required, NotNull]
        public string Address { get;  set; }

        public virtual Users User { get; set; }

        public Properties(string propertyName, Guid propertyOwnerId, string propertyDescription, string city, string country, string propertyType, int ValuePerNight, int maxGuests, PropertyStatus status, string Address)
        {
            this._propertyName = propertyName;
            this._propertyOwnerId = propertyOwnerId;
            _propertyDescription = propertyDescription;
            this.city = city;
            this.country = country;
            this.propertyType = propertyType;
            this.ValuePerNight = ValuePerNight;
            this.maxGuests = maxGuests;
            this.status = status;
            this.Address = Address;
            createdAt = DateTime.UtcNow;
        }
        public void MarkUnavailable()
    {
        status = PropertyStatus.unavailable;
    }
        public virtual ICollection<PropertyAmenities> PropertyAmenities { get; set; } = new List<PropertyAmenities>();
        public virtual ICollection<PropertyImages> PropertyImages { get; set; } = new List<PropertyImages>();
        public virtual ICollection<Bookings> Bookings { get; set; } = new List<Bookings>();
        public virtual ICollection<Reviews> Reviews { get; set; } = new List<Reviews>();
        public virtual ICollection<Rooms> Rooms { get; set; } = new List<Rooms>();
    }
}
