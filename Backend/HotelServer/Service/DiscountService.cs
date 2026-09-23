using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Entities;
using Hoteldotnetserver.Repository;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Services
{
    public class DiscountService
    {
        public readonly IDiscountRepository DiscountRepository;
        public readonly IMapper Mapper;
        public DiscountService(IDiscountRepository discountRepository, IMapper mapper)
        {
            this.DiscountRepository = discountRepository;
            this.Mapper = mapper;
        }
        public async Task<DiscountResponse> CreateDiscountAsync(CreateDiscountRequest request)
        {
            var existingDiscount = await DiscountRepository.GetDiscountByCodeAsync(request.discountCode);
            if (existingDiscount != null)
            {
                throw new Exception("A discount already exists for this room.");
            }

            var discount = Mapper.Map<Discount>(request);
            discount._discountCode = request.discountCode; // Set the discount code from the request
            discount._discountPercentage = (int)request.discountPercentage; // Set the discount percentage from the request
            discount._isActive = true; // Set the discount as active
            discount._startDate = request.startDate; // Set the start date to the current date
            discount._endDate = request.endDate; // Set the end date to the provided date
            var createdDiscount = await DiscountRepository.CreateDiscountAsync(discount);
            var discountResponse = Mapper.Map<DiscountResponse>(createdDiscount);
            return discountResponse;
        }
        public async Task<IEnumerable<DiscountResponse>> GetAllDiscountsAsync()
        {
            var discounts = await DiscountRepository.GetAllDiscountsAsync();
            var discountResponses = Mapper.Map<IEnumerable<DiscountResponse>>(discounts);
            return discountResponses;
        }
        public async Task<DiscountResponse> GetDiscountByCodeAsync(string code)
        {
            var discount = await DiscountRepository.GetDiscountByCodeAsync(code);
            if (discount == null)
            {
                throw new Exception("Discount not found for the specified code.");
            }
            var discountResponse = Mapper.Map<DiscountResponse>(discount);
            return discountResponse;
        }
        public async Task<DiscountResponse> UpdateDiscountAsync(string code, UpdateDiscountRequest request)
        {
            var existingDiscount = await DiscountRepository.GetDiscountByCodeAsync(code);
//             Console.WriteLine(existingDiscount._discountCode);
// Console.WriteLine(existingDiscount._discountPercentage);
// Console.WriteLine(existingDiscount._startDate);
// Console.WriteLine(existingDiscount._endDate);
// Console.WriteLine(existingDiscount._isActive);
            if (existingDiscount == null)
            {
                throw new Exception("Discount not found for the specified code.");
            }

            Mapper.Map(request, existingDiscount);

            await DiscountRepository.UpdateDiscountAsync(existingDiscount);
            var discountResponse = Mapper.Map<DiscountResponse>(existingDiscount);
            return discountResponse;
        }
        public async Task<DeleteDiscountResponse> DeleteDiscountAsync(string code)
        {
            var existingDiscount = await DiscountRepository.GetDiscountByCodeAsync(code);
            if (existingDiscount == null)
            {
                throw new Exception("Discount not found for the specified code.");
            }

            await DiscountRepository.DeleteDiscountAsync(code);
            return new DeleteDiscountResponse { Message = "Discount deleted successfully." };
        }
        public async Task<IEnumerable<DiscountResponse>> GetActiveDiscountsAsync()
        {
            var discounts = await DiscountRepository.GetAllDiscountsAsync();
            var activeDiscounts = discounts.Where(d => d._isActive && d._endDate > DateTime.UtcNow);
            var discountResponses = Mapper.Map<IEnumerable<DiscountResponse>>(activeDiscounts);
            return discountResponses;
        }
        

    }
}