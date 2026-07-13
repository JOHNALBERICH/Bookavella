using Hoteldotnetserver.Entities;
using Microsoft.VisualBasic;

namespace Hoteldotnetserver.DTO.Request
{
    public class UpdatePropertyRequest
    {
        public string? name {get; set;}
        public string? type {get; set;}
        public string? city {get;set;}
        public string? country {get;set;}
        public string? address {get;set;}
        public string? description {get;set;}
        public int value_perNight {get; set;}
        public PropertyStatus status {get;set;}
        public List<string>? Amenities {get; set;}
        public List<string>? ImageUrl {get; set;}  

        
    }
}