using Hoteldotnetserver.Repository;
using Hoteldotnetserver.Data;
using Hoteldotnetserver.Entities;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Implementation
{
    public class RoomsImpl : IRoomRepository
    {
        private readonly HotelDbContext _context;

        public RoomsImpl(HotelDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Rooms>> GetAllRoomsAsync()
        {
            return await _context.Rooms.Include(r => r.RoomImages).ToListAsync();
        }

        public async Task<Rooms> GetRoomByIdAsync(Guid roomId)
        {
            return await _context.Rooms.Include(r => r.RoomImages).FirstOrDefaultAsync(r => r.RoomId == roomId);
        }

        public async Task<IEnumerable<Rooms>> GetRoomsByTypeAsync(RoomType roomType)
        {
            return await _context.Rooms.Where(r => r.RoomType == roomType).Include(r => r.RoomImages).ToListAsync();
        }

        public async Task<IEnumerable<Rooms>> GetRoomsByStatusAsync(RoomStatus roomStatus)
        {
            return await _context.Rooms.Where(r => r.RoomStatus == roomStatus).Include(r => r.RoomImages).ToListAsync();
        }

        public async Task<IEnumerable<Rooms>> GetRoomsByBedTypeAsync(BedType bedType)
        {
            return await _context.Rooms.Where(r => r.BedType == bedType).Include(r => r.RoomImages).ToListAsync();
        }

        public async Task AddRoomAsync(Rooms room)
        {
            var exists = await _context.Rooms.AnyAsync(r => r.RoomName == room.RoomName);
            if (exists)            {
                throw new InvalidOperationException("A room with the same name already exists.");
            }
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                 _context.Rooms.Add(room);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

        }

        public async Task UpdateRoomAsync(Rooms room)
        {
            _context.Rooms.Update(room);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoomAsync(Guid roomId)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room != null)
            {
                room.RoomStatus = RoomStatus.Unavailable; // Mark as unavailable instead of deleting
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Rooms>> GetRoomsByPropertyIdAsync(Guid propertyId)
        {
            return await _context.Rooms.Where(r => r.PropertyId == propertyId).Include(r => r.RoomImages).ToListAsync();
        }
    }
}