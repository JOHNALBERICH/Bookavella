using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using MapsterMapper;

namespace Hoteldotnetserver.Services
{
    public class AmenitiesService
    {
        public readonly IAmenities _amenitiesRepository;
        public readonly IMapper _mapper;
        public AmenitiesService(IAmenities amenitiesRepository, IMapper mapper)
        {
            _amenitiesRepository = amenitiesRepository;
            _mapper = mapper;
        }
        public async Task<AmenitiesResponse> CreateAmenityAsync(AmenitiesRequest request)
        {
            var exist = await _amenitiesRepository.GetAllAmenitiesAsync();
            if (exist.Any(a => a._amenityName.ToLower() == request.amenityName.ToLower()))
                throw new Exception("Amenity already exists");
                
                var amenity = _mapper.Map<Amenities>(request);
                await _amenitiesRepository.CreateAmenityAsync(amenity);
                var response = _mapper.Map<AmenitiesResponse>(amenity);
                return response;
        }
        public async Task<IEnumerable<AmenitiesResponse>> GetAllAmenitiesAsync()
        {
            var amenities = await _amenitiesRepository.GetAllAmenitiesAsync();
            var response = _mapper.Map<IEnumerable<AmenitiesResponse>>(amenities);
            return response;
        }
        public async Task<AmenitiesResponse?> GetAmenityByIdAsync(Guid id)
        {
            var amenity = await _amenitiesRepository.GetAmenityByIdAsync(id);
            if (amenity == null) throw new Exception("Amenity not found");
            var response = _mapper.Map<AmenitiesResponse>(amenity);
            return response;
        }
        public async Task UpdateAmenityAsync(Guid id, AmenitiesRequest request)
        {
            var amenity = await _amenitiesRepository.GetAmenityByIdAsync(id);
            if (amenity == null) throw new Exception("Amenity not found");
            amenity._amenityName = request.amenityName;
            await _amenitiesRepository.UpdateAmenityAsync(amenity);
        }
        public async Task DeleteAmenityAsync(Guid id)
        {
            var amenity = await _amenitiesRepository.GetAmenityByIdAsync(id);
            if (amenity == null) throw new Exception("Amenity not found");
            await _amenitiesRepository.DeleteAmenityAsync(amenity._amenityId);
        }
    }
}