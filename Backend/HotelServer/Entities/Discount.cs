using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Entities
{
    public class Discount
    {
        [Key]
        public Guid _discountId { get; set; }
        [Required, NotNull, ForeignKey(nameof(Room))]
        public Guid RoomId { get; set; }
        [Required, NotNull, StringLength(50)]
        public string _discountCode { get; set; }
        [Required, NotNull]
        public int _discountPercentage { get; set; }
        public DateTime _startDate { get; set; }
        public DateTime _endDate { get; set; }
        public bool _isActive { get; set; }

        public virtual Rooms Room { get; set; }
        public Discount(Guid discountId, Guid roomId, string discountCode, int discountPercentage, DateTime startDate, DateTime endDate, bool isActive)
        {
            _discountId = discountId;
            RoomId = roomId;
            _discountCode = discountCode;
            _discountPercentage = discountPercentage;
            _startDate = startDate;
            _endDate = endDate;
            _isActive = isActive;
        }
    }
}