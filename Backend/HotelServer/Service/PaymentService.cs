using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using MapsterMapper;
using Hoteldotnetserver.Data;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Services
{
    public class PaymentService
    {
        public readonly IPaymentRepository PaymentRepository;
        public readonly IMapper Mapper;
        public readonly IBookingRepository BookingRepository;
        public readonly HotelDbContext _db;
        public PaymentService(IPaymentRepository paymentRepository, IMapper mapper, IBookingRepository bookingRepository, HotelDbContext db)
        {
            this.PaymentRepository = paymentRepository;
            this.Mapper = mapper;
            this.BookingRepository = bookingRepository;
            this._db = db;
        }
        public bool ValidatePaymentDetails(string cardNumber, string cardHolderName, string cvv)
        {
            if (string.IsNullOrWhiteSpace(cardNumber) || string.IsNullOrWhiteSpace(cardHolderName) || string.IsNullOrWhiteSpace(cvv))
            {
                return false;
            }

            var normalizedCardNumber = cardNumber.Replace(" ", string.Empty);
            if (normalizedCardNumber.Length < 13 || normalizedCardNumber.Length > 19)
            {
                return false;
            }

            foreach (var character in normalizedCardNumber)
            {
                if (!char.IsDigit(character))
                {
                    return false;
                }
            }

            if (!IsValidCardNumber(normalizedCardNumber))
            {
                return false;
            }

            foreach (var character in cardHolderName)
            {
                if (!char.IsLetter(character) && !char.IsWhiteSpace(character) && character != '-' && character != '\'')
                {
                    return false;
                }
            }

            if (cvv.Length != 3 && cvv.Length != 4)
            {
                return false;
            }

            foreach (var character in cvv)
            {
                if (!char.IsDigit(character))
                {
                    return false;
                }
            }

            return true;
        }
        public async Task<PaymentResponse> CreatePaymentAsync(CreatePaymentRequest request, Guid userId)
        {
            

            var booking = await BookingRepository.GetByIdAsync(request.bookingId)
            ?? throw new Exception("Booking not found");
            if(booking._bookingStatus != BookingStatus.pending)
            {
                throw new Exception("Booking is not in a pending state");
            }
            var existPayment = await PaymentRepository.GetPaymentByBookingIdAsync(request.bookingId);
            if (existPayment != null)
            {
                throw new Exception("Payment already exists for this booking");
            }
           var payment = Mapper.Map<Payments>(request);
            payment._bookingId = booking._bookingId;
            payment._paymentType = request.paymentType;
            payment._totalAmount = booking._totalPrice;
            payment._paymentStatus = PaymentStatus.pending;
            var createdPayment = await PaymentRepository.CreatePaymentAsync(payment);
            var response = Mapper.Map<PaymentResponse>(createdPayment);
            return response;
        } 

        private static bool IsValidCardNumber(string cardNumber)
        {
            var shouldDouble = false;
            var total = 0;

            for (var index = cardNumber.Length - 1; index >= 0; index--)
            {
                var digit = cardNumber[index] - '0';

                if (shouldDouble)
                {
                    digit *= 2;
                    if (digit > 9)
                    {
                        digit -= 9;
                    }
                }

                total += digit;
                shouldDouble = !shouldDouble;
            }

            return total % 10 == 0;
        }
        
        public async Task<PaymentResponse?> ValidatePaymentAsync(ValidatePaymentRequest request)
        {
            var payment = await PaymentRepository.GetPaymentByBookingIdAsync(request.bookingId)
            ?? throw new Exception("Payment not found for the given booking ID.");
            
            if (payment._paymentStatus != PaymentStatus.pending && payment._paymentStatus != PaymentStatus.failed)
            {
                throw new Exception("Payment is not in a pending state.");
            }
            var valid = ValidatePaymentDetails(request.CardNumber, request.CardHolderName, request.CVV);
            
            if (!valid)
            {
                Console.WriteLine(request.CardNumber);
Console.WriteLine(request.CardHolderName);
Console.WriteLine(request.CVV);

Console.WriteLine(
    ValidatePaymentDetails(
        request.CardNumber,
        request.CardHolderName,
        request.CVV
    )
);
                payment._paymentStatus = PaymentStatus.failed;
                await PaymentRepository.UpdatePaymentAsync(payment);
                throw new Exception("Invalid payment details.");
            }
            else
            {
                using var transaction = await _db.Database.BeginTransactionAsync();
                try
                {
                    payment._paymentStatus = PaymentStatus.paid;
                    payment._paymentDate = DateTime.UtcNow;
                    
                    payment._totalAmount = payment.Booking._totalPrice;
                    await PaymentRepository.UpdatePaymentAsync(payment);

                    var booking = await BookingRepository.GetByIdAsync(payment._bookingId);
                    if (booking == null)
                    {
                        throw new Exception("Associated booking not found.");
                    }
                    booking._bookingStatus = BookingStatus.confirmed;
                    await BookingRepository.UpdateBookingAsync(booking);

                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception("Payment validation failed: " + ex.Message);
                }
            }
            var response = Mapper.Map<PaymentResponse>(payment);
            return response;
        }
        public async Task CancelPaymentAsync(Guid bookingId)
        {
            var payment = await PaymentRepository.GetPaymentByBookingIdAsync(bookingId)
                ?? throw new Exception("Payment not found for the given booking ID.");

            if (payment._paymentStatus == PaymentStatus.failed)
            {
                throw new Exception("Payment already failed.");

            }
            if(payment._paymentStatus == PaymentStatus.refunded)
            {
                throw new Exception("Payment already refunded.");
            }
            

            payment._paymentStatus = PaymentStatus.refunded;
            payment.Booking._bookingStatus = BookingStatus.canceled;
            await PaymentRepository.UpdatePaymentAsync(payment);
        }

    }
}