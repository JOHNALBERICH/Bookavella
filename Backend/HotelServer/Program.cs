
using Hoteldotnetserver.Data;
using Hoteldotnetserver.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Hoteldotnetserver.Implementation;
using Hoteldotnetserver.Repository;
using Mapster;
using MapsterMapper;
using Hoteldotnetserver.Mapping;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Hoteldotnetserver.Middleware;
using HotelServer.Implementation;
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);
var jwtSetting = builder.Configuration.GetSection("jwtConfig"); //add the configuration for JWT from appsettings.json
// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(option =>
{
    option.AddPolicy("AllowReactClient", p=> p.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials());
    
});
// Adding connection strings
builder.Services.AddDbContext<HotelDbContext>(options => 
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Adding repositories and services
builder.Services.AddScoped<IAuthRepository, AuthImpl>();
builder.Services.AddScoped<IPropertiesRepository, PropertiesImpl>();
builder.Services.AddScoped<IPropertyAmenities, PropertyAmenitiesImpl>();
builder.Services.AddScoped<IPropertyImage, PropertyImageImpl>();
builder.Services.AddScoped<IBookingRepository, BookingImpl>();
builder.Services.AddScoped<IAmenities, AmenitiesImpl>();
builder.Services.AddScoped<IPaymentRepository, PaymentImpl>();
builder.Services.AddScoped<IRoomRepository, RoomsImpl>();
builder.Services.AddScoped<IDiscountRepository, DiscountImpl>();
builder.Services.AddScoped<IReviewRepository, ReviewImpl>();
builder.Services.AddScoped<IFavoritesRepository, FavoriteImpl>();
builder.Services.AddScoped<IUserRepository, AdminImpl>();
builder.Services.AddScoped<IOwnerRepository, OwnerImpl>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<PropertyServices>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<AmenitiesService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<RoomsService>();
builder.Services.AddScoped<DiscountService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<FavoriteService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<OwnerService>();
// Adding JWT Authentication
builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["jwtConfig:Audience"],
        ValidIssuer = builder.Configuration["jwtConfig:Issuer"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["jwtConfig:secretKey"])),
        ClockSkew = TimeSpan.Zero
    };
});
builder.Services
.AddControllers()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(
        new JsonStringEnumConverter()
    );
});

var mapsterConfig = TypeAdapterConfig.GlobalSettings;
mapsterConfig.Scan(Assembly.GetExecutingAssembly());
builder.Services.AddSingleton(mapsterConfig);
builder.Services.AddScoped<IMapper, ServiceMapper>();

// Adding Authorization
builder.Services.AddAuthorization();
builder.Services.AddControllers();
// Đăng ký Swagger Generator
//builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat ="JWT",
        Name = "JWT Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "JWT Authorization header using the Bearer scheme.",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        } 
    };
    option.AddSecurityDefinition("Bearer", jwtSecurityScheme);
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
//    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReactClient");
app.UseHttpsRedirection();
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

