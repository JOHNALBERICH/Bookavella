using System.ComponentModel.DataAnnotations;
using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Repository;
using MapsterMapper;
using Hoteldotnetserver.Entities;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Services
{
    public class RoomsService
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IPropertiesRepository _propertiesRepository;
        private readonly IMapper _mapper;
        public RoomsService(IRoomRepository roomRepository, IPropertiesRepository propertiesRepository, IMapper mapper)
        {
            _roomRepository = roomRepository;
            _propertiesRepository = propertiesRepository;
            _mapper = mapper;
        }
        public async Task<CreateRoomsResponse> CreateRoomAsync(Guid PropertyId, CreateRoomsRequest request)
        {
            var property = await _propertiesRepository.GetPropertiesAsync(PropertyId);
            if (property == null)            {
                throw new ValidationException("Property not found.");
            }
            
            var room = _mapper.Map<Rooms>(request);
          
            foreach (var imageUrl in request.ImageUrls)
            {
                room.RoomImages.Add(new RoomImages
                {
                    ImageUrl = imageUrl,
                   
                });
            }
            room.PropertyId = PropertyId; // Associate the room with the property
            room.RoomStatus = RoomStatus.Available; // Set default status to Available

            await _roomRepository.AddRoomAsync(room);

            return _mapper.Map<CreateRoomsResponse>(room);
        }
        public async Task<IEnumerable<RoomsDetailResponse>> GetAllRoomsAsync()
        {
            var rooms = await _roomRepository.GetAllRoomsAsync();
            return _mapper.Map<IEnumerable<RoomsDetailResponse>>(rooms);
        }
        public async Task<RoomsDetailResponse> GetRoomByIdAsync(Guid roomId)
        {
            var room = await _roomRepository.GetRoomByIdAsync(roomId);
            if (room == null)
            {
                throw new ValidationException("Room not found.");
            }
            return _mapper.Map<RoomsDetailResponse>(room);
        }
        public async Task<IEnumerable<RoomsDetailResponse>> GetRoomsByTypeAsync(RoomType roomType)
        {
            var rooms = await _roomRepository.GetRoomsByTypeAsync(roomType);
            return _mapper.Map<IEnumerable<RoomsDetailResponse>>(rooms);
        }
        public async Task<IEnumerable<RoomsDetailResponse>> GetRoomsByStatusAsync(RoomStatus roomStatus)
        {
            var rooms = await _roomRepository.GetRoomsByStatusAsync(roomStatus);
            return _mapper.Map<IEnumerable<RoomsDetailResponse>>(rooms);
        }
        public async Task<IEnumerable<RoomsDetailResponse>> GetRoomsByBedTypeAsync(BedType bedType)
        {
            var rooms = await _roomRepository.GetRoomsByBedTypeAsync(bedType);
            return _mapper.Map<IEnumerable<RoomsDetailResponse>>(rooms);
        }
        public async Task<RoomsDetailResponse> UpdateRoomAsync(UpdateRoomsRequest request,Guid propertyId, Guid roomId)
        {
            var room = await _roomRepository.GetRoomByIdAsync(roomId);
            if (room == null)
            {
                throw new ValidationException("Room not found.");
            }
            _mapper.Map(request, room);

            room.RoomImages.Clear(); // Clear existing images
            foreach (var imageUrl in request.ImageUrls)
            {
                room.RoomImages.Add(new RoomImages
                {
                    ImageUrl = imageUrl,
                    RoomId = room.RoomId
                });
            }
            await _roomRepository.UpdateRoomAsync(room);
            var response = _mapper.Map<RoomsDetailResponse>(room);
            return response;
        }
        public async Task DeleteRoomAsync(Guid roomId)
        {
            var room = await _roomRepository.GetRoomByIdAsync(roomId);
            if (room == null)
            {
                throw new ValidationException("Room not found.");
            }
            await _roomRepository.DeleteRoomAsync(roomId);
        }
        public async Task<IEnumerable<RoomsDetailResponse>> GetRoomsByPropertyIdAsync(Guid propertyId)
        {
            var property = await _propertiesRepository.GetPropertiesAsync(propertyId);
            if (property == null)
            {
                throw new ValidationException("Property not found.");
            }
            var rooms = await _roomRepository.GetRoomsByPropertyIdAsync(propertyId);
            return _mapper.Map<IEnumerable<RoomsDetailResponse>>(rooms);
        }
    }
}