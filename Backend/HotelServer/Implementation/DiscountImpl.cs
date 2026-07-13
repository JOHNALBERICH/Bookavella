using Hoteldotnetserver.Data;
using Hoteldotnetserver.Entities;
using Microsoft.EntityFrameworkCore;
using Hoteldotnetserver.Repository;
namespace Hoteldotnetserver.Implementation
{
    public class DiscountImpl : IDiscountRepository
    {
        private readonly HotelDbContext _db;

        public DiscountImpl(HotelDbContext db)
        {
            _db = db;
        }

        public async Task<Discount> CreateDiscountAsync(Discount discount)
        {
            await _db.Discounts.AddAsync(discount);
            await _db.SaveChangesAsync();
            return discount;
        }

        public async Task<IEnumerable<Discount>> GetAllDiscountsAsync()
        {
            return await _db.Discounts.ToListAsync();
        }

        public async Task UpdateDiscountAsync(Discount discount)
        {
            _db.Discounts.Update(discount);
            await _db.SaveChangesAsync();
        }

        public async Task<Discount?> GetDiscountByCodeAsync(string code)
        {
            return await _db.Discounts.FirstOrDefaultAsync(d => d._discountCode == code);
            
        }   

        public async Task DeleteDiscountAsync(string code)
        {
            var discount = await GetDiscountByCodeAsync(code);
            if (discount != null)
            {
            discount._isActive = false;
                await _db.SaveChangesAsync();
            }
        }
    }
}