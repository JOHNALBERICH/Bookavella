using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Services
{
    public class JwtService 
    {
        private readonly IConfiguration _configsec;
        public JwtService(IConfiguration configsec)
        {
            _configsec = configsec;
        }
        public string GenerateToken(Users user)
        {
            var jwtSetting = _configsec.GetSection("jwtConfig");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSetting["secretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),  
                new Claim(ClaimTypes.Role, user.Role) // Add the role claim

            };
            //Replace with your secret key
         
           
            // Create the JWT token
            var token = new JwtSecurityToken(
                issuer: jwtSetting["Issuer"],
                audience: jwtSetting["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMonths(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        
    }
}