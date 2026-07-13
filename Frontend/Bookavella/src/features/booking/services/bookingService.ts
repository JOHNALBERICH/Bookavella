import { axiosInstance } from '@/lib/axios';
import { ApiResponse, Booking } from '@/types';
import { CreateBookingRequest } from '../types';

export const bookingService = {
  /**
   * Cria uma nova solicitação de reserva temporária (status pending)
   * Rota Autenticada
   * 
   * NOTA DE INTEGRAÇÃO (Fase 7 — Sincronização):
   * Os campos 'userId' e 'totalPrice' foram formalmente removidos deste payload.
   * O ID do hóspede ativo é derivado pelo backend através do token JWT de requisição,
   * e o faturamento total (totalPrice) é calculado e retornado automaticamente pelo servidor.
   * 
   * @param payload Contrato contendo roomId, discountCode?, checkInDate, checkOutDate e numberOfGuests
   */
  async createBooking(payload: CreateBookingRequest): Promise<Booking> {
    const { data } = await axiosInstance.post<Booking>('/Booking/Create-Booking', payload);
    return data;
  },

  /**
   * Confirma e consolida uma reserva pendente (status confirmed)
   * Rota Autenticada
   * @param bookingId Identificador único da reserva (Guid)
   */
  async confirmBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    const { data } = await axiosInstance.patch<ApiResponse<Booking>>('/Booking/Confirm', {
      bookingId,
    });
    return data;
  },

  /**
   * Cancela uma reserva existente (status canceled)
   * Rota Autenticada
   * @param bookingId Identificador único da reserva (Guid)
   */
  async cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    const { data } = await axiosInstance.patch<ApiResponse<Booking>>('/Booking/Cancel', {
      bookingId,
    });
    return data;
  },

  /**
   * Recupera o histórico consolidado de reservas efetuadas pelo usuário ativo
   * Rota Autenticada
   */
  async getBookingHistory(): Promise<ApiResponse<Booking[]>> {
    const { data } = await axiosInstance.get<ApiResponse<Booking[]>>('/Booking/Booking-History');
    return data;
  },
};