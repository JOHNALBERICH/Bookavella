import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/features/room/services/roomService';
import { useAuth } from '@/contexts/AuthContext';
import ImageGallery from '@/components/ImageGallery';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '../../../@/components/ui/button';
import { ROUTES } from '@/constants';
import { Users, BedDouble, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';

export default function RoomDetailPage() {
  const { id, roomId } = useParams<{ id: string; roomId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const propertyId = id || '';
  const rId = roomId || '';

  // Parâmetros do Bloco de Reserva (State)
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);

  // Busca detalhes do quarto específico
  const { data: detailsResponse, isLoading } = useQuery({
    queryKey: ['room', rId],
    queryFn: () => roomService.getRoomDetails(rId),
    enabled: !!rId,
  });

  const room = detailsResponse?.data;

  if (isLoading || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4 font-body">
        <div className="space-y-4 w-full max-w-[320px] text-center">
          <div className="h-4 w-3/4 bg-border/50 animate-pulse rounded-sm mx-auto" />
          <div className="h-9 w-full bg-border/50 animate-pulse rounded-sm" />
        </div>
      </div>
    );
  }

  // Prepara as fotos do quarto para alimentar a Galeria de Imagens
  const galleryImages = room.roomImages?.map((img) => ({
    url: img.imageUrl,
  })) || [];

  // Cálculos Parciais de Diárias (Preview)
  const calculateNights = (): number => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const difference = end.getTime() - start.getTime();
    const days = Math.ceil(difference / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const nights = calculateNights();
  const rawTotalPrice = nights * room.valuePerNight;

  const handleBookingRedirect = () => {
    // Se o hóspede clicar para fechar a reserva sem estar autenticado,
    // redireciona para a tela de login salvando a origem
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Navega imperativamente enviando os metadados do checkout por rota de estado (state API)
    navigate(ROUTES.BOOKING, {
      state: {
        roomId: room.roomId,
        propertyId,
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  return (
    <div className="space-y-12 pb-20 text-text-primary font-body max-w-5xl mx-auto">
      {/* Retornar para Detalhes do Hotel */}
      <button
        onClick={() => navigate(`/properties/${propertyId}`)}
        className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent transition-colors cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Property Details
      </button>

      {/* SECTION 1: ROOM IMAGE GALLERY */}
      <ImageGallery images={galleryImages} alt={room.roomName} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SECTION 2 & 3: DETAILS */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-sm text-[10px] font-semibold tracking-wide uppercase text-accent">
                {room.roomType}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 bg-background border border-border rounded-sm text-[10px] font-semibold tracking-wide uppercase text-text-secondary">
                {room.bedType}
              </span>
              <StatusBadge status={room.roomStatus} type="room" />
            </div>

            <h1 className="font-heading text-2xl md:text-3xl font-semibold leading-tight">
              {room.roomName}
            </h1>

            {/* Ícones de Capacidade */}
            <div className="flex items-center gap-6 text-xs text-text-secondary border-b border-border pb-6">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-text-tertiary" />
                <span>Max {room.maxGuests} Guests</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-text-tertiary" />
                <span>{room.bedCount} Bed(s) ({room.bedType})</span>
              </div>
            </div>
          </div>

          {/* Descrição do Quarto */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-medium text-text-primary">Accommodation Description</h3>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap max-w-2xl">
              {room.roomDescription || "A carefully designed space, crafted with minimalist textures and precise geometry to deliver absolute peace and structural silence."}
            </p>
          </div>
        </div>

        {/* SECTION 4 & 5: AVAILABILITY & BOOKING BLOCK */}
        <div className="lg:col-span-4 sticky top-24">
          <Card className="bg-surface border-border shadow-lg">
            <CardHeader className="border-b border-border pb-4 mb-4">
              <CardDescription className="text-[10px] text-text-tertiary uppercase tracking-wider">Per night</CardDescription>
              <CardTitle className="text-2xl font-body font-bold text-text-primary">
                R$ {room.valuePerNight.toLocaleString('pt-BR')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Inputs de Data */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Contador de Hóspedes */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={room.maxGuests}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Preview de Preço */}
              {nights > 0 && (
                <div className="space-y-3 border-t border-border pt-4 text-xs font-body">
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>
                      R$ {room.valuePerNight.toLocaleString('pt-BR')} × {nights} nights
                    </span>
                    <span>R$ {rawTotalPrice.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-sm text-text-primary border-t border-border pt-3">
                    <span>Total Estimate</span>
                    <span>R$ {rawTotalPrice.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              )}

              {/* TODO: O backend ainda não possui motor de validação/checagem de disponibilidade de datas por período. */}
              {/* O botão ficará liberado temporariamente para simular os checkouts de checkout na Fase 4. */}
              <Button
                onClick={handleBookingRedirect}
                disabled={room.roomStatus === 'Unavailable' || (nights > 0 && rawTotalPrice <= 0)}
                className="w-full h-11 bg-accent text-background hover:bg-accent-hover font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer rounded-sm"
              >
                <span>Book Sanctuary Now</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}