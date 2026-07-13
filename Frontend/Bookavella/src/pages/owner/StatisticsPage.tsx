import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/features/booking/services/bookingService';
import { propertyService } from '@/features/property/services/propertyService';
import { roomService } from '@/features/room/services/roomService';
import { BookingStatus, Booking, Room } from '@/types';
import RatingStars from '@/components/RatingStars';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  LineChart as LineIcon, PieChart as PieIcon, BarChart3, TrendingUp, 
  Percent, Loader2, AlertCircle 
} from 'lucide-react';

export default function StatisticsPage() {
  const { currentUser } = useAuth();
  const ownerId = currentUser?.id || '';

  // 1. Carrega as propriedades do proprietário logado
  const { data: propertiesResponse, isLoading: loadingProperties } = useQuery({
    queryKey: ['properties', 'owner', ownerId],
    queryFn: () => propertyService.getOwnerProperties(ownerId),
    enabled: !!ownerId,
  });

  const ownedProperties = propertiesResponse ?? [];
  const ownedPropertyIds = ownedProperties.map((p) => p.id);

  // 2. Carrega todos os quartos para resolver ocupações e nomes
  const { data: roomsResponse, isLoading: loadingRooms } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomService.getRooms(),
  });

  const allRooms = roomsResponse?? [];
  const ownerRooms = allRooms.filter((r) => ownedPropertyIds.includes(r.propertyId));

  // 3. Carrega o histórico completo de reservas do proprietário
  const { data: bookingsResponse, isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings', 'owner', ownerId],
    queryFn: () => bookingService.getBookingHistory(),
  });

  const bookings = bookingsResponse?.data || [];
  const ownerBookings = bookings.filter((b) => ownedPropertyIds.includes(b.propertyId));

  const isLoading = loadingProperties || loadingRooms || loadingBookings;

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-secondary">Computing statistical models...</span>
      </div>
    );
  }

  // ═══ METODOLOGIAS DE CÁLCULO E AGREGAÇÕES SÍNCRONAS (CLIENT-SIDE) ═══

  // TODO: BACKEND ARCHITECTURE RECOMMENDATION
  // Recomenda-se a criação de um endpoint dedicado de agregação no backend (ex: GET /Properties/Statistics ou GET /Owner/Reports).
  // Realizar cálculos estatísticos complexos no cliente (como agrupamento cronológico de 12 meses, contagens de quartos ocupados
  // e ordenações de arrays densos) consome CPU excessiva em portfólios robustos de parceiros e gera tráfego de banda desnecessário.
  // O ideal é que o banco de dados entregue os vetores de faturamento agregados prontos para renderização.

  // 1. Ganhos Mensais (Últimos 12 meses cronológicos - AreaChart)
  const get12MonthRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const trend = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();

      const monthlyRevenue = ownerBookings
        .filter((b) => {
          const bDate = new Date(b.createdAt);
          const isSameMonth = bDate.getMonth() === monthIdx && bDate.getFullYear() === year;
          const isPaid = b.bookingStatus === BookingStatus.Confirmed || b.bookingStatus === BookingStatus.Complete;
          return isSameMonth && isPaid;
        })
        .reduce((acc, curr) => acc + curr.totalPrice, 0);

      trend.push({
        name: `${months[monthIdx]} ${String(year).slice(-2)}`,
        revenue: monthlyRevenue,
      });
    }
    return trend;
  };

  const revenue12MonthData = get12MonthRevenueData();

  // 2. Proporção de Status de Reservas (PieChart com Cores Semânticas)
  const getStatusPieData = () => {
    const counts = {
      pending: ownerBookings.filter((b) => b.bookingStatus === BookingStatus.Pending).length,
      confirmed: ownerBookings.filter((b) => b.bookingStatus === BookingStatus.Confirmed).length,
      canceled: ownerBookings.filter((b) => b.bookingStatus === BookingStatus.Canceled).length,
      complete: ownerBookings.filter((b) => b.bookingStatus === BookingStatus.Complete).length,
    };

    const COLORS = {
      pending: '#FBBF24',   // Warning (Yellow)
      confirmed: '#10B981', // Success (Green)
      canceled: '#EF4444',  // Error (Red)
      complete: '#8B5CF6',  // Info/Purple (Complete)
    };

    return Object.entries(counts)
      .map(([status, value]) => ({
        name: status.toUpperCase(),
        value,
        color: COLORS[status as keyof typeof COLORS],
      }))
      .filter((item) => item.value > 0);
  };

  const statusPieData = getStatusPieData();

  // 3. Top 5 Acomodações mais Reservadas (BarChart)
  const getTopRoomsData = () => {
    const counts: Record<string, number> = {};
    ownerBookings.forEach((b) => {
      counts[b.roomId] = (counts[b.roomId] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([roomId, count]) => {
        const matchedRoom = ownerRooms.find((r) => r.roomId === roomId);
        return {
          name: matchedRoom ? matchedRoom.roomName : `Room #${roomId.substring(0, 4).toUpperCase()}`,
          bookings: count,
        };
      })
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  };

  const topRoomsData = getTopRoomsData();

  // 4. Taxa de Ocupação por Propriedade (BarChart)
  // Ocupação = (Quartos com status 'Booked' / total de quartos daquela propriedade) * 100
  const getOccupancyRateData = () => {
    return ownedProperties.map((prop) => {
      const propRooms = ownerRooms.filter((r) => r.propertyId === prop.id);
      const totalRooms = propRooms.length;
      const bookedRooms = propRooms.filter((r) => r.roomStatus === 'Booked').length;

      const rate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

      return {
        name: prop.propertyname,
        rate,
      };
    });
  };

  const occupancyRateData = getOccupancyRateData();

  return (
    <div className="space-y-8 pb-20 text-text-primary font-body">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">Analytical Statistics</h1>
        <p className="text-xs text-text-secondary">Track long-term financial charts and sanctuary occupancy models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHARTS 1: 12-Month Revenue AreaChart */}
        <div className="lg:col-span-12 p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <LineIcon className="h-4 w-4 text-accent" />
              Annual Revenue Curve (12 Months)
            </h3>
            <p className="text-[11px] text-text-secondary">Evolução de faturamentos confirmados nos últimos 12 meses calendários.</p>
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue12MonthData}>
                <defs>
                  <linearGradient id="color12Month" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="name" stroke="var(--color-text-secondary)" tickLine={false} />
                <YAxis stroke="var(--color-text-secondary)" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '4px' }} 
                  labelStyle={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#color12Month)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHARTS 2: Status Breakdown PieChart */}
        <div className="lg:col-span-4 p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <PieIcon className="h-4 w-4 text-accent" />
              Status Proportion
            </h3>
            <p className="text-[11px] text-text-secondary">Distribuição percentual do histórico total de agendamentos.</p>
          </div>
          {statusPieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-text-tertiary italic">No active bookings to show.</div>
          ) : (
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '4px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* CHARTS 3: Top Rooms BarChart */}
        <div className="lg:col-span-4 p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-accent" />
              Top 5 Accommodations
            </h3>
            <p className="text-[11px] text-text-secondary">Quartos que obtiveram maior volume de reservas agregadas.</p>
          </div>
          {topRoomsData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-text-tertiary italic">No active bookings recorded.</div>
          ) : (
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRoomsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                  <XAxis type="number" stroke="var(--color-text-secondary)" tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-text-secondary)" tickLine={false} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '4px' }} />
                  <Bar dataKey="bookings" fill="var(--color-accent)" radius={[0, 2, 2, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* CHARTS 4: Occupancy Rate per Property BarChart */}
        <div className="lg:col-span-4 p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-accent" />
              Occupancy Rates (%)
            </h3>
            <p className="text-[11px] text-text-secondary">Porcentagem de quartos ocupados por hotel na data selecionada.</p>
          </div>
          {occupancyRateData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-text-tertiary italic">No properties registered.</div>
          ) : (
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                  <XAxis dataKey="name" stroke="var(--color-text-secondary)" tickLine={false} />
                  <YAxis stroke="var(--color-text-secondary)" tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '4px' }} />
                  <Bar dataKey="rate" fill="var(--color-accent)" radius={[2, 2, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}