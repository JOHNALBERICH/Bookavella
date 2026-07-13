
using Hoteldotnetserver.Data;
using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using Microsoft.EntityFrameworkCore;

namespace Hoteldotnetserver.Implementation
{
    public class AuthImpl : IAuthRepository
    {
        public readonly HotelDbContext db;

        public AuthImpl(HotelDbContext db)
        {
            this.db = db;
        }
            
        public async Task<Users?> GetByUserEmailAsync(string email)
        {
            if(string.IsNullOrEmpty(email)) return null;
            return await db.Users.FirstOrDefaultAsync(u => u.email == email); 
        }
        
        public async Task<Users?> CreateUserAsync(Users user)
        {
            var existingUser = await db.Users.FirstOrDefaultAsync(u => u.email == user.email);
            if (existingUser != null) return null; // User already exists

            db.Users.Add(user);
            await db.SaveChangesAsync();
            return user;
        }
        public async Task<bool> ExistByEmailAsync(string email)
        {
            return await db.Users.FirstOrDefaultAsync(u => u.email == email) != null;
            
        }
        public async Task<Users?> GetByUserIdAsync(Guid userId)
        {
            return await db.Users.FirstOrDefaultAsync(u => u.id == userId);
        }
        public async Task<Users?> UpdateUserAsync(Users user)
        {
            var existingUser = await db.Users.FirstOrDefaultAsync(u => u.id == user.id);
            if (existingUser == null) return null; // User does not exist

            existingUser.password = user.password;
            existingUser.Role = user.Role;

            db.Users.Update(existingUser);
            await db.SaveChangesAsync();
            return existingUser;
        }

        
    }
}