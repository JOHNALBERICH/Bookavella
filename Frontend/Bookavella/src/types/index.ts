// ═══ ENUMS ═══

export enum BookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Canceled = "canceled",
  Complete = "complete"
}

export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
  Refunded = "refunded"
}

export enum PropertyStatus {
  UnderMaintenance = "underMaintenance",
  Unavailable = "unavailable",
  Available = "available"
}

export enum RoomStatus {
  Available = "Available",
  Booked = "Booked",
  Unavailable = "Unavailable"
}

export enum RoomType {
  Standard = "Standard",
  Deluxe = "Deluxe",
  Superior = "Superior",
  Suite = "Suite",
  Family = "Family",
  Executive = "Executive"
}

export enum BedType {
  Single = "Single",
  Twin = "Twin",
  Double = "Double",
  Queen = "Queen",
  King = "King",
  SofaBed = "SofaBed",
  BunkBed = "BunkBed"
}

export enum UserRole {
  Admin = "Admin",
  User = "Users",
  PropertyOwner = "PropertyOwner",
  Guests = "Guests"
}

// ═══ ENTITY INTERFACES ═══

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  emailVerified: boolean;
  createdDate: string;
  updatedDate: string;
  isActivated: boolean;
  role: string;
  permissions: boolean;
  avatarUrl: string;
  gender: string;
  nationality: string;
}

export interface Property {
  propertyId: string;
  propertyName: string;
  propertyOwnerId: string;
  propertyDescription: string;
  city: string;
  country: string;
  address: string;
  propertyType: string;
  valuePerNight: number;
  maxGuests: number;
  status: PropertyStatus;
  createdAt: string;
  propertyAmenities?: Amenity[];
  propertyImages?: PropertyImage[];
}

export interface Room {
  roomId: string;
  propertyId: string;
  roomName: string;
  roomDescription: string;
  roomType: RoomType;
  bedType: BedType;
  bedCount: number;
  maxGuests: number;
  valuePerNight: number;
  roomStatus: RoomStatus;
  createdAt: string;
  roomImages?: RoomImage[];
}

export interface Booking {
  bookingId: string;
  propertyId: string;
  userId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  numGuests: number;
  bookingStatus: BookingStatus;
  createdAt: string;
  cancelAt?: string;
}

export interface Payment {
  paymentId: string;
  bookingId: string;
  paymentType: string;
  paymentDate: string;
  paymentStatus: PaymentStatus;
  amount: number;
  
  
}

export interface Review {
  reviewId: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Favorite {
  favoriteId: string;
  userId: string;
  propertyId: string;
  createdDate: string;
}

export interface Amenity {
  amenityId: string;
  amenityName: string;
}

export interface Discount {
  discountId: string;
  roomId: string;
  discountCode: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PropertyImage {
  imageId: string;
  propertyId: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface RoomImage {
  roomImageId: string;
  roomId: string;
  imageUrl: string;
}

// ═══ REQUEST INTERFACES ═══

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterAuthRequest {
  username: string;
  email: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  password: string;
  confirmpassword: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface UpdateUserInforRequest {
  userId: string;
  name: string;
  phoneNumber: string;
  avatarUrl: string;
  gender: string;
  nationality: string;
}

export interface ChangingUserAvatarRequest {
  userId: string;
  avatarUrl: string;
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
  type?: string;
  city?: string;
  country?: string;
  address?: string;
  description?: string;
  value_perNight?: number;
  status?: PropertyStatus;
  amenities?: string[];
  imageUrl?: string[];
}

export interface CreateRoomsRequest {
  propertyId: string;
  roomName: string;
  roomDescription: string;
  roomType: RoomType;
  bedType: BedType;
  bedCount: number;
  price: number;
  maxGuests: number;
  roomStatus: RoomStatus;
  imageUrls: string[];
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

// 1. CreateBookingRequest atualizado: removeu 'userId' e 'totalPrice' (Task 1)
export interface CreateBookingRequest {
  roomId: string;
  discountCode?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}

export interface CancelBookingRequest {
  reasons: string;
}

export interface ConfirmBookingRequest {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  cvv: string;
  propertyname: string;
}

export interface CreatePaymentRequest {
  bookingId: string;
  paymentType: string;
}

// 2. ValidatePaymentRequest atualizado: removeu 'totalAmount' (Task 2)
export interface ValidatePaymentRequest {
  bookingId: string;
  paymentId: string;
  paymentType: string;
  cardNumber: string;
  cardHolderName: string;
  cvv: string;
}

// 3. CancelPaymentRequest adicionado (Task 3)
export interface CancelPaymentRequest {
  bookingId: string;
}

export interface CreateDiscountRequest {
  roomId: string;
  discountCode: string;
  discountPercentage: number;
  endDate: string;
  startDate: string;
  isActive: boolean;
}

export interface UpdateDiscountRequest {
  discountCode?: string;
  discountPercentage?: number;
  endDate: string;
  startDate: string;
  isActive?: boolean;
  roomId: string;
}

export interface AmenitiesRequest {
  amenityName: string;
}

export interface FavoriteRequest {
  propertyId: string;
}

export interface CreateCommentRequest {
  comment: string;
  rating: number;
  propertyId: string;
}

export interface UpdateCommentRequest {
  comment: string;
  rating: number;
}

// --- NEW REQUEST TYPES (Phase 6 Admin Expansion) ---

// 5. Nota de Integração: Mapeado agora como Query Params na rota GET /Admin/users
export interface AdminUserQueryRequest {
  search?: string;
  role?: string;
  name?: string;
  email?: string;
  phone?: string;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
}

export interface ReviewQueryRequest {
  search?: string;
  propertyId?: string;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
}

export interface PropertiesFilterRequest {
  Name?: string;
  MinPrice?: number;
  MaxPrice?: number;
  PropertyType?: string;
  City?: string;
  Country?: string;
  Address?: string;
  SortBy?: string;
  'Pagination.PageIndex'?: number;
  'Pagination.PageSize'?: number;
}

// ═══ RESPONSE INTERFACES ═══

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  name: string;
  phoneNumber: string;
}

export interface UserResponse {
  userName: string;
  phoneNumber: string;
  email: string;
}

export interface ChangingUserAvatarResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface CreatePropertyResponse {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  propertyType: string;
  value_perNight: number;
  maxGuests: number;
  address: string;
}

// --- UPDATED RESPONSE TYPES (Phase 3 & 5 Relations) ---

export interface PropertyAmenitiesResponse {
  amenityId: string;
  amenityName: string;
}

export interface PropertyImageResponse {
  id: string
  url: string
}

export interface PropertyDetailResponse {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  status: PropertyStatus;
  propertyType: string;
  value_perNight: number;
  maxGuests: number;
  propertyImages?: PropertyImageResponse[];
  propertyAmenities?: PropertyAmenitiesResponse[];
  rooms?: RoomsDetailResponse[]        // ← NEW
  reviews?: CommentAndRatingResponse[]
}

// GET /Properties/Search response item
export interface PropertySearchResponse {
  id: string;
  propertyname: string;
  ownername: string;
  propertytype: string;
  pricePernight: number;
  description: string;
  city: string;
  country: string;
  address: string;
  createdAt: string;
}

// 4. BookingsResponse atualizado: status e bedType convertidos de Enum para String (Task 4)
export interface BookingsResponse {
  bookingId: string;
  propertyName: string;
  roomName: string;
  bedType: string; // Convertido de BedType para string pura
  checkInDate: string;
  checkOut: string;
  numGuests: number;
  status: string; // Convertido de BookingStatus para string pura
  prices: number;
}

export interface CancelBookingResponse {
  bookingId: string;
  bookingStatus: string;
  lastBookingDate: string;
  cancellationReason: string;
}

export interface ConfirmBookingResponse {
  bookingId: string;
  checkindate: string;
  checkOutdate: string;
  bookingStatus: BookingStatus;
  totalprice: number;
  createdAt: string;
}

export interface PaymentResponse {
  paymentId: string;
  bookingId: string;
  paymentType: string;
  paymentDate: string;
  paymentStatus: string;
  amount: number;
}

export interface DiscountResponse {
  id: string;
  roomId: string;
  code: string;
  percentage: number;
  expiryDate: string;
}

export interface DeleteDiscountResponse {
  message: string;
}

export interface DeletePropertyResponse {
  message: string;
}

export interface FavoriteResponse {
  favoriteId: string;
  propertyId: string;
  createdDate: string;
}

export interface AmenitiesResponse {
  amenityName: string;
}

export interface ReviewResponse {
  message: string;
}

// --- NEW RESPONSE TYPES (Phase 6 Admin Expansion) ---

export interface AdminGetUserResponse {
  userName: string;
  avatarUrl: string;
  role: string[];
  phoneNumber: string;
  nationality: string;
  email: string;
  isBanned: boolean;
  isActivated: boolean;
}

export interface CommentAndRatingResponse {
  userName: string;
  userAvatar: string;
  comment: string;
  rating: number;
}
export interface RoomsDetailResponse {
  roomId: string;
  roomName: string
  roomDescription: string
  roomType: RoomType
  bedType: BedType
  bedCount: number
  price: number
  maxGuests: number
  roomStatus: RoomStatus
  imageUrls: string[]
}
// ═══ UTILITY TYPES ═══

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationResponse<T> {
  items: T[];
  pageIndex: number;
  totalCount: number;
  totalItems: number;
  pageSize: number;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string[];
  exp: number;
}
