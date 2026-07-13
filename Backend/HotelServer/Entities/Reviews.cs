using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Hoteldotnetserver.Entities
{
    public class Reviews
    {
        [Key]
        public Guid _reviewId { get;  set; }
        [Required, NotNull, ForeignKey(nameof(Property))]
        public Guid _propertyId { get; set; }
        [Required, NotNull, ForeignKey(nameof(User))]
        public Guid _userId { get; set; }
        [Required, Range(1, 5)]
        public int _rating { get; set; }
        
        public string? _comment { get; set; }
        [Required, NotNull, DataType(DataType.DateTime)]
        public DateTime _createdAt { get; set; }

        public virtual Properties Property { get; set; }
        public virtual Users User { get; set; }
    }
}
