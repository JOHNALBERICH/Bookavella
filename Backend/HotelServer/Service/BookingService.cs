using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using MapsterMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel.DataAnnotations;
using JsonSerializer = System.Text.Json.JsonSerializer;
namespace Hoteldotnetserver.Services
{
    public class BookingService
    {
        public readonly IBookingRepository BookingRepository;
        public readonly IPropertiesRepository PropertiesRepository;
        public readonly IRoomRepository RoomRepository;
        public readonly IMapper Mapper;
        public readonly IDiscountRepository DiscountRepository;

        public BookingService(IBookingRepository bookingRepository, IPropertiesRepository propertiesRepository, IRoomRepository roomRepository, IMapper mapper, IDiscountRepository discountRepository)
        {
            this.BookingRepository = bookingRepository;
            this.PropertiesRepository = propertiesRepository;
            this.RoomRepository = roomRepository;
            this.Mapper = mapper;
            this.DiscountRepository = discountRepository;
        }
        //Validate the checkin and checkout dates for a booking
        public static void ValidateBookingDates(DateTime checkIn, DateTime checkOut)
        {
            if (checkIn.Date < DateTime.UtcNow.Date)
                throw new ValidationException("Check-in date cannot be in the past.");
            if (checkOut <= checkIn)
                throw new ValidationException("Check-out must be after check-in.");
            if ((checkOut - checkIn).Days < 1)
                throw new ValidationException("Minimum stay is 1 night.");
        }
       
        //Create a booking for a property
        public async Task<BookingsResponse> CreateBookingAsync(CreateBookingRequest request, Guid userId)
        {
            ValidateBookingDates(request.CheckInDate, request.CheckOutDate);// Validate the booking dates
//            Console.WriteLine("1");
            var room = await RoomRepository.GetRoomByIdAsync(request.RoomId)
                ?? throw new Exception("Room not found.");
            var status = room.RoomStatus;
            if (status != RoomStatus.Available)
            {
                throw new Exception("Room is not available for booking.");
            }

            //            Console.WriteLine("2");
            bool hasOverlap = await BookingRepository.HasOverLapAsync(request.RoomId, request.CheckInDate, request.CheckOutDate);

            Console.WriteLine($"HasOverlap = {hasOverlap}");
            if (hasOverlap)
            {
                throw new Exception("Rooms is not available for the selected dates.");
            }
//           Console.WriteLine("3");
          
            var booking = Mapper.Map<Bookings>(request);
            booking._userId = userId;
            booking._roomId = room.RoomId;
            booking._propertyId = room.PropertyId;
            booking._bookingStatus = BookingStatus.pending;
        
            var nights = (request.CheckOutDate - request.CheckInDate).Days;
            var price = nights * room.ValuePerNight;
            var discount = await DiscountRepository.GetDiscountByCodeAsync(request.DiscountCode);
            if (discount != null && discount._endDate >DateTime.UtcNow)
            {
                var discountAmount = room.ValuePerNight * (discount._discountPercentage / 100);
                room.ValuePerNight -= discountAmount;
            }
            var finalprice = nights * room.ValuePerNight;
            var createdBooking = await BookingRepository.CreateBookingAsync(booking);
//            Console.WriteLine("4");
            
            var response = Mapper.Map<BookingsResponse>(createdBooking);
//             Console.WriteLine("PropertyName = " + response.PropertyName);
// Console.WriteLine("RoomName = " + response.RoomName);
// Console.WriteLine("BedType = " + response.BedType);
// Console.WriteLine("Price = " + response.prices);
// Console.WriteLine(JsonSerializer.Serialize(response));
            return response with { prices = finalprice };
        }

        public async Task<ConfirmBookingResponse> ConfirmBookingAsync(Guid Bookingid, ConfirmBookingRequest request)
        {
            var booking = await BookingRepository.GetByIdAsync(Bookingid) //check if booking exists
                ?? throw new Exception("Booking not found.");
            if (booking._userId != Bookingid)
                throw new Exception("Unauthorized to confirm this booking.");
            if (booking._bookingStatus != BookingStatus.pending)
                throw new Exception("Only pending bookings can be confirmed.");
            bool overlap = await BookingRepository.HasOverLapAsync(booking._propertyId, booking._checkInDate, booking._checkOutDate); //checking if the property is still available for the selected dates before confirming 
            if (overlap)
                throw new Exception("Property is not available for the selected dates.");
                //after all validations and payment success, update the booking status to confirmed
            booking._bookingStatus = BookingStatus.confirmed;
            await BookingRepository.UpdateBookingAsync(booking);
            
            return Mapper.Map<ConfirmBookingResponse>(booking);
        }
        public async Task<CancelBookingResponse> CancelBookingAsync(Guid id, CancelBookingRequest request)
        {
            var booking = await BookingRepository.GetByIdAsync(id)
                ?? throw new Exception("Booking not found.");
            if (booking._userId != id)
                throw new Exception("Unauthorized to cancel this booking.");
            if (booking._bookingStatus == BookingStatus.canceled)
                throw new Exception("Booking is already cancelled.");
            booking._bookingStatus = BookingStatus.canceled;
            await BookingRepository.UpdateBookingAsync(booking);
            return Mapper.Map<CancelBookingResponse>(booking);
        }
        public async Task<PaginationResponse<BookingsResponse?>> GetBookingHistory()
        {
            var booking = await BookingRepository.GetAllBooking();
            if (booking == null)
                throw new Exception("No booking history found.");
            var response = Mapper.Map<PaginationResponse<BookingsResponse>>(booking);
            return response;
        }
    }
}
