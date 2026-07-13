import { axiosInstance } from '@/lib/axios';
import { ApiResponse, Payment } from '@/types';
import { CreatePaymentRequest, ValidatePaymentRequest } from '../types';

export const paymentService = {
  /**
   * Passo 1: Inicia o faturamento gerando uma transação com status "pending".
   * Rota Autenticada
   */
  async createPayment(payload: CreatePaymentRequest): Promise<Payment> {
    const { data } = await axiosInstance.post<Payment>('/Payment/Create-Payment', payload);
    return data;
  },

  /**
   * Passo 2: Valida e consolida o faturamento final no gateway.
   * Rota Autenticada
   * 
   * NOTA DE INTEGRAÇÃO (Fase 7 — Otimização):
   * O campo 'totalAmount' foi removido deste payload conforme a nova especificação de API.
   * Os dados de segurança do cartão e IDs são validados de forma isolada e segura.
   * 
   * @param payload Contrato contendo bookingId, paymentId, paymentType, cardNumber, cardHolderName e cvv
   */
  async validatePayment(payload: ValidatePaymentRequest): Promise<Payment> {
    const { data } = await axiosInstance.post<Payment>('/Payment/Validate-Payment', payload);
    return data;
  },

  /**
   * Reversão/Contingência: Em caso de falhas críticas ou recusa de cobrança no passo 2,
   * reverte e estorna a transação liberando as diárias do hotel associado.
   * Rota Autenticada
   * 
   * NOTA DE INTEGRAÇÃO (Fase 7 — Sincronização):
   * O método foi alterado de PATCH para POST, e o ID da reserva migrou da URL amarrada
   * para o corpo de faturamento síncrono da requisição ({ bookingId }).
   * 
   * @param bookingId ID da reserva gerada no passo 1 (Guid)
   */
  async cancelPayment(bookingId: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await axiosInstance.post<ApiResponse<{ message: string }>>('/Payment/Cancel-Payment', {
      bookingId, // Envia de forma encapsulada no corpo da requisição POST
    });
    return data;
  },
};