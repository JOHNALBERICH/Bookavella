import { RoomType, RoomStatus, BedType } from '@/types';

export interface RoomFilters {
  roomType?: RoomType;
  roomStatus?: RoomStatus;
  bedType?: BedType;
  propertyId?: string;
}

export interface CreateRoomRequest {
  roomName: string;
  roomDescription: string;
  roomType: RoomType;
  bedType: BedType;
  bedCount: number;
  maxGuests: number;
  valuePerNight: number;
  roomStatus: RoomStatus;
}


export interface UpdateRoomsRequest {
  roomId: string;
  roomName?: string;
  roomDescription?: string;
  roomType?: RoomType;
  bedType?: BedType;
  bedCount?: number;
  valuePerNight?: number;
  maxGuests?: number;
  roomStatus?: RoomStatus;
  imageUrls?: string[];
}