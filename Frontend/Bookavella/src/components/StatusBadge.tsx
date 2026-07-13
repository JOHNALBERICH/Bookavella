import {
  BookingStatus,
  PaymentStatus,
  PropertyStatus,
  RoomStatus,
} from '@/types';
import {
  BOOKING_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  PROPERTY_STATUS_LABEL,
  ROOM_STATUS_LABEL,
  BOOKING_STATUS_COLOR,
  PAYMENT_STATUS_COLOR,
  PROPERTY_STATUS_COLOR,
  ROOM_STATUS_COLOR,
} from '@/constants';
import { cn } from '@/lib/utils';

type StatusType = BookingStatus | PaymentStatus | PropertyStatus | RoomStatus;

interface StatusBadgeProps {
  status: StatusType;
  type: 'booking' | 'payment' | 'property' | 'room';
  className?: string;
}

export default function StatusBadge({ status, type, className }: StatusBadgeProps) {
  // Traduz e estiliza dinamicamente baseando-se nas tabelas mestre da Fase 1 - Task 7
  const getLabel = () => {
    switch (type) {
      case 'booking':
        return BOOKING_STATUS_LABEL[status as BookingStatus];
      case 'payment':
        return PAYMENT_STATUS_LABEL[status as PaymentStatus];
      case 'property':
        return PROPERTY_STATUS_LABEL[status as PropertyStatus];
      case 'room':
        return ROOM_STATUS_LABEL[status as RoomStatus];
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'booking':
        return BOOKING_STATUS_COLOR[status as BookingStatus];
      case 'payment':
        return PAYMENT_STATUS_COLOR[status as PaymentStatus];
      case 'property':
        return PROPERTY_STATUS_COLOR[status as PropertyStatus];
      case 'room':
        return ROOM_STATUS_COLOR[status as RoomStatus];
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase font-body',
        getColorClasses(),
        className
      )}
    >
      {getLabel()}
    </span>
  );
}