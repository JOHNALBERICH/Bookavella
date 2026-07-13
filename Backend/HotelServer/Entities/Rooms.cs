using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Hoteldotnetserver.Entities
{
    public class Rooms
    {
        [Key]
        public Guid RoomId { get; set; }
        [Required, NotNull, ForeignKey(nameof(Properties))]
        public Guid PropertyId { get; set; }
        [Required, NotNull]
        public string RoomName { get; set; }
        [Required, NotNull]
        public string RoomDescription { get; set; }
        [Required, NotNull]
        public RoomType RoomType { get; set; }
        [Required, NotNull]
        public BedType BedType { get; set; }
        [Required, NotNull]
        public int BedCount { get; set; }
        [Required, NotNull]
        public int MaxGuests { get; set; }
        [Required, NotNull]
        public int ValuePerNight { get; set; }
        [Required, NotNull]
        public RoomStatus RoomStatus { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Rooms(Guid roomId, Guid propertyId, string roomName, string roomDescription, RoomType roomType, BedType bedType, int bedCount, int maxGuests, int valuePerNight, RoomStatus roomStatus)
        {
            RoomId = roomId;
            PropertyId = propertyId;
            RoomName = roomName;
            RoomDescription = roomDescription;
            RoomType = roomType;
            BedType = bedType;
            BedCount = bedCount;
            MaxGuests = maxGuests;
            ValuePerNight = valuePerNight;
            RoomStatus = roomStatus;
        }
        public virtual ICollection<RoomImages> RoomImages { get; set; } = new List<RoomImages>();
        public virtual Properties Properties { get; set; }

        public virtual ICollection<Bookings> Bookings { get; set; } = new List<Bookings>();
        

    }
}