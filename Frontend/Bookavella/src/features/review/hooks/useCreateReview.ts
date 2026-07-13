import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import { toast } from 'sonner';
import { CreateReviewRequest } from '../types';

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewService.createReview(data),
    onSuccess: (response, variables) => {
      // Invalida especificamente as queries de reviews do hotel modificado usando as variáveis de entrada da mutação
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.propertyId] });
      toast.success(response.message || 'Review submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit review. Please try again.');
    },
  });
}