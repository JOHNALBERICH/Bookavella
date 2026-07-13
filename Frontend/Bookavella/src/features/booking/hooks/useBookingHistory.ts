import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { Booking } from '@/types';

export function useBookingHistory() {
  return useQuery({
    queryKey: ['bookingHistory'],
    queryFn: async () => {
      const response = await bookingService.getBookingHistory();
      const bookings = response.data || [];

      return [...bookings].sort((a: Booking, b: Booking) => {
        const dateA = new Date(a.createdAt || (a as { _createAt?: string })._createAt || 0).getTime();
        const dateB = new Date(b.createdAt || (b as { _createAt?: string })._createAt || 0).getTime();
        return dateB - dateA;
      });
    },
    staleTime: 0, // ◄ OPTIMIZATION: Históricos devem ser sempre validados para evitar inconsistência de status
  });
}