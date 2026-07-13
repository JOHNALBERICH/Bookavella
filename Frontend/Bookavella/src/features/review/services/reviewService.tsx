import { axiosInstance } from '@/lib/axios';
import { ApiResponse, Review, ReviewResponse } from '@/types';
import { CreateReviewRequest, UpdateReviewRequest } from '../types';

export const reviewService = {
  /**
   * Envia uma nova avaliação/comentário para uma propriedade consumida pelo hóspede
   * Rota Autenticada
   */
  async createReview(payload: CreateReviewRequest): Promise<ApiResponse<ReviewResponse>> {
    const { data } = await axiosInstance.post<ApiResponse<ReviewResponse>>('/Review/Create-Review', payload);
    return data;
  },

  /**
   * Obtém a lista de todas as avaliações vigentes de uma determinada propriedade
   * Rota Pública
   * @param propertyId Identificador único da propriedade (Guid)
   */
  async getReviews(propertyId: string): Promise<ApiResponse<Review[]>> {
    const { data } = await axiosInstance.get<ApiResponse<Review[]>>(`/Review/Get-Reviews/${propertyId}`);
    return data;
  },

  /**
   * Atualiza os detalhes de uma avaliação realizada anteriormente pelo usuário
   * Rota Autenticada
   * @param reviewId ID único da avaliação original (Guid)
   */
  async updateReview(reviewId: string, payload: UpdateReviewRequest): Promise<ApiResponse<ReviewResponse>> {
    const { data } = await axiosInstance.put<ApiResponse<ReviewResponse>>(
      `/Review/Update-Review/${reviewId}`,
      payload
    );
    return data;
  },
};