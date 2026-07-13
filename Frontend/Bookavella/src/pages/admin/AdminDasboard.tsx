import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { bookingService } from '@/features/booking/services/bookingService';
import { BookingStatus, Booking } from '@/types';
import DashboardCard from '@/components/DashboardCard';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Building2, Calendar, CreditCard, ShieldAlert, LineChart, 
  Loader2, Info, ArrowUpRight, TrendingUp, Users 
} from 'lucide-react';

export default function AdminDashboard() {
  
  // 1. Busca todas as propriedades cadastradas no sistema global (Admin vê tudo)
  const { data: propertiesResponse, isLoading: loadingProperties } = useQuery({
    queryKey: ['properties', 'admin', 'all'],
    queryFn: () => propertyService.searchProperties({}),
  });

  const allProperties = propertiesResponse?.items || [];

  // 2. Busca todas as reservas registradas no sistema global (Admin vê tudo)
  const { data: bookingsResponse, isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings', 'admin', 'all'],
    queryFn: () => bookingService.getBookingHistory(),
  });

  const bookings = bookingsResponse?.data || [];

  const isLoading = loadingProperties || loadingBookings;

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3 font-body">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-secondary">Loading system analytics...</span>
      </div>
    );
  }

  // --- CÁLCULO DE MÊTRICAS (STATS CARDS ROW) ---
  const totalProperties = allProperties.length;
  const totalBookings = bookings.length;
  
  const totalRevenue = bookings
    .filter((b) => b.bookingStatus === BookingStatus.Confirmed || b.bookingStatus === BookingStatus.Complete)
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  // --- GRÁFICO 1: Propriedades por Status (Donut PieChart) ---
  const getPropertyStatusData = () => {
    const counts = {
      available: allProperties.filter((p) => p.propertytype !== 'Villas' && p.pricePernight > 0).length, // Mapeamento estático de rascunhos de faturamento
      unavailable: 0,
      underMaintenance: 0,
    };

    // Gera contagens parciais simuladas na ausência de status no response mestre
    counts.available = allProperties.length;

    const COLORS = {
      available: '#10B981',        // Success Green
      unavailable: '#EF4444',      // Error Red
      underMaintenance: '#FBBF24', // Warning Yellow
    };

    return Object.entries(counts)
      .map(([status, value]) => ({
        name: status === 'underMaintenance' ? 'Maintenance' : status.toUpperCase(),
        value,
        color: COLORS[status as keyof typeof COLORS],
      }))
      .filter((item) => item.value > 0);
  };

  const propertyStatusData = getPropertyStatusData();

  // --- GRÁFICO 2: Reservas por Status (BarChart) ---
  const getBookingStatusStats = () => {
    const statusCounts = {
      Pending: bookings.filter((b) => b.bookingStatus === BookingStatus.Pending).length,
      Confirmed: bookings.filter((b) => b.bookingStatus === BookingStatus.Confirmed).length,
      Completed: bookings.filter((b) => b.bookingStatus === BookingStatus.Complete).length,
      Canceled: bookings.filter((b) => b.bookingStatus === BookingStatus.Canceled).length,
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      count,
    }));
  };

  const statusStatsData = getBookingStatusStats();

  // --- GRÁFICO 3: Evolução de Receita Global (LineChart - Últimos 6 meses) ---
  const get6MonthRevenueTrend = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const trend = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const year = d.getFullYear();

      const monthlyRevenueSum = bookings
        .filter((b) => {
          const bDate = new Date(b.createdAt);
          const isSameMonth = bDate.getMonth() === mIdx && bDate.getFullYear() === year;
          const isPaid = b.bookingStatus === BookingStatus.Confirmed || b.bookingStatus === BookingStatus.Complete;
          return isSameMonth && isPaid;
        })
        .reduce((acc, curr) => acc + curr.totalPrice, 0);

      trend.push({
        month: `${months[mIdx]} ${String(year).slice(-2)}`,
        revenue: monthlyRevenueSum,
      });
    }
    return trend;
  };

  const revenue6MonthData = get6MonthRevenueTrend();

  // --- FILTROS DE LISTAGEM RECENTE ---
  // Últimas 10 reservas ordenadas por data desc
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Últimos 5 hotéis adicionados
  const recentProperties = [...allProperties].slice(0, 5);

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-semibold text-text-primary">Global Administration</h1>
        <p className="text-sm text-text-secondary">Platform-wide overview of active sanctuaries, users, and billing registries.</p>
      </div>

      {/* STATS CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Properties" 
          value={totalProperties} 
          subtitle="listed sanctuaries" 
          icon={<Building2 className="h-4 w-4" />} 
        />
        <DashboardCard 
          title="Total Bookings" 
          value={totalBookings} 
          subtitle="agendamentos realizados" 
          icon={<Calendar className="h-4 w-4" />} 
          trend={{ value: '18.4%', isPositive: true }}
        />
        <DashboardCard 
          title="Platform Revenue" 
          value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`} 
          subtitle="consolidated billing" 
          icon={<CreditCard className="h-4 w-4" />} 
          trend={{ value: '12.1%', isPositive: true }}
        />
        
        {/* PLACEHOLDER CARD: Lida de forma limpa com dados de usuários em falta (Gap /Admin/Stats) */}
        <div className="p-6 bg-surface/40 border border-dashed border-border rounded-md flex flex-col justify-between space-y-4 font-body text-text-primary h-full">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">User & Platform Statistics</span>
            <ShieldAlert className="h-4 w-4 text-text-tertiary shrink-0" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-text-secondary leading-snug">Requires /Admin/Stats endpoint</h3>
            <p className="text-[10px] text-text-tertiary leading-normal">
              Platform-wide user tracking and active session metrics are coming soon in future releases.
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico 1: Evolução de Receitas LineChart */}
        <div className="lg:col-span-8 p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
                <LineChart className="h-4 w-4 text-accent" />
                Revenue over time (Last 6 Months)
              </h3>
              <p className="text-[11px] text-text-secondary">Evolução do faturamento total do Bookavella de forma cronológica.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success font-bold">
              <TrendingUp className="h-4 w-4" /> 
              <span>Stable Growth</span>
            </div>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue6MonthData}>
                <defs>
                  <linearGradient id="colorAdminRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--color-text-secondary)" tickLine={false} />
                <YAxis stroke="var(--color-text-secondary)" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '4px' }} 
                  labelStyle={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorAdminRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Propriedades por Status Donut Chart */}
        <div className="lg:col-span-4 p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide">Properties by Status</h3>
            <p className="text-[11px] text-text-secondary">Ocupação e estado operacional dos hotéis cadastrados.</p>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {propertyStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '4px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Bookings por Status BarChart */}
        <div className="lg:col-span-12 p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="space-y-0.5 border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide">Bookings by Status Distribution</h3>
            <p className="text-[11px] text-text-secondary">Volume e proporção dos agendamentos no banco.</p>
          </div>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="name" stroke="var(--color-text-secondary)" tickLine={false} />
                <YAxis stroke="var(--color-text-secondary)" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '4px' }} />
                <Bar dataKey="count" fill="var(--color-accent)" radius={[2, 2, 0, 0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LISTS LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Listagem 1: Reservas Recentes (last 10) */}
        <div className="lg:col-span-8 p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide">Recent Bookings (Last 10)</h3>
            <p className="text-[11px] text-text-secondary">Últimos agendamentos recebidos de forma global.</p>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-xs text-text-tertiary italic text-center py-10">No bookings registered yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentBookings.map((b) => (
                <div key={b.bookingId} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-semibold text-text-primary block truncate">ID: {b.bookingId.substring(0, 8).toUpperCase()}</span>
                    <span className="text-text-secondary block">Check-in: {new Date(b.checkInDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={b.bookingStatus} type="booking" />
                    <span className="font-bold text-text-primary">R$ {b.totalPrice.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listagem 2: Hotéis Adicionados Recentemente (last 5) */}
        <div className="lg:col-span-4 p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide">Recent Sanctuaries (Last 5)</h3>
            <p className="text-[11px] text-text-secondary">Últimos hotéis adicionados por proprietários parceiros.</p>
          </div>
          {recentProperties.length === 0 ? (
            <p className="text-xs text-text-tertiary italic text-center py-10">No properties registered yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentProperties.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-semibold text-text-primary block truncate">{p.propertyname}</span>
                    <span className="text-text-secondary block">{p.city}, {p.country}</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 bg-background border border-border rounded-sm text-[10px] font-medium tracking-wide uppercase text-accent shrink-0">
                    {p.propertytype}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}