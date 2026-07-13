using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Hoteldotnetserver.Entities
{
    public class Bookings
    {
        [Key]
        public Guid _bookingId { get;  set; }
        [Required, NotNull, ForeignKey(nameof(Property))]
        public Guid _propertyId { get;  set; }
        [Required, NotNull, ForeignKey(nameof(User))]
        public Guid _userId { get;  set; }
        [Required, NotNull, ForeignKey(nameof(Rooms))]
        public Guid _roomId { get; set; }
        [Required,NotNull]
        public DateTime _checkInDate { get; private set; }
        [Required, NotNull]
        public DateTime _checkOutDate { get; private set;}
        [Required, NotNull]
        public int _totalPrice { get; private set; }
        [Required]
        public int _num_Guests { get; private set; }
        [Required, NotNull]
        public BookingStatus _bookingStatus { get; set; }
        [Required, NotNull, DataType(DataType.DateTime)]
        public DateTime _createAt {  get; private set; }
        [Required, DataType(DataType.DateTime)]
        public DateTime _cancelAt { get; private set; }

        public virtual Properties Property { get; set; }
        public virtual Users User { get; set; }
        public virtual Rooms Rooms { get; set; }
        public virtual ICollection<Payments> Payments { get; set; } = new List<Payments>();
        public Bookings()
        {
            this._createAt = DateTime.UtcNow;
            this._cancelAt = DateTime.UtcNow;
        }
    }
}
