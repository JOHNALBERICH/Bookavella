import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingService.confirmBooking(bookingId),
    onSuccess: (response) => {
      // Invalida o histórico de reservas para atualizar a grade visual do hóspede
      queryClient.invalidateQueries({ queryKey: ['bookingHistory'] });
      toast.success(response.message || 'Booking confirmed successfully!');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const apiMessage = error.response?.data?.message;
      toast.error(apiMessage || 'Failed to confirm booking.');
    },
  });
}