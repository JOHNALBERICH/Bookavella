namespace Hoteldotnetserver.DTO.Response
{
    public record ErrorResponse
    {
    public bool Success { get; init; } = false;

    public int StatusCode { get; init; }

    public string Message { get; init; } = string.Empty;

    public DateTime Timestamp { get; init; } = DateTime.UtcNow;

    public string? TraceId { get; init; }
    }
    
}