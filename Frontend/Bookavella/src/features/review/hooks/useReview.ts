import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';

export function useReviews(propertyId: string) {
  return useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () => reviewService.getReviews(propertyId),
    enabled: !!propertyId, // Previne requisições redundantes com IDs vazios ou indefinidos
  });
}