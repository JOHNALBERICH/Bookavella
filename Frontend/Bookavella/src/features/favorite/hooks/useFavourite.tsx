import { useQuery } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteService.getFavorites(),
  });
}