using Hoteldotnetserver.Entities;
namespace Hoteldotnetserver.Repository
{
    public interface IPaymentRepository
    {
       public Task<Payments> CreatePaymentAsync(Payments payment);
       public Task<Payments?> GetPaymentByBookingIdAsync(Guid bookingId);
       public Task UpdatePaymentAsync(Payments payment);

       
       
    }
}