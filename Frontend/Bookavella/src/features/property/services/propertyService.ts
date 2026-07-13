import { axiosInstance } from '@/lib/axios';
import { 
  ApiResponse, 
  PropertySearchResponse, 
  PropertyDetailResponse,
  CreatePropertyResponse, 
  PropertiesFilterRequest,
  PaginationResponse
} from '@/types';
import { PropertySearchParams, CreatePropertyRequest, UpdatePropertyRequest } from '../types';

export const propertyService = {
  /**
   * Realiza a busca de propriedades aplicando os filtros passados como parâmetros
   * Rota Pública
   */
    async searchProperties(
    params: Partial<PropertiesFilterRequest> = {}
  ): Promise<PaginationResponse<PropertySearchResponse>> {
    const { data } = await axiosInstance.get('/Properties/Search', {
      params: {
        Name: params.Name,
        MinPrice: params.MinPrice,
        MaxPrice: params.MaxPrice,
        PropertyType: params.PropertyType,
        City: params.City,
        Country: params.Country,
        Address: params.Address,
        SortBy: params.SortBy,
        'Pagination.PageIndex': params['Pagination.PageIndex'] ?? 1,
        'Pagination.PageSize': params['Pagination.PageSize'] ?? 10,
      },
    });
    // Backend trả về { items, pageIndex, totalCount, totalItems, pageSize }
    return data as PaginationResponse<PropertySearchResponse>;
  },

  /**
   * Obtém os detalhes completos de uma propriedade específica pelo seu ID único (Guid)
   * Rota Pública
   */
  async getPropertyDetails(id: string): Promise<PropertyDetailResponse> {
    const { data } = await axiosInstance.get<PropertyDetailResponse>(`/Properties/Details/${id}`);
    return data;
  },

  /**
   * Cria um novo anúncio de propriedade/hotel no sistema
   * Rota Autenticada (Owner)
   */
  async createProperty(payload: CreatePropertyRequest): Promise<CreatePropertyResponse> {
    const { data } = await axiosInstance.post<CreatePropertyResponse>('/Properties/Create-Property', payload);
    return data;
  },

  /**
   * Modifica as configurações, status de funcionamento ou preços de uma propriedade existente
   * Rota Autenticada (Owner)
   */
  async updateProperty(id: string, payload: UpdatePropertyRequest): Promise<PropertyDetailResponse> {
    const { data } = await axiosInstance.put<PropertyDetailResponse>(`/Owner/Update-Property/${id}`, payload);
    return data;
  },

  /**
   * Remove permanentemente do catálogo uma propriedade específica pelo seu ID único
   * Rota Autenticada (Owner)
   */
  async deleteProperty(id: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await axiosInstance.delete<ApiResponse<{ message: string }>>(`/Properties/Delete-Property/${id}`);
    return data;
  },

  /**
   * Obtém o portfólio completo de propriedades vinculadas à conta do proprietário ativo
   * Rota Autenticada (Owner)
   * @param ownerId Identificador único do proprietário logado (Guid)
   */
  async getOwnerProperties(ownerId: string): Promise<PropertySearchResponse[]> {
    // 1. Tenta realizar a filtragem nativa do portfólio via Query String na rota de buscas geral
    const { data } = await axiosInstance.get<PropertySearchResponse[]>( `Properties/Owner-Properties/${ownerId}`, {
      params: { ownerId ,
       'Pagination.PageIndex':   1,
        'Pagination.PageSize':  10,
      }
    });
    console.log(data);
    // 2. TODO: BACKEND GAP WARNING
    // Se o backend não realizar a filtragem de propriedades por ownerId nativamente e retornar todos os registros do banco,
    // o bloco comentado abaixo realiza a intersecção de segurança no cliente com base no ID de vinculação do proprietário:
    //
    // const allProperties = data.data || [];
    // const ownedProperties = allProperties.filter(
    //   (p: any) => p._propertyOwnerId === ownerId || p.propertyOwnerId === ownerId
    // );
    // return {
    //   ...data,
    //   data: ownedProperties,
    // };

    return data;
  },
};