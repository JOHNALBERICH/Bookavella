import { axiosInstance } from '@/lib/axios';
import { ApiResponse, Room , RoomsDetailResponse } from '@/types';
import { RoomFilters, CreateRoomRequest, UpdateRoomsRequest } from '../types';
export const roomService = {
  /**
   * Busca acomodações de forma inteligente com suporte a filtros e intersecção no cliente
   * Rota Pública
   */
  async getRooms(filters?: RoomFilters): Promise<Room[]> {
    if (!filters || Object.keys(filters).length === 0) {
      const { data } = await axiosInstance.get<Room[]>('/Rooms/Get-All-Rooms');
      return data;
    }

    const { roomType, roomStatus, bedType, propertyId } = filters;
    let endpoint = '/Rooms/Get-All-Rooms';

    if (roomType && !roomStatus && !bedType) {
      endpoint = `/Rooms/type/${roomType}`;
    } else if (roomStatus && !roomType && !bedType) {
      endpoint = `/Rooms/status/${roomStatus}`;
    } else if (bedType && !roomType && !roomStatus) {
      endpoint = `/Rooms/bedtype/${bedType}`;
    }

    const { data } = await axiosInstance.get<Room[]>(endpoint);

    // GAP ANALYSYS: Intersecção de filtros realizada no Client-side.
    let filteredRooms = data || [];

    if (roomType && endpoint !== `/Rooms/type/${roomType}`) {
      filteredRooms = filteredRooms.filter((r) => r.roomType === roomType);
    }
    if (roomStatus && endpoint !== `/Rooms/status/${roomStatus}`) {
      filteredRooms = filteredRooms.filter((r) => r.roomStatus === roomStatus);
    }
    if (bedType && endpoint !== `/Rooms/bedtype/${bedType}`) {
      filteredRooms = filteredRooms.filter((r) => r.bedType === bedType);
    }
    if (propertyId) {
      filteredRooms = filteredRooms.filter((r) => r.propertyId === propertyId);
    }

    return filteredRooms;
  },

  /**
   * Obtém detalhes completos de uma acomodação específica
   * Rota Pública
   */
  async getRoomDetails(roomId: string): Promise<RoomsDetailResponse> {
    const { data } = await axiosInstance.get<RoomsDetailResponse>(`/Rooms/Details/${roomId}`);
    return data;
  },

  /**
   * Cria uma nova acomodação vinculada a uma propriedade existente
   * Rota Autenticada (Owner)
   */
  async createRoom(propertyId: string, payload: CreateRoomRequest): Promise<Room> {
    const { data } = await axiosInstance.post<Room>(`/Owner/Properties/${propertyId}/rooms/create`, payload);
    return data;
  },

  /**
   * Atualiza as configurações e preços de um quarto
   * Rota Autenticada (Owner)
   * 
   * GAP WARNING: O backend não aceita o {roomId} na URL desta rota PUT.
   * O ID do quarto (roomId) deve ser fornecido exclusivamente no corpo (body) do payload.
   */
  async updateRoom(propertyId: string, roomId: string, payload: UpdateRoomsRequest): Promise<RoomsDetailResponse> {
    const { data } = await axiosInstance.put<RoomsDetailResponse>(`/Owner/Properties/${propertyId}/rooms/update/${roomId}`, payload);
    return data;
  },

  /**
   * Remove permanentemente do catálogo uma acomodação específica pelo seu ID único
   * Rota Autenticada (Owner)
   */
  async deleteRoom(roomId: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await axiosInstance.delete<ApiResponse<{ message: string }>>(`/Rooms/${roomId}`);
    return data;
  },
  async getRoomsByPropertyId(propertyId: string): Promise<Room[]> {
    const { data } = await axiosInstance.get<Room[]>(`Owner/Properties/${propertyId}/rooms`);
    return data;
  }
};