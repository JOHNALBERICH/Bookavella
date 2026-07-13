using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Hoteldotnetserver.Entities
{
    public class Payments
    {
        [Key]
        public Guid _paymentId { get;  set; }

        public string _paymentType { get; set; }

        [Required, NotNull, ForeignKey(nameof(Booking))]
        public Guid _bookingId { get; set; }
        [Required]
        public int? _totalAmount { get; set; }
        [Required,NotNull]
        public PaymentStatus _paymentStatus { get; set; }
        [Required, DataType(DataType.DateTime)]
        public DateTime _paymentDate { get; set; }

        public virtual Bookings Booking { get; set; } 
    }
}
