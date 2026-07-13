import { useNavigate } from 'react-router-dom';
import { Room, RoomStatus } from '@/types';
import { Users, BedDouble, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Button } from '../../@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

interface BookingInfo {
    checkIn: string;
    checkOut: string;
    guests: number;
}

interface RoomCardProps {
    room: Room;
    propertyId: string;
    bookingInfo?: BookingInfo;
}

export default function RoomCard({ room, propertyId, bookingInfo }: RoomCardProps) {
  const navigate = useNavigate();
  const canBook =
    bookingInfo &&
    bookingInfo.checkIn &&
    bookingInfo.checkOut &&
    bookingInfo.guests > 0;
  const handleViewDetails = () => {
    navigate(`/properties/${propertyId}/rooms/${room.roomId}`);
  };
  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede borbulhamento de eventos no container pai

    // Navega imperativamente injetando os metadados do quarto no estado síncrono do roteador
    if (!bookingInfo) return;
    navigate(ROUTES.BOOKING, {
      state: {
        roomId: room.roomId,
        propertyId,
        ...bookingInfo,
      },
    });
  };
  console.log(ROUTES.BOOKING);
  const primaryImage =
    room.roomImages?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600'; // Fallback quarto

  return (
    <div className="group flex flex-col md:flex-row bg-surface border border-border rounded-lg overflow-hidden transition-all duration-normal shadow-sm hover:shadow-md">
      {/* Imagem do Quarto */}
      <div className="relative w-full md:w-72 aspect-video md:aspect-auto overflow-hidden bg-background shrink-0">
        <img
          src={primaryImage}
          alt={room.roomName}
          className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={room.roomStatus} type="room" />
        </div>
      </div>

      {/* Detalhes Técnicos */}
      <div className="flex-1 p-6 flex flex-col justify-between gap-6">
        <div className="space-y-4">
          {/* Título e Badges de Categoria */}
          <div className="space-y-1.5">
            <h3 className="font-heading font-medium text-base text-text-primary leading-tight">
              {room.roomName}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center px-1.5 py-0.5 bg-background border border-border rounded-sm text-[10px] font-medium tracking-wide uppercase text-accent">
                {room.roomType}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 bg-background border border-border rounded-sm text-[10px] font-medium tracking-wide uppercase text-text-secondary">
                {room.bedType}
              </span>
            </div>
          </div>

          {/* Especificações de Lotação e Cama */}
          <div className="flex items-center gap-6 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-text-tertiary" />
              <span>Max {room.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-text-tertiary" />
              <span>{room.bedCount} Bed(s)</span>
            </div>
          </div>
        </div>

        {/* Rodapé Tarifário e Ação */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Per night</span>
            <span className="font-body text-base font-semibold text-text-primary">
              R$ {room.valuePerNight.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleViewDetails}
              variant="outline"
              className="h-9 text-xs flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            {/* ◄ REQUISITO: Exibe condicionalmente o botão de fechamento rápido de reservas apenas se disponível */}
            {room.roomStatus === RoomStatus.Available && (
              <Button
                disabled={!canBook }
                onClick={handleBookNow}
                className="h-9 text-xs bg-accent text-[#FFFFFF] hover:bg-accent-hover font-semibold transition-colors px-4 cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
              >
                Book Now
                
              </Button>
              
            )}
            {!canBook && (
                  <p className="text-xs text-muted-foreground mt-2">
                      Select check-in and check-out dates.
                  </p>
              )}
          </div>

        </div>
      </div>
    </div>
  );
}