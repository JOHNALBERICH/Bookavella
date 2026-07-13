namespace Hoteldotnetserver.DTO.Request
{
    public record AdminExportCsvRequest
    {
        public string FileType { get; init; } 
        public DateTime StartDate { get; init; } = DateTime.MinValue;
        public DateTime EndDate { get; init; } = DateTime.MaxValue;
    }
}