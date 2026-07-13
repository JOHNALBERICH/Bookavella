using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoteldotnetserver.Entities
{
    public class PropertyImages
    {
        [Key]
        public Guid _imageId { get;  set; }
        [ForeignKey(nameof(Property))]
        public Guid _propertyId { get; set; }

        public string _imageUrl { get; set; }

        public bool _isPrimary { get; set; }

        public virtual Properties Property { get; set; }
    }
}
