import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';
import { toast } from 'sonner';
import { Favorite, ApiResponse } from '@/types';

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, isFavorited }: { propertyId: string; isFavorited: boolean }) => {
      if (isFavorited) {
        return favoriteService.removeFavorite(propertyId);
      } else {
        return favoriteService.addFavorite(propertyId);
      }
    },
    // Execução Otimista (Optimistic Update)
    onMutate: async ({ propertyId, isFavorited }) => {
      // 1. Cancela refetches em andamento para a lista de favoritos (evita que sobrescrevam nossa tela)
      await queryClient.cancelQueries({ queryKey: ['favorites'] });

      // 2. Tira um snapshot do cache atual
      const previousFavoritesResponse = queryClient.getQueryData<ApiResponse<Favorite[]>>(['favorites']);

      // 3. Atualiza otimistamente o cache do queryClient imediatamente
      if (previousFavoritesResponse) {
        let updatedList = [...previousFavoritesResponse.data];
        
        if (isFavorited) {
          // Remove da lista instantaneamente
          updatedList = updatedList.filter((f) => f.propertyId !== propertyId);
        } else {
          // Cria e adiciona um item temporário instantaneamente
          const tempFavorite: Favorite = {
            favoriteId: `temp-${Date.now()}`,
            userId: 'optimistic-state',
            propertyId,
            createdDate: new Date().toISOString(),
          };
          updatedList.push(tempFavorite);
        }

        queryClient.setQueryData<ApiResponse<Favorite[]>>(['favorites'], {
          ...previousFavoritesResponse,
          data: updatedList,
        });
      }

      // Retorna o snapshot para rollback em caso de falha
      return { previousFavoritesResponse };
    },
    onError: (_error, _variables, context) => {
      // Se a chamada de rede falhar, restaura o estado anterior do cache (Rollback)
      if (context?.previousFavoritesResponse) {
        queryClient.setQueryData(['favorites'], context.previousFavoritesResponse);
      }
      toast.error('Failed to update favorites. Please try again.');
    },
    onSettled: (data, error, variables) => {
      // Sempre invalida a query de favoritos para sincronizar as informações com a API final
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      
      if (!error) {
        toast.success(
          variables.isFavorited ? 'Removed from favorites' : 'Added to favorites'
        );
      }
    },
  });
}