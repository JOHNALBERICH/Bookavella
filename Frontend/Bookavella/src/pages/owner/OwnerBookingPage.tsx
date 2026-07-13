import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/features/booking/services/bookingService';
import { propertyService } from '@/features/property/services/propertyService';
import { roomService } from '@/features/room/services/roomService';
import { useConfirmBooking } from '@/features/booking/hooks/useConfirmBooking';
import { useCancelBooking } from '@/features/booking/hooks/useCancelBooking';
import { BookingStatus, Booking } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '../../../@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, FolderOpen, Check, Ban } from 'lucide-react';

export default function OwnerBookingsPage() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | BookingStatus>('all');

  const ownerId = currentUser?.id || '';

  // 1. Carrega as propriedades do dono para obter a lista de IDs pertencentes a ele
  const { data: propertiesResponse, isLoading: loadingProperties } = useQuery({
    queryKey: ['properties', 'owner', ownerId],
    queryFn: () => propertyService.getOwnerProperties(ownerId),
    enabled: !!ownerId,
  });

  const ownedProperties = propertiesResponse || [];
  const ownedPropertyIds = ownedProperties.map((p) => p.id);

  // 2. Carrega todos os quartos para resolver o nome das acomodações de forma relacional local
  const { data: roomsResponse, isLoading: loadingRooms } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomService.getRooms(),
  });

  const allRooms = roomsResponse|| [];

  // 3. Carrega o histórico completo de reservas (filtrado automaticamente pelo backend para a role Owner)
  const { data: bookingsResponse, isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings', 'owner', ownerId],
    queryFn: () => bookingService.getBookingHistory(),
  });

  const rawBookings = bookingsResponse?.data || [];

  // Filtra as reservas garantindo que pertençam às propriedades cadastradas por este dono
  const ownerBookings = rawBookings.filter((b) => ownedPropertyIds.includes(b.propertyId));

  // Filtra de acordo com a aba de status ativa na tela
  const filteredBookings = ownerBookings.filter((b) => {
    if (activeTab === 'all') return true;
    return b.bookingStatus === activeTab;
  });

  const confirmMutation = useConfirmBooking();
  const cancelMutation = useCancelBooking();

  const handleConfirm = (bookingId: string) => {
    if (window.confirm('Do you want to confirm this booking request?')) {
      confirmMutation.mutate(bookingId);
    }
  };

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? This will issue a refund if paid.')) {
      cancelMutation.mutate(bookingId);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Requests' },
    { id: BookingStatus.Pending, label: 'Pending' },
    { id: BookingStatus.Confirmed, label: 'Confirmed' },
    { id: BookingStatus.Canceled, label: 'Canceled' },
    { id: BookingStatus.Complete, label: 'Completed' },
  ];

  const isLoading = loadingProperties || loadingRooms || loadingBookings;

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-secondary">Loading incoming bookings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">Booking Requests</h1>
        <p className="text-xs text-text-secondary">Approve, monitor or cancel hotel agendamentos.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border space-x-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-4 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap focus:outline-none",
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tabela de Dados */}
      {filteredBookings.length === 0 ? (
        <div className="h-72 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 bg-surface/30 gap-4 text-center">
          <FolderOpen className="h-8 w-8 text-text-tertiary" />
          <h3 className="text-sm font-semibold">No booking requests found</h3>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-md overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-text-secondary uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Guest</th>
                <th className="p-4 font-semibold">Sanctuary</th>
                <th className="p-4 font-semibold">Room Type</th>
                <th className="p-4 font-semibold">Dates</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBookings.map((b) => {
                const matchedProperty = ownedProperties.find((p) => p.id === b.propertyId);
                const matchedRoom = allRooms.find((r) => r.roomId === b.roomId);

                return (
                  <tr key={b.bookingId} className="hover:bg-background/20 transition-colors">
                    {/* GAP WARNING: O backend não expõe o nome do hóspede direto nesta listagem plano de histórico. 
                        Apresentamos o ID do usuário truncado como identificação temporária */}
                    <td className="p-4 font-mono font-medium text-accent">Guest #{b.userId.substring(0, 6).toUpperCase()}</td>
                    <td className="p-4 font-medium text-text-primary">{matchedProperty?.propertyname || 'Loading Hotel...'}</td>
                    <td className="p-4 text-text-secondary">{matchedRoom?.roomName || 'Loading Room...'}</td>
                    <td className="p-4 text-text-secondary">
                      {new Date(b.checkInDate).toLocaleDateString('pt-BR')} to {new Date(b.checkOutDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 font-bold text-text-primary">R$ {b.totalPrice.toLocaleString('pt-BR')}</td>
                    <td className="p-4"><StatusBadge status={b.bookingStatus} type="booking" /></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.bookingStatus === BookingStatus.Pending && (
                          <Button 
                            variant="ghost" 
                            className="h-8 px-2 text-[11px] text-success hover:bg-success/10 hover:text-success" 
                            onClick={() => handleConfirm(b.bookingId)}
                          >
                            <Check className="h-3.5 w-3.5" /> Confirm
                          </Button>
                        )}
                        {(b.bookingStatus === BookingStatus.Pending || b.bookingStatus === BookingStatus.Confirmed) && (
                          <Button 
                            variant="ghost" 
                            className="h-8 px-2 text-[11px] text-error hover:bg-error/10 hover:text-error" 
                            onClick={() => handleCancel(b.bookingId)}
                          >
                            <Ban className="h-3.5 w-3.5" /> Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}