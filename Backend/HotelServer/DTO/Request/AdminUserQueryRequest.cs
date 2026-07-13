using Hoteldotnetserver.Entities;
using Hoteldotnetserver.DTO.Request;
namespace Hoteldotnetserver.DTO.Response
{
    public record AdminUserQueryRequest
    {

    public string? Search { get; set; }

    public string? Role { get; set; }
    public string? name { get; set; }
    public string? email { get; set; }
    public string? phone { get; set; }

            public int PageIndex { get; init; } = 1;
        public int PageSize { get; init; } = 10;
    }
}

    