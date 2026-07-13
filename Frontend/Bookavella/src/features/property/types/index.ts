import { PropertyStatus } from '@/types';

export interface PropertySearchParams {
  city?: string;
  country?: string;
  address?: string;
  propertyType?: string;
  maxGuests?: number;
  minPrice?: number;
  maxPrice?: number;
  checkIn?: string; // Formato de string ISO (ex: YYYY-MM-DD)
  checkOut?: string; // Formato de string ISO
  ownerId?: string; // Filtro estendido para carregamento do portfólio de proprietários
  'Pagination.PageIndex'?: number;
  'Pagination.PageSize'?: number;
}

export interface CreatePropertyRequest {
  name: string;
  ownerId: string;
  description: string;

  city: string;
  country: string;
  address: string;

  propertyType: string;

  value_perNight: number;
  maxGuests: number;

  imageUrls: string[];

  propertyAmenities: string[];
}

export interface UpdatePropertyRequest {
  name?: string;
  description?: string;

  type?: string;

  city?: string;
  country?: string;
  address?: string;

  value_perNight?: number;

  status: PropertyStatus;

  Amenities?: string[];

  ImageUrl?: string[];
}