import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { CreateBookingRequest } from '../types';
import { ApiResponse } from '@/types';

export function useCreateBooking() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingService.createBooking(data),
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        toast.error(response.message || 'Failed to initialize booking');
        return;
      }

      const booking = response.data;
      
      // Resolve a variação de nomenclatura entre o DTO mapeado e o retorno da entidade do backend
      const bookingId = booking.bookingId || (booking as { _bookingId?: string })._bookingId;

      toast.success('Reservation initialized. Proceeding to payment...');
      
      // Redireciona síncronamente para a tela de pagamentos passando o ID gerado
      navigate(`/booking/payment/${bookingId}`);
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const apiMessage = error.response?.data?.message;
      toast.error(apiMessage || 'Failed to create booking. Please try again.');
    },
  });
}