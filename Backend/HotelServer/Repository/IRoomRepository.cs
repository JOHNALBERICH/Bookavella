using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Repository
{
    public interface IRoomRepository
    {
        Task<IEnumerable<Rooms>> GetAllRoomsAsync();
        Task<Rooms> GetRoomByIdAsync(Guid roomId);
        Task<IEnumerable<Rooms>> GetRoomsByTypeAsync(RoomType roomType);
        Task<IEnumerable<Rooms>> GetRoomsByStatusAsync(RoomStatus roomStatus);
        Task<IEnumerable<Rooms>> GetRoomsByBedTypeAsync(BedType bedType);
        Task<IEnumerable<Rooms>> GetRoomsByPropertyIdAsync(Guid propertyId);
        Task AddRoomAsync(Rooms room);
        Task UpdateRoomAsync(Rooms room);
        Task DeleteRoomAsync(Guid roomId);
    }
}