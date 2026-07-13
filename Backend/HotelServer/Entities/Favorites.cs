using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Entities
{
    public class Favorites
{
    [Key]
    public Guid FavoriteId { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid PropertyId { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public virtual Users User { get; set; } = null!;
    public virtual Properties Property { get; set; } = null!;
}
}