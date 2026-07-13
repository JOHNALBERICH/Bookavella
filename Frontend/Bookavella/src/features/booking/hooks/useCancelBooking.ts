import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking(bookingId),
    onSuccess: (response) => {
      // Limpa os caches de reservas pendentes e históricos de forma unificada
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookingHistory'] });
      toast.success(response.message || 'Booking canceled successfully');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const apiMessage = error.response?.data?.message;
      toast.error(apiMessage || 'Failed to cancel booking. Please try again.');
    },
  });
}