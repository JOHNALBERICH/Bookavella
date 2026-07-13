import {
  BookingStatus,
  PaymentStatus,
  PropertyStatus,
  RoomStatus,
  UserRole,
} from '@/types';

// 1. Dicionário de Rotas Físicas e Dinâmicas do Aplicativo
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REGISTER_OWNER: '/auth/owner/register',
  RESET_PASSWORD: '/reset-password',
  SETTINGS: 'guest/settings',
  PROPERTY_DETAIL: '/properties/:id', //fixed error
  ROOM_DETAIL: '/properties/:id/rooms/:roomId', //err
  BOOKING: '/guest/booking/checkout', //fixed
  PAYMENT: '/guest/payment/', //need to be fix
  BOOKING_HISTORY: '/guest/booking-history',
  FAVORITES: '/guest/favorites',
  PROFILE: '/guest/profile',
  
  // Rotas Privadas do Portal do Proprietário (Owner)
  OWNER: {
    DASHBOARD: '/owner',
    PROPERTIES: '/owner/properties',
    CREATE_PROPERTY: '/owner/properties/create',
    EDIT_PROPERTY: '/owner/properties/:id/edit',
    ROOMS: '/owner/properties/:id/rooms',
    CREATE_ROOM: '/owner/properties/:id/rooms/create',
    EDIT_ROOM: '/owner/rooms/edit/:roomId',
    AMENITIES: '/owner/amenities',
    DISCOUNTS: '/owner/discounts',
    BOOKINGS: '/owner/bookings',
    PAYMENTS: '/owner/payments',
    REVIEWS: '/owner/reviews',
  },

  // Rotas Privadas do Portal Administrativo (Admin)
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    PROPERTIES: '/admin/properties',
    AMENITIES: '/admin/amenities',
    REVIEWS: '/admin/reviews',
    SETTINGS: '/admin/settings',
  },
} as const;

// 2. Constante Espelho do Enum de Perfis de Acesso de Usuários (UserRole)
export const ROLES = {
  Admin: UserRole.Admin,
  User: UserRole.User,
  PropertyOwner: UserRole.PropertyOwner,
  Guests: UserRole.Guests,
} as const;

// 3. Mapeamento de Rótulos em Português para Exibição na UI (Status Labels)
export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: 'Pending',
  [BookingStatus.Confirmed]: 'Confirmed',
  [BookingStatus.Canceled]: 'Canceled',
  [BookingStatus.Complete]: 'Complete',
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: 'Pending',
  [PaymentStatus.Paid]: 'Paid',
  [PaymentStatus.Failed]: 'Failed',
  [PaymentStatus.Refunded]: 'Refunded',
};

export const PROPERTY_STATUS_LABEL: Record<PropertyStatus, string> = {
  [PropertyStatus.UnderMaintenance]: 'Under Maintenance',
  [PropertyStatus.Unavailable]: 'Unavailable',
  [PropertyStatus.Available]: 'Available',
};

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  [RoomStatus.Available]: 'Available',
  [RoomStatus.Booked]: 'Booked',
  [RoomStatus.Unavailable]: 'Unavailable',
};

// 4. Mapeamento de Classes Tailwind para Badges de Status (Status Colors)
// Consome as variáveis do nosso design system injetadas no tailwind.config/index.css
export const BOOKING_STATUS_COLOR: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: 'text-warning bg-warning/10 border border-warning/20',
  [BookingStatus.Confirmed]: 'text-success bg-success/10 border border-success/20',
  [BookingStatus.Canceled]: 'text-error bg-error/10 border border-error/20',
  [BookingStatus.Complete]: 'text-info bg-info/10 border border-info/20',
};

export const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: 'text-warning bg-warning/10 border border-warning/20',
  [PaymentStatus.Paid]: 'text-success bg-success/10 border border-success/20',
  [PaymentStatus.Failed]: 'text-error bg-error/10 border border-error/20',
  [PaymentStatus.Refunded]: 'text-info bg-info/10 border border-info/20',
};

export const PROPERTY_STATUS_COLOR: Record<PropertyStatus, string> = {
  [PropertyStatus.UnderMaintenance]: 'text-warning bg-warning/10 border border-warning/20',
  [PropertyStatus.Unavailable]: 'text-error bg-error/10 border border-error/20',
  [PropertyStatus.Available]: 'text-success bg-success/10 border border-success/20',
};

export const ROOM_STATUS_COLOR: Record<RoomStatus, string> = {
  [RoomStatus.Available]: 'text-success bg-success/10 border border-success/20',
  [RoomStatus.Booked]: 'text-info bg-info/10 border border-info/20',
  [RoomStatus.Unavailable]: 'text-error bg-error/10 border border-error/20',
};