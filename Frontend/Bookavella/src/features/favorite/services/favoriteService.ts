import { axiosInstance } from '@/lib/axios';
import { ApiResponse, Favorite, FavoriteResponse } from '@/types';

export const favoriteService = {
  /**
   * Adiciona uma propriedade à lista de favoritos do usuário logado
   */
  async addFavorite(propertyId: string): Promise<ApiResponse<FavoriteResponse>> {
    const { data } = await axiosInstance.post<ApiResponse<FavoriteResponse>>('/Favorite/Add-Favorite', {
      propertyId,
    });
    return data;
  },

  /**
   * Remove uma propriedade da lista de favoritos do usuário logado
   */
  async removeFavorite(propertyId: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await axiosInstance.delete<ApiResponse<{ message: string }>>(
      `/Favorite/Remove-Favorite/${propertyId}`
    );
    return data;
  },

  /**
   * Obtém todas as propriedades favoritadas pelo usuário logado
   */
  async getFavorites(): Promise<ApiResponse<Favorite[]>> {
    const { data } = await axiosInstance.get<ApiResponse<Favorite[]>>('/Favorite/Get-Favorites');
    return data;
  },
};