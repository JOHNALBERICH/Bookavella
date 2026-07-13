import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/features/room/services/roomService';
import { propertyService } from '@/features/property/services/propertyService';
import { useCancelBooking } from '@/features/booking/hooks/useCancelBooking';
import { Booking, Room, PropertyDetailResponse, BookingStatus, PaymentStatus } from '@/types';
import StatusBadge from './StatusBadge';
import { Separator } from '../../@/components/ui/separator';
import { Button } from '../../@/components/ui/button';
import { Calendar, Users, DollarSign, Ban, MessageSquarePlus, Loader2 } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  room?: Room;
  property?: PropertyDetailResponse;
  onLeaveReview?: (propertyId: string) => void;
}

export default function BookingCard({
  booking,
  room,
  property,
  onLeaveReview,
}: BookingCardProps) {
  const cancelMutation = useCancelBooking();

  // 1. Resolve detalhes do quarto caso não tenham sido fornecidos via prop (Client-Side Join)
  const { data: roomResponse } = useQuery({
    queryKey: ['room', booking.roomId],
    queryFn: () => roomService.getRoomDetails(booking.roomId),
    enabled: !room && !!booking.roomId,
  });

  // 2. Resolve detalhes do hotel de forma implícita (Client-Side Join)
  const { data: propertyResponse } = useQuery({
    queryKey: ['property', booking.propertyId],
    queryFn: () => propertyService.getPropertyDetails(booking.propertyId),
    enabled: !property && !!booking.propertyId,
  });

  const activeRoom = roomResponse;
  const activeProperty =  propertyResponse;

  const handleCancel = () => {
    const confirmed = window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.');
    if (confirmed) {
      cancelMutation.mutate(booking.bookingId);
    }
  };

  // Derivação lógica de status de pagamento baseada no estado atômico da reserva (Fase 4 - Task 2)
  const getDerivedPaymentStatus = (): PaymentStatus => {
    if (booking.bookingStatus === BookingStatus.Confirmed || booking.bookingStatus === BookingStatus.Complete) {
      return PaymentStatus.Paid;
    }
    if (booking.bookingStatus === BookingStatus.Pending) {
      return PaymentStatus.Pending;
    }
    return PaymentStatus.Failed;
  };

  const paymentStatus = getDerivedPaymentStatus();

  return (
    <div className="p-6 bg-surface border border-border rounded-lg space-y-6 shadow-sm hover:shadow-md transition-shadow font-body text-text-primary">
      {/* Header do Card */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-heading font-semibold text-base leading-tight">
            {activeProperty?.name || 'Sanctuary details loading...'} //
          </h3>
          <p className="text-xs text-text-secondary">
            {activeRoom?.roomName || 'Accommodation loading...'}
          </p>
        </div>

        {/* Badges de Status */}
        <div className="flex items-center gap-2">
          <StatusBadge status={booking.bookingStatus} type="booking" />
          <StatusBadge status={paymentStatus} type="payment" />
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Grid de Detalhes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          <span>
            {new Date(booking.checkInDate).toLocaleDateString('pt-BR')} to{' '}
            {new Date(booking.checkOutDate).toLocaleDateString('pt-BR')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-accent" />
          <span>{booking.numGuests} Guests</span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-accent" />
          <span className="font-bold text-text-primary">
            Total Price: R$ {booking.totalPrice.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-2">
        {/* Cancelamento permitido apenas para reservas pending */}
        {booking.bookingStatus === BookingStatus.Pending && (
          <Button
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            variant="destructive"
            className="h-9 text-xs flex items-center gap-2 cursor-pointer"
          >
            {cancelMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Ban className="h-4 w-4" />
                <span>Cancel Reservation</span>
              </>
            )}
          </Button>
        )}

        {/* Avaliação permitida apenas para reservas complete */}
        {booking.bookingStatus === BookingStatus.Complete && onLeaveReview && (
          <Button
            onClick={() => onLeaveReview(booking.propertyId)}
            variant="outline"
            className="h-9 text-xs flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="h-4 w-4 text-accent" />
            <span>Leave a Review</span>
          </Button>
        )}
      </div>
    </div>
  );
}