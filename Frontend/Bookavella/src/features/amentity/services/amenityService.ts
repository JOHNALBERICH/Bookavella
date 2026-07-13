import { axiosInstance } from '@/lib/axios';
import { ApiResponse, Amenity } from '@/types';

export const amenityService = {
  /**
   * Recupera todas as amenidades (comodidades) cadastradas globalmente no sistema
   * Rota Pública
   */
  async getAllAmenities(): Promise<ApiResponse<Amenity[]>> {
    const { data } = await axiosInstance.get<ApiResponse<Amenity[]>>('/Amenities/Get-All-Amenities');
    return data;
  },

  /**
   * Cadastra uma nova amenidade (comodidade) mestre no banco global
   * Rota Autenticada (Owner / Admin)
   * @param name Nome amigável da comodidade (ex: "Elevator")
   */
  async createAmenity(name: string): Promise<ApiResponse<Amenity>> {
    // Encapsula o parâmetro no campo 'amenityName' exigido pelo contrato da API do backend
    const { data } = await axiosInstance.post<ApiResponse<Amenity>>('/Amenities/Create-Amenity', {
      amenityName: name,
    });
    return data;
  },
};