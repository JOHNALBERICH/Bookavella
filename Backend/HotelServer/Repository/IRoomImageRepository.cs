using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Repository
{
    public interface IRoomImageRepository
    {
        Task<IEnumerable<RoomImages>> GetAllRoomImagesAsync();
        Task<RoomImages> GetRoomImageByIdAsync(Guid roomImageId);
        Task<IEnumerable<RoomImages>> GetRoomImagesByRoomIdAsync(Guid roomId);
        Task AddRoomImageAsync(RoomImages roomImage);
        Task UpdateRoomImageAsync(RoomImages roomImage);
        Task DeleteRoomImageAsync(Guid roomImageId);
    }
}