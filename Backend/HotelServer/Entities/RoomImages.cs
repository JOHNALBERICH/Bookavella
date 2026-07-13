using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Hoteldotnetserver.Entities
{
    public class RoomImages
    {
        [Key]
        public Guid RoomImageId { get; set; }
        [Required, ForeignKey(nameof(Rooms))]
        public Guid RoomId { get; set; }
        public string ImageUrl { get; set; }
        public virtual Rooms Room { get; set; }
    }
}