import { axiosInstance } from '@/lib/axios';
import { ApiResponse, Discount } from '@/types';
import { CreateDiscountRequest, UpdateDiscountRequest } from '../types';

export const discountService = {
  /**
   * Recupera os detalhes de uma regra promocional através do seu código
   * Rota Pública (Fase 4)
   */
  async getDiscountByCode(code: string): Promise<ApiResponse<Discount>> {
    const { data } = await axiosInstance.get<ApiResponse<Discount>>(`/api/Discount/Get-Discount/${code}`);
    return data;
  },

  /**
   * Cria uma nova regra promocional de desconto vinculada a uma acomodação específica
   * Rota Autenticada (Owner)
   */
  async createDiscount(payload: CreateDiscountRequest): Promise<CreateDiscountRequest> {
    const { data } = await axiosInstance.post<CreateDiscountRequest>('/api/Discount/Create-Discount', payload);
    return data;
  },

  /**
   * Recupera todos os descontos cadastrados globalmente no sistema
   * Rota Autenticada (Owner / Admin)
   */
  async getAllDiscounts(): Promise<Discount[]> {
    const { data } = await axiosInstance.get<Discount[]>('/api/Discount/Get-All-Discounts');
    return data;
  },

  /**
   * Atualiza os critérios ou valores de um cupom existente a partir de sua string de código
   * Rota Autenticada (Owner)
   */
  async updateDiscount(code: string, payload: UpdateDiscountRequest): Promise<Discount> {
    const { data } = await axiosInstance.put<Discount>(`/api/Discount/Update-Discount/${code}`, payload);
    return data;
  },

  /**
   * Remove permanentemente do catálogo promocional um cupom de desconto específico pelo seu código
   * Rota Autenticada (Owner)
   */
  async deleteDiscount(code: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await axiosInstance.delete<ApiResponse<{ message: string }>>(`/api/Discount/Delete-Discount/${code}`);
    return data;
  },
};