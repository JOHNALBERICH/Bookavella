using Microsoft.AspNetCore.Identity;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.CompilerServices;

namespace Hoteldotnetserver.Entities
{
    public class Users
    {
        [Key]
        public Guid id {  get;  set; } 

        [Required,NotNull, MinLength(3), MaxLength(50)]
        public string name { get; private set; }
        
        [Required, NotNull, MaxLength(20)]
        public string phoneNumber { get; private set; }
        [Required, NotNull, MaxLength(100)]
        public string email { get; private set; }

        [Required, NotNull, MinLength(6), MaxLength(100)]
        public string password { get; set; }


        [Required, NotNull]
        public Boolean emailVerified { get; private set; }

        [DataType(DataType.DateTime)]
        public DateTime createdDate { get; private set; }

        [DataType(DataType.DateTime)]
        public DateTime updatedDate { get; private set; }

        [Required, NotNull]
        public bool IsActivated { get; set; }
        [Required, NotNull]
        public bool IsBanned { get;  set; }

        [Required]
        public string Role {get; set;} = "Users";

        [Required, NotNull, DefaultValue(false)]
        public bool Permissions { get; private set; }
        
        public string? AvatarUrl { get; private set; }
        [Required, NotNull]
        public string Gender { get; private set; }
        [Required, NotNull]
        public string Nationality { get; private set; }
        public Users(string Password, DateTime CreatedDate,bool IsActivated, bool IsBanned, string Role, bool Permissions, string AvatarUrl, string Gender, string Nationality)
        {
            this.password = Password;
            this.createdDate = DateTime.UtcNow;
            this.IsActivated = IsActivated;
            this.IsBanned = IsBanned;
            this.Role = Role;
            this.Permissions = Permissions;
            this.AvatarUrl = AvatarUrl;
            this.Gender = Gender;
            this.Nationality = Nationality;
        }
        public Users()
        {
            
        }
        public virtual ICollection<Properties> Properties { get; set; } = new List<Properties>();
        public virtual ICollection<Bookings> Bookings { get; set; } = new List<Bookings>();
        public virtual ICollection<Reviews> Reviews { get; set; } = new List<Reviews>();
    }
}
