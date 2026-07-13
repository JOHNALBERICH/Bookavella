using Hoteldotnetserver.Repository;
using Hoteldotnetserver.Data;
using Hoteldotnetserver.Entities;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Implementation
{
    public class PaymentImpl : IPaymentRepository
    {

    
        public readonly HotelDbContext _db;

        public PaymentImpl(HotelDbContext db)
        {
            this._db = db;
        }

        public async Task<Payments> CreatePaymentAsync(Payments payment)
        {

                    await _db.Payments.AddAsync(payment);
                    await _db.SaveChangesAsync();
            return payment;
        }
        public async Task<Payments?> GetPaymentByBookingIdAsync(Guid bookingId)
        {
            return await _db.Payments.Include(x => x.Booking).FirstOrDefaultAsync(p => p._bookingId == bookingId);
        }
        public async Task UpdatePaymentAsync(Payments payment)
        {
            _db.Update(payment);
            await _db.SaveChangesAsync();
        }
        
            
        
        
    }
}