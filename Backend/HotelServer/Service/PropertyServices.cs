using System.ComponentModel.DataAnnotations;
using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Repository;
using MapsterMapper;
using Hoteldotnetserver.Entities;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Services
{
    public class PropertyServices
    {
        public readonly IPropertiesRepository PropertiesRepository;
        public readonly IPropertyAmenities PropertyAmenitiesRepository;
        public readonly IPropertyImage PropertyImagesRepository;
        public readonly IReviewRepository ReviewRepository;
        public readonly IRoomRepository RoomsRepository;
  
        public readonly IMapper Mapper;

        public PropertyServices(IPropertiesRepository propertiesRepository, IMapper mapper, IPropertyAmenities propertyAmenitiesRepository, IPropertyImage propertyImagesRepository, IReviewRepository reviewRepository, IRoomRepository roomsRepository)
        {
            this.PropertiesRepository = propertiesRepository;
            this.Mapper = mapper;
            this.PropertyAmenitiesRepository = propertyAmenitiesRepository;
            this.PropertyImagesRepository = propertyImagesRepository;
            this.ReviewRepository = reviewRepository;
            this.RoomsRepository = roomsRepository;
        }
        public static void ValidateBookingDates(DateTime checkIn, DateTime checkOut)
        {
            if (checkIn.Date < DateTime.UtcNow.Date)
                throw new ValidationException("Check-in date cannot be in the past.");
            if (checkOut <= checkIn)
                throw new ValidationException("Check-out must be after check-in.");
            if ((checkOut - checkIn).Days < 1)
                throw new ValidationException("Minimum stay is 1 night.");
        }
        //Search for properties based on city and country
        public async Task<PaginationResponse<PropertySearchResponse>> SearchResponsesAsync(PropertiesFilterRequest request)
        {
            var properties = await PropertiesRepository.SearchPropertiesAsync(request);
            var response = Mapper.Map<IEnumerable<PropertySearchResponse>>(properties);
            return new PaginationResponse<PropertySearchResponse>
            {
                Items = response,
                TotalCount = response.Count(),
                
            };
        }
        //View details of a specific property
        public async Task<PropertyDetailResponse> GetPropertyDetailsAsync(Guid id)
        {

            var property = await PropertiesRepository.GetPropertiesAsync(id)
                ?? throw new Exception("Property not found.");
            ;

            var response = Mapper.Map<PropertyDetailResponse>(property);
            return response;
        }
        //Create a new property listing
        public async Task<CreatePropertyResponse> CreatePropertyAsync(CreatePropertyRequest request, Guid ownerId)
        {
            var existingProperty = await PropertiesRepository.SearchPropertiesAsync(new PropertiesFilterRequest { Name = request.Name });
            if (existingProperty.Any())            {
                throw new Exception("Property with the same name already exists.");
            }
            
            var property = Mapper.Map<Properties>(request);
            property._propertyOwnerId = ownerId;
            foreach(var imageurl in request.ImageUrls)
            {
               property.PropertyImages.Add(new PropertyImages
                {
                    _propertyId = property._propertyId,
                    _imageUrl = imageurl
                });
            }
                foreach(var amenityId in request.PropertyAmenities)
                {
                    property.PropertyAmenities.Add(new PropertyAmenities
                    {
                        _propertyId = property._propertyId,
                        _amenityId = amenityId
                    });
                }
            var createdProperty = await PropertiesRepository.CreatePropertyAsync(property);
           
            var response = Mapper.Map<CreatePropertyResponse>(createdProperty);
            return response;
            }
            public async Task<PropertyDetailResponse> UpdatePropertyAsync(Guid id, UpdatePropertyRequest request)
            {
                Console.WriteLine(request.name);
                Console.WriteLine(request.description);
                Console.WriteLine(request.type);   
                var property = await PropertiesRepository.GetPropertiesAsync(id)
                ?? throw new Exception("Property not found.");
                property._propertyName = request.name;
                property._propertyDescription = request.description;
                property.propertyType = request.type;
                property.city = request.city;
                property.country = request.country;
                property.Address = request.address;
                property.ValuePerNight = request.value_perNight;
                property.status = request.status;

                property.PropertyImages.Clear();
                if(request.ImageUrl != null)
                {
                    foreach(var img in request.ImageUrl)
                    {
                        property.PropertyImages.Add(new PropertyImages
                        {
                            _propertyId = property._propertyId,
                            _imageUrl = img
                        });
                    }
                }
    
                property.PropertyAmenities.Clear();
                if(request.Amenities != null)
                {
                    foreach(var amenity in request.Amenities)
                    {
                        property.PropertyAmenities.Add(new PropertyAmenities
                        {
                            _propertyId = property._propertyId,
                            _amenityId = Guid.Parse(amenity)
                        });
                    }
                }
                Console.WriteLine(property._propertyName);
                Console.WriteLine(property._propertyDescription);
                await PropertiesRepository.UpdatePropertyAsync(property);
                var response = Mapper.Map<PropertyDetailResponse>(property);
                return response;
            }

            public async Task<DeletePropertyResponse> DeletePropertyAsync (Guid id)
            {
                var property = await PropertiesRepository.GetPropertiesAsync(id);
                if (property == null)
                {
                    throw new Exception("Property not found.");
                }
                await PropertiesRepository.DeletePropertyAsync(id);
                return new DeletePropertyResponse { Message = "Property deleted successfully." };
            }
            public async Task<IEnumerable<PropertiesTrendingResponse>> GetTrendingPropertiesAsync()
            {
                var properties = await PropertiesRepository.GetTrendingPropertiesAsync();
                
                return Mapper.Map<IEnumerable<PropertiesTrendingResponse>>(properties);
            }
            public async Task<PropertyFavoriteCountResponse> GetPropertyFavoriteCountAsync(Guid propertyId)
            {
                var favoriteCount = await PropertiesRepository.GetPropertyFavoriteCountAsync(propertyId);
                return favoriteCount;
            }
            public async Task<IEnumerable<PropertySearchResponse>> GetPropertiesByOwnerIdAsync(Guid ownerId)
            {
                var properties = await PropertiesRepository.GetPropertiesByOwnerIdAsync(ownerId);
                return Mapper.Map<IEnumerable<PropertySearchResponse>>(properties);
            }

        
    }
}
