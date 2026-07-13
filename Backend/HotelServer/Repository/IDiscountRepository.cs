using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Repository
{
    public interface IDiscountRepository
    {
        public Task<Discount> CreateDiscountAsync(Discount discount);
        public Task<Discount?> GetDiscountByCodeAsync(string code);
        public Task UpdateDiscountAsync(Discount discount);
        public Task<IEnumerable<Discount>> GetAllDiscountsAsync();
        public Task DeleteDiscountAsync(string code);
    }
}