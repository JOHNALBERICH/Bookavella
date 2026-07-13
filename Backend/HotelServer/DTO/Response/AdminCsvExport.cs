using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.DTO.Response
{
    public record AdminCsvExport
    {

        public Guid BookingId { get; init; }
        public Guid UserId { get; init; }
        public Guid PropertyId { get; init; }
        public decimal Revenue { get; init; }
        public string BookingStat { get; init; }
    }
    

   
}