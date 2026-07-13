import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/features/booking/services/bookingService';
import { propertyService } from '@/features/property/services/propertyService';
import { roomService } from '@/features/room/services/roomService';
import { BookingStatus, PaymentStatus } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Loader2, FolderOpen, CreditCard } from 'lucide-react';

export default function OwnerPaymentsPage() {
  const { currentUser } = useAuth();
  const ownerId = currentUser?.id || '';

  // 1. Busca propriedades do dono para obter IDs de associação
  const { data: propertiesResponse, isLoading: loadingProperties } = useQuery({
    queryKey: ['properties', 'owner', ownerId],
    queryFn: () => propertyService.getOwnerProperties(ownerId),
    enabled: !!ownerId,
  });

  const ownedProperties = propertiesResponse|| [];
  const ownedPropertyIds = ownedProperties.map((p) => p.id);

  // 2. Carrega todos os quartos para resolver nomes relationalmente
  const { data: roomsResponse, isLoading: loadingRooms } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomService.getRooms(),
  });

  const allRooms = roomsResponse || [];

  // 3. Busca histórico de agendamentos
  const { data: bookingsResponse, isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings', 'owner', ownerId],
    queryFn: () => bookingService.getBookingHistory(),
  });

  const rawBookings = bookingsResponse?.data || [];

  // Filtra de forma atômica para isolar as transações financeiras de hotéis do parceiro
  const ownerBookings = rawBookings.filter((b) => ownedPropertyIds.includes(b.propertyId));

  const isLoading = loadingProperties || loadingRooms || loadingBookings;

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-secondary">Compiling financial ledger...</span>
      </div>
    );
  }

  // CÓDIGO DE DERIVAÇÃO FINANCEIRA (BACKEND GAP WORKAROUND)
  // Como não há rota de pagamentos agregada para donos, derivamos a tabela financeira de faturamentos 
  // diretamente do histórico de reservas ativas com status mapeados em tempo de execução de forma otimizada.
  const derivedPayments = ownerBookings.map((b) => {
    const matchedProperty = ownedProperties.find((p) => p.id === b.propertyId);
    const matchedRoom = allRooms.find((r) => r.roomId === b.roomId);

    // Derivação de status de pagamento baseado no estado da reserva
    let status: PaymentStatus = PaymentStatus.Pending;
    if (b.bookingStatus === BookingStatus.Confirmed || b.bookingStatus === BookingStatus.Complete) {
      status = PaymentStatus.Paid;
    } else if (b.bookingStatus === BookingStatus.Canceled) {
      status = PaymentStatus.Failed;
    }

    return {
      paymentId: `pay-${b.bookingId.substring(0, 8)}`,
      bookingId: b.bookingId,
      roomName: matchedRoom?.roomName || 'Accommodation loading...',
      propertyName: matchedProperty?.propertyname || 'Hotel loading...',
      amount: b.totalPrice,
      paymentType: 'Credit Card', // default simulado do backend
      status,
      date: b.createdAt,
    };
  });

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">Financial Ledger</h1>
        <p className="text-xs text-text-secondary">Audit and monitor incoming billing registries across your hotel portfolio.</p>
      </div>

      {derivedPayments.length === 0 ? (
        <div className="h-72 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 bg-surface/30 gap-4 text-center">
          <FolderOpen className="h-8 w-8 text-text-tertiary" />
          <h3 className="text-sm font-semibold">No financial records detected</h3>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-md overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-text-secondary uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Transaction ID</th>
                <th className="p-4 font-semibold">Sanctuary Details</th>
                <th className="p-4 font-semibold">Method</th>
                <th className="p-4 font-semibold">Total Revenue</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {derivedPayments.map((pay) => (
                <tr key={pay.paymentId} className="hover:bg-background/20 transition-colors">
                  <td className="p-4 font-mono font-medium text-accent uppercase">{pay.paymentId.toUpperCase()}</td>
                  <td className="p-4 space-y-0.5">
                    <span className="font-semibold text-text-primary block">{pay.propertyName}</span>
                    <span className="text-text-secondary text-[11px] block">{pay.roomName}</span>
                  </td>
                  <td className="p-4 text-text-secondary flex items-center gap-1.5 h-14">
                    <CreditCard className="h-3.5 w-3.5 text-text-tertiary" />
                    <span>{pay.paymentType}</span>
                  </td>
                  <td className="p-4 font-bold text-text-primary">R$ {pay.amount.toLocaleString('pt-BR')}</td>
                  <td className="p-4"><StatusBadge status={pay.status} type="payment" /></td>
                  <td className="p-4 text-text-secondary">{new Date(pay.date).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}