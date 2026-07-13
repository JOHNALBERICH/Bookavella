using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Mapster;

namespace Hoteldotnetserver.Mapping
{
    public class MappingRegister : IRegister
    {
        public void Register(TypeAdapterConfig config) 
        {
            //PropertiesSearchMapping
            config.NewConfig<Properties, PropertySearchResponse>()
                .Map(dest => dest.id, src => src._propertyId)
                .Map(dest => dest.propertyname,src=> src._propertyName)
                .Map(dest => dest.propertytype, src => src.propertyType)
                .Map(dest => dest.pricePernight, src => src.ValuePerNight)
                .Map(dest => dest.description, src => src._propertyDescription)
                .Map(dest => dest.status, src => src.status)
                .Map(dest => dest.Address, src => src.Address)
                ;
            //BookingMapping 
            config.NewConfig<CreateBookingRequest, Bookings>()
                .Map(dest => dest._roomId, src => src.RoomId)
                .Map(dest => dest._checkInDate, src => src.CheckInDate)
                .Map(dest => dest._checkOutDate, src => src.CheckOutDate)
                
                .Map(dest => dest._num_Guests, src => src.NumberOfGuests)
                .Ignore(dest => dest._bookingId)
                .Ignore(dest => dest._totalPrice)
                .Ignore(dest => dest._userId)
                .Ignore(dest => dest._createAt)
                .Ignore(dest => dest._cancelAt);





            //BookingResponseMapping
            config.NewConfig<Bookings, BookingsResponse>()
                .Map(dest => dest.bookingId, src => src._bookingId)
                .Map(dest => dest.PropertyName, src => src.Property._propertyName)
                .Map(dest => dest.RoomName, src => src.Rooms.RoomName)
                .Map(dest => dest.BedType, src => src.Rooms.BedType)
                .Map(dest => dest.checkindate, src => src._checkInDate)
                .Map(dest => dest.checkOut, src => src._checkOutDate)
                .Map(dest => dest.numGuests, src => src._num_Guests)
                .Map(dest => dest.status, src => src._bookingStatus)
                .Map(dest => dest.prices, src => src._totalPrice);



            //ConfirmBookingResponseMapping
            config.NewConfig<Bookings, ConfirmBookingResponse>()
                .Map(dest => dest.bookingId, src => src._bookingId)
                .Map(dest => dest.checkindate, src => src._checkInDate)
                .Map(dest => dest.checkOutdate, src => src._checkOutDate)
                .Map(dest => dest.bookingStatus, src => src._bookingStatus)
                .Map(dest => dest.totalprice, src => src._totalPrice)
                .Map(dest => dest.createdAt, src => src._createAt);

            //PropertyDetailResponseMapping
            config.NewConfig<PropertyAmenities, PropertyAmenitiesResponse>()
                    .Map(dest => dest.amenityId, src => src._amenityId.ToString())
                    .Map(dest => dest.amenityName, src => src.Amenity._amenityName);
                config.NewConfig<PropertyImages, PropertyImageResponse>()
                    .Map(dest => dest.id, src => src._imageId.ToString())
                    .Map(dest => dest.url, src => src._imageUrl);
            
            config.NewConfig<Properties, PropertyDetailResponse>()
                .Map(dest => dest.id, src => src._propertyId)
                .Map(dest => dest.Name, src => src._propertyName)
                .Map(dest => dest.Description, src => src._propertyDescription)
                .Map(dest => dest.City, src => src.city)
                .Map(dest => dest.Country, src => src.country)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.propertyType, src => src.propertyType)
                .Map(dest => dest.value_perNight, src => src.ValuePerNight)
                .Map(dest => dest.maxGuests, src => src.maxGuests)
                .Map(dest => dest.status, src => src.status)
                .Map(dest => dest.propertyAmenities, src => src.PropertyAmenities)
                .Map(dest => dest.propertyImages, src => src.PropertyImages)
                .Map(dest => dest.rooms, src => src.Rooms.Select(r => new RoomsDetailResponse
                {
                    propertyId = src._propertyId,
                    roomId = r.RoomId,
                    RoomName = r.RoomName,
                    RoomDescription = r.RoomDescription,
                    RoomType = r.RoomType.ToString(),
                    BedType = r.BedType.ToString(),
                    BedCount = r.BedCount,
                    valuePerNight = r.ValuePerNight,
                    MaxGuests = r.MaxGuests,
                    RoomStatus = r.RoomStatus.ToString(),
                    ImageUrls = r.RoomImages.Select(ri => ri.ImageUrl).ToList()
                }))
                .Map(dest => dest.reviews, src => src.Reviews)
                ;
                

            //PropertySearchResponseMapping
            config.NewConfig<Properties, PropertySearchResponse>()
                .Map(dest => dest.id, src => src._propertyId)
                .Map(dest => dest.propertyname, src => src._propertyName)
                .Map(dest => dest.ownername, src => src._propertyOwnerId)
                .Map(dest => dest.propertytype, src => src.propertyType)
                .Map(dest => dest.pricePernight, src => src.ValuePerNight)
                .Map(dest => dest.description, src => src._propertyDescription)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.status, src => src.status)
                .Map(dest => dest.city, src => src.city)
                .Map(dest => dest.country, src => src.country)
                .Map(dest => dest.CreatedAt, src => src.createdAt);
            // Cancel BookingResponseMapping
            config.NewConfig<Bookings, CancelBookingResponse>()
                .Map(dest => dest.bookingId, src => src._bookingId)
                .Map(dest => dest.bookingStatus, src => src._bookingStatus.ToString())
                .Map(dest => dest.lastBookingDate, src => src._cancelAt);
                

            //  RegisterAuthRequest mapping
            config.NewConfig<RegisterAuthRequest, Users>()
                .Map(dest => dest.name, src => src.username)
                .Map(dest => dest.email, src => src.email)
                .Map(dest => dest.phoneNumber, src => src.phoneNumber)
                .Map(dest => dest.Gender, src => src.Gender)
                .Map(dest => dest.Nationality, src => src.Nationality)
                .Map(dest => dest.password, src => src.password)
                .Ignore(dest => dest.Role) // In a real application, you should hash the password before storing it
                .Ignore(dest => dest.id); // Assuming userId is generated by the database
            // LoginRequest mapping
            config.NewConfig<LoginRequest, Users>()
                .Map(dest => dest.email, src => src.email)
                .Map(dest => dest.password, src => src.password) // In a real application, you should hash the password before comparing it
                .Ignore(dest => dest.id) // Assuming userId is generated by the database
                .Ignore(dest => dest.phoneNumber)
                .Ignore(dest => dest.emailVerified)
                .Ignore(dest => dest.createdDate)
                .Ignore(dest => dest.updatedDate)
                .Ignore(dest => dest.IsActivated)
                .Ignore(dest => dest.Role)
                .Ignore(dest => dest.Permissions)
                .Ignore(dest => dest.Gender)
                .Ignore(dest => dest.Nationality)
                ;
            // ResetPasswordRequest mapping
            config.NewConfig<ResetPasswordRequest, Users>()
                .Map(dest => dest.email, src => src.email)
                .Map(dest => dest.password, src => src.newPassword) // In a real application, you should hash the password before storing it
                .Ignore(dest => dest.id) // Assuming userId is generated by the database
                .Ignore(dest => dest.name)
                .Ignore(dest => dest.phoneNumber)
                .Ignore(dest => dest.emailVerified)
                .Ignore(dest => dest.createdDate)
                .Ignore(dest => dest.updatedDate)
                .Ignore(dest => dest.IsActivated)
                .Ignore(dest => dest.Role)
                .Ignore(dest => dest.Permissions)
                .Ignore(dest => dest.Gender)
                .Ignore(dest => dest.Nationality);
            //AuthResponse mapping
            config.NewConfig<Users, AuthResponse>()
                .Map(dest => dest.email, src => src.email)
                .Map(dest => dest.role, src => src.Role)
                .Map(dest => dest.name, src => src.name)
                .Map(dest => dest.phoneNumber, src => src.phoneNumber)
                .Ignore(dest => dest.token); // Token will be generated separately after authentication
            //UpdateUserInforRequest mapping
            config.NewConfig<UpdateUserInforRequest, Users>()
                .Map(dest => dest.id, src => src.userId)
                .Map(dest => dest.name, src => src.name)
                .Map(dest => dest.phoneNumber, src => src.phoneNumber)
                .Map(dest => dest.AvatarUrl, src => src.AvatarUrl)
                .Map(dest => dest.Gender, src => src.Gender)
                .Map(dest => dest.Nationality, src => src.Nationality)
                .Ignore(dest => dest.id) // Assuming userId is generated by the database
                .Ignore(dest => dest.email)
                .Ignore(dest => dest.password)
                .Ignore(dest => dest.emailVerified)
                .Ignore(dest => dest.createdDate)
                .Ignore(dest => dest.updatedDate)
                .Ignore(dest => dest.IsActivated)
                .Ignore(dest => dest.Role)
                .Ignore(dest => dest.Permissions);
            // CreatePropertyRequest mapping
            config.NewConfig<CreatePropertyRequest, Properties>()
                .Map(dest => dest._propertyName, src => src.Name)
                .Map(dest => dest._propertyDescription, src => src.Description)
                .Map(dest => dest.city, src => src.City)
                .Map(dest => dest.country, src => src.Country)
                .Map(dest => dest.propertyType, src => src.PropertyType)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.ValuePerNight, src => src.Value_perNight)
                .Map(dest => dest.maxGuests, src => src.MaxGuests)
                .Map(dest => dest.status, src => PropertyStatus.available)
                .Ignore (dest => dest._propertyOwnerId) // propertyOwnerId will be set in the service layer based on the authenticated user
                .Ignore(dest => dest._propertyId) // Assuming propertyId is generated by the database
                .Ignore(dest => dest.createdAt) // createdAt will be set in the entity constructor
                .Ignore(dest => dest.PropertyAmenities)
                .Ignore(dest => dest.PropertyImages)
                .Ignore(dest => dest.Bookings)
                .Ignore(dest => dest.Reviews); // propertyOwnerId will be set in the service layer based on the authenticated user
            // UpdatePropertyRequest mapping
            config.NewConfig<UpdatePropertyRequest, Properties>()
                .Map(dest => dest._propertyName, src => src.name)
                .Map(dest => dest.city, src => src.city)
                .Map(dest => dest.country, src => src.country)
                .Map(dest => dest.propertyType, src => src.type)
                .Map(dest => dest.Address, src => src.address)
                .Map(dest => dest._propertyDescription, src => src.description)
                .Map(dest => dest.ValuePerNight, src => src.value_perNight)
                .Map(dest => dest.status, src => src.status)
                .Ignore(dest => dest._propertyId) // Assuming propertyId is generated by the database
                .Ignore(dest => dest._propertyOwnerId) // propertyOwnerId will be set in the service layer based on the authenticated user
                .Ignore(dest => dest.createdAt) // createdAt will be set in the entity constructor
                .Ignore(dest => dest.PropertyAmenities)
                .Ignore(dest => dest.PropertyImages)
                .Ignore(dest => dest.Bookings)
                .Ignore(dest => dest.Reviews);
            //CreatePropertyResponse
            config.NewConfig<Properties, CreatePropertyResponse>()
                .Map(dest => dest.id, src => src._propertyId)
                .Map(dest => dest.Name, src => src._propertyName)
                .Map(dest => dest.Description, src => src._propertyDescription)
                .Map(dest => dest.City, src => src.city)
                .Map(dest => dest.Country, src => src.country)
                .Map(dest => dest.propertyType, src => src.propertyType)
                .Map(dest => dest.Value_perNight, src => src.ValuePerNight)
                .Map(dest => dest.maxGuests, src => src.maxGuests)
                .Map(dest => dest.Address, src => src.Address)
                ;
            //    
            config.NewConfig<Payments, PaymentResponse>()
                .Map(dest => dest.paymentId, src => src._paymentId)
                .Map(dest => dest.bookingId, src => src._bookingId)
                .Map(dest => dest.Amount, src => src._totalAmount)
                .Map(dest => dest.PaymentType, src => src._paymentType)
                .Map(dest => dest.PaymentStatus, src => src._paymentStatus.ToString())
                .Map(dest => dest.PaymentDate, src => src._paymentDate)
                ; // Message will be set in the service layer based on the payment processing result

            //CreateAmenitiesRequest mapping
            config.NewConfig<AmenitiesRequest, Amenities>()
                .Map(dest => dest._amenityName, src => src.amenityName)
                .Ignore(dest => dest._amenityId) // Assuming amenityId is generated by the database
                ; // propertyId will be set in the service layer based on the property being updated
            config.NewConfig<Amenities, AmenitiesResponse>()
                .Map(dest => dest.amenityName, src => src._amenityName)
                .Map(dest => dest.amenityId, src => src._amenityId);
            //CreateRoomsRequest mapping
            config.NewConfig<CreateRoomsRequest, Rooms>()
                .Map(dest => dest.PropertyId, src => src.PropertyId)
                .Map(dest => dest.RoomName, src => src.RoomName)
                .Map(dest => dest.RoomDescription, src => src.RoomDescription)
                .Map(dest => dest.RoomType, src => src.RoomType)
                .Map(dest => dest.BedType, src => src.BedType)
                .Map(dest => dest.BedCount, src => src.BedCount)
                .Map(dest => dest.ValuePerNight, src => src.valuePerNight)
                .Map(dest => dest.MaxGuests, src => src.MaxGuests)
                .Map(dest => dest.RoomStatus, src => src.RoomStatus)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.RoomId) // Assuming roomId is generated by the database
                 // propertyId will be set in the service layer based on the property being updated
                 .Ignore(dest => dest.RoomImages) // RoomImages will be handled separately
                .Ignore(dest => dest.Properties); // Properties will be set in the service layer based on;
            //CreateRoomsResponse mapping
            config.NewConfig<Rooms, CreateRoomsResponse>()

                .Map(dest => dest.RoomName, src => src.RoomName)
                .Map(dest => dest.RoomDescription, src => src.RoomDescription)
                .Map(dest => dest.RoomType, src => src.RoomType)
                .Map(dest => dest.BedType, src => src.BedType)
                .Map(dest => dest.BedCount, src => src.BedCount)
                .Map(dest => dest.valuePerNight, src => src.ValuePerNight)
                .Map(dest => dest.MaxGuests, src => src.MaxGuests)
                .Map(dest => dest.RoomStatus, src => src.RoomStatus)
                .Map(dest => dest.ImageUrls, src => src.RoomImages.Select(ri => ri.ImageUrl)); // ImageUrls will be handled separately
            //RoomsDetailResponse mapping
            config.NewConfig<Rooms, RoomsDetailResponse>()
                .Map(dest => dest.propertyId, src => src.PropertyId)
                .Map(dest => dest.roomId, src => src.RoomId)
                .Map(dest => dest.RoomName, src => src.RoomName)
                .Map(dest => dest.RoomDescription, src => src.RoomDescription)
                .Map(dest => dest.RoomType, src => src.RoomType)
                .Map(dest => dest.BedType, src => src.BedType)
                .Map(dest => dest.BedCount, src => src.BedCount)
                .Map(dest => dest.valuePerNight, src => src.ValuePerNight)
                .Map(dest => dest.MaxGuests, src => src.MaxGuests)
                .Map(dest => dest.RoomStatus, src => src.RoomStatus)
                .Map(dest => dest.ImageUrls, src => src.RoomImages.Select(ri => ri.ImageUrl))
                ; // ImageUrls will be handled separately
            // Create Payment mapping
            config.NewConfig<CreatePaymentRequest, Payments>()
                .Map(dest => dest._bookingId, src => src.bookingId)
                .Map(dest => dest._paymentType, src => src.paymentType)
                ; // paymentDate will be set in the service layer when the payment is processed
            //Create Discount mapping
            config.NewConfig<CreateDiscountRequest, Discount>()
                .Map(dest => dest.Room.PropertyId, src => src.propertyId)
                .Map(dest => dest.RoomId, src => src.roomId)
                .Map(dest => dest._discountCode, src => src.discountCode)
                .Map(dest => dest._discountPercentage, src => src.discountPercentage)
                .Map(dest => dest._endDate, src => src.endDate)
                .Map(dest => dest._startDate, src => src.startDate)
                .Map(dest => dest._isActive, src => src.isActive)
                .Ignore(dest => dest._discountId) 
                .Ignore(dest => dest.Room)// Assuming discountId is generated by the database
                ;
            //Discount Response mapping
            config.NewConfig<Discount, DiscountResponse>()
                .Map(dest => dest.discountId, src => src._discountId)
                .Map(dest => dest.roomId, src => src.RoomId)
                .Map(dest => dest.discountCode, src => src._discountCode)
                .Map(dest => dest.discountPercentage, src => src._discountPercentage)
                .Map(dest => dest.startDate, src => src._startDate)
                .Map(dest => dest.endDate, src => src._endDate)
                .Map(dest => dest.isActive, src => src._isActive);
            //Update Discount mapping
            config.NewConfig<UpdateDiscountRequest, Discount>()
                .Map(dest => dest._discountCode, src => src.discountCode)
                .Map(dest => dest._discountPercentage, src => src.discountPercentage)
                .Map(dest => dest._endDate, src => src.endDate)
                .Map(dest => dest._startDate, src => src.startDate)
                .Map(dest => dest._isActive, src => src.isActive)
                .Ignore(dest => dest._discountId) // Assuming discountId is generated by the database
                .Ignore(dest => dest.RoomId)
                ;
            //Create Comment mapping
            config.NewConfig<CreateCommentRequest, Reviews>()
                .Map(dest => dest._comment, src => src.comment)
                .Map(dest => dest._rating, src => src.rating)
                .Map(dest => dest._propertyId, src => src.propertyId)
                .Ignore(dest => dest._reviewId) // Assuming reviewId is generated by the database
                .Ignore(dest => dest._userId) // userId will be set in the service layer based on the authenticated user
                .Ignore(dest => dest._createdAt); // createdAt will be set in the entity constructor
            config.NewConfig<UpdateCommentRequest, Reviews>()
                .Map(dest => dest._comment, src => src.comment)
                .Map(dest => dest._rating, src => src.rating)
                .Ignore(dest => dest._reviewId) // Assuming reviewId is generated by the database
                .Ignore(dest => dest._userId) // userId will be set in the service layer based on the authenticated user
                .Ignore(dest => dest._propertyId) // propertyId will be set in the service layer based on the property being updated
                .Ignore(dest => dest._createdAt); // createdAt will be set in the entity constructor
            //FavoriteRequest
            config.NewConfig<FavoriteRequest, Favorites>()
                .Map(dest => dest.PropertyId, src => src.PropertyId)
                .Ignore(dest => dest.UserId) // userId will be set in the service layer based on the authenticated user
                .Ignore(dest => dest.FavoriteId); // Assuming Id is generated by the database
            //FavoriteResponse
            config.NewConfig<Favorites, FavoriteResponse>()
                .Map(dest => dest.FavoriteId, src => src.FavoriteId)
                .Map(dest => dest.PropertyId, src => src.PropertyId)
                .Map(dest => dest.CreatedDate, src => src.CreatedDate);
            //getFavoriteResponse
            config.NewConfig<Favorites, GetFavoriteResponse>()
                .Map(dest => dest.FavoriteId, src => src.FavoriteId)
                .Map(dest => dest.PropertyId, src => src.PropertyId)
                .Map(dest => dest.CreatedDate, src => src.CreatedDate)
                .Map(dest => dest.PropertyName, src => src.Property._propertyName)
                .Map(dest => dest.City, src => src.Property.city)
                .Map(dest => dest.Country, src => src.Property.country)
                .Map(dest => dest.Address, src => src.Property.Address)
                .Map(dest => dest.LowestRoomPrice, src => src.Property.ValuePerNight)
                .Map(dest => dest.AverageRating, src => src.Property.Reviews.Any() ? src.Property.Reviews.Average(r => r._rating) : 0.0);
            //UpdateUserAvatarRequest mapping
            config.NewConfig<ChangingUserAvatarRequest, Users>()
                .Map(dest => dest.AvatarUrl, src => src.AvatarUrl)
                .Map(dest => dest.id, src => src.userId) // Assuming userId is generated by the database
                .Ignore(dest => dest.name)
                .Ignore(dest => dest.phoneNumber)
                .Ignore(dest => dest.email)
                .Ignore(dest => dest.password)
                .Ignore(dest => dest.emailVerified)
                .Ignore(dest => dest.createdDate)
                .Ignore(dest => dest.updatedDate)
                .Ignore(dest => dest.IsActivated)
                .Ignore(dest => dest.Role)
                .Ignore(dest => dest.Permissions)
                .Ignore(dest => dest.Gender)
                .Ignore(dest => dest.Nationality);
            // Admin get user response mapping
            config.NewConfig<Users, AdminGetUserResponse>()
            .Map(dest => dest.UserName, src => src.name)
            .Map(dest => dest.AvatarUrl, src => src.AvatarUrl)
            .Map(dest => dest.Role, src => src.Role)
            .Map(dest => dest.PhoneNumber, src => src.phoneNumber)
            .Map(dest => dest.Email, src => src.email)
            .Map(dest => dest.IsBanned, src => src.IsBanned)
            .Map(dest => dest.IsActivated, src => src.IsActivated)
            .Map(dest => dest.Nationality, src => src.Nationality);
            
            config.NewConfig<Users, UserResponse>()
            .Map(dest => dest.UserName, src => src.name)
            .Map(dest => dest.AvatarUrl, src => src.AvatarUrl)
            .Map(dest => dest.PhoneNumber, src => src.phoneNumber)
            .Map(dest => dest.Email, src => src.email)
            .Map(dest => dest.Nationality, src => src.Nationality);

            //config for admin csv report response
            config.NewConfig<AdminCsvExport, Bookings>()
                .Map(dest => dest._bookingId, src => src.BookingId)
                .Map(dest => dest._userId, src => src.UserId)
                .Map(dest => dest._propertyId, src => src.PropertyId)
                .Map(dest => dest._totalPrice, src => src.Revenue)
                .Map(dest => dest._bookingStatus, src => Enum.Parse<BookingStatus>(src.BookingStat));
            config.NewConfig<PropertiesTrendingResponse, Properties>()
                .Map(dest => dest._propertyId, src => src.id)
                .Map(dest => dest._propertyName, src => src.propertyname)
                .Map(dest => dest._propertyDescription, src => src.description)
                .Map(dest => dest.city, src => src.city)
                .Map(dest => dest.country, src => src.country)
                .Map(dest => dest.propertyType, src => src.propertytype)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.ValuePerNight, src => src.pricePernight)
                .Map(dest => dest.status, src => src.status)
                .Map(dest => dest.createdAt, src => src.CreatedAt);
            config.NewConfig<UpdateRoomsRequest, Rooms>()
                .Map(dest => dest.RoomName, src => src.RoomName)
                .Map(dest => dest.RoomDescription, src => src.RoomDescription)
                .Map(dest => dest.RoomType, src => src.RoomType)
                .Map(dest => dest.BedType, src => src.BedType)
                .Map(dest => dest.BedCount, src => src.BedCount)
                .Map(dest => dest.ValuePerNight, src => src.valuePerNight)
                .Map(dest => dest.MaxGuests, src => src.MaxGuests)
                .Map(dest => dest.RoomStatus, src => src.RoomStatus)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.RoomId) // Assuming roomId is generated by the database
                 // propertyId will be set in the service layer based on the property being updated
                .Ignore(dest => dest.RoomImages) // RoomImages will be handled separately
                .Ignore(dest => dest.Properties); // Properties will be set in the service layer based on;
        }
    }
}
