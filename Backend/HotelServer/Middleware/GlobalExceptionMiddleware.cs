using Hoteldotnetserver.DTO.Response;
namespace Hoteldotnetserver.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogError(ex, "Unauthorized access.");
                context.Response.StatusCode = 401;
                await context.Response.WriteAsJsonAsync(new ErrorResponse
                {
                    Success = false,
                    StatusCode = 401,
                    Message = "Unauthorized access.",
                    Timestamp = DateTime.UtcNow,
                    TraceId = context.TraceIdentifier
                });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, "Resource not found.");
                context.Response.StatusCode = 404;
                await context.Response.WriteAsJsonAsync(new ErrorResponse
                {
                    Success = false,
                    StatusCode = 404,
                    Message = "Resource not found.",
                    Timestamp = DateTime.UtcNow,
                    TraceId = context.TraceIdentifier
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Invalid argument.");
                context.Response.StatusCode = 400;
                await context.Response.WriteAsJsonAsync(new ErrorResponse
                {
                    Success = false,
                    StatusCode = 400,
                    Message = "Invalid argument.",
                    Timestamp = DateTime.UtcNow,
                    TraceId = context.TraceIdentifier
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                 Console.WriteLine("MIDDLEWARE TRACE = " + context.TraceIdentifier);
                Console.WriteLine(ex);
                context.Response.StatusCode = 500;


                await context.Response.WriteAsJsonAsync(new ErrorResponse
                {
                    Success = false,
                    StatusCode = 500,
                    Message = ex.Message,
                    Timestamp = DateTime.UtcNow,
                    TraceId = context.TraceIdentifier
                });
            }
            
                        
        }
    }
}