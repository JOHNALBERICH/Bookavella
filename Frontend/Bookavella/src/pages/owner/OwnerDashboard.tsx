import { useQuery, useQueries } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { propertyService } from '@/features/property/services/propertyService';
import { bookingService } from '@/features/booking/services/bookingService';
import { reviewService } from '@/features/review/services/reviewService';
import { BookingStatus, Booking, Review, PropertySearchResponse } from '@/types';
import DashboardCard from '@/components/DashboardCard';
import RatingStars from '@/components/RatingStars';
import { ErrorBoundary } from '@/components/ErrorBoundary'; // Injeção do ErrorBoundary
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart 
} from 'recharts';
import { 
  Building2, Calendar, CreditCard, MessageSquare, Loader2, TrendingUp, LineChart as LineIcon 
} from 'lucide-react';

// ═══ COMPONENTES GRÁFICOS ISOLADOS PARA CAPTURA DO ERRORBOUNDARY ═══

interface RevenueAreaChartProps {
  data: Array<{ month: string; revenue: number }>;
}

function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm h-full">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
            <LineIcon className="h-4 w-4 text-accent" />
            Revenue Trend
          </h3>
          <p className="text-[11px] text-text-secondary">Performance de ganhos das propriedades nos últimos 6 meses.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-success font-bold">
          <TrendingUp className="h-4 w-4" /> <span>Stable Growth</span>
        </div>
      </div>
      <div className="h-72 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
            <XAxis dataKey="month" stroke="var(--color-text-secondary)" tickLine={false} />
            <YAxis stroke="var(--color-text-secondary)" tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '4px' }} 
              labelStyle={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface BookingBarChartProps {
  data: Array<{ name: string; count: number }>;
}

function BookingBarChart({ data }: BookingBarChartProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm h-full">
      <div className="space-y-0.5 border-b border-border pb-4">
        <h3 className="text-sm font-semibold tracking-wide">Agendamentos por Status</h3>
        <p className="text-[11px] text-text-secondary">Distribuição do volume atual de reservas.</p>
      </div>
      <div className="h-72 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis dataKey="name" stroke="var(--color-text-secondary)" tickLine={false} />
            <YAxis stroke="var(--color-text-secondary)" tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '4px' }} 
            />
            <Bar dataKey="count" fill="var(--color-accent)" radius={[2, 2, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ═══ COMPONENTE DO DASHBOARD PRINCIPAL ═══

export default function OwnerDashboard() {
  const { currentUser } = useAuth();
  const ownerId = currentUser?.id || '';

  const { data: propertiesResponse, isLoading: loadingProperties } = useQuery({
    queryKey: ['properties', 'owner', ownerId],
    queryFn: () => propertyService.searchProperties({}),
  });

  const rawProperties = propertiesResponse?.items || [];
  const propertyIds  = rawProperties.filter((p) => p.ownername === currentUser?.name).map((p: PropertySearchResponse) => p.id);

  const { data: bookingsResponse, isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings', 'owner', ownerId],
    queryFn: () => bookingService.getBookingHistory(),
  });

  const bookings = bookingsResponse?.data || [];

  const reviewsQueries = useQueries({
    queries: propertyIds.map((pId) => ({
      queryKey: ['reviews', pId],
      queryFn: () => reviewService.getReviews(pId),
    })),
  });

  const reviews = reviewsQueries
    .flatMap((q) => q.data?.data ?? [])
    .sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );
  const isLoading = loadingProperties || loadingBookings;

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-secondary">Loading your workspace...</span>
      </div>
    );
  }

  const totalProperties = propertyIds.length;
  
  const activeBookings = bookings.filter(
    (b) => b.bookingStatus === BookingStatus.Confirmed
  ).length;

  const totalRevenue = bookings
    .filter((b) => b.bookingStatus === BookingStatus.Confirmed || b.bookingStatus === BookingStatus.Complete)
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const pendingBookings = bookings.filter(
    (b) => b.bookingStatus === BookingStatus.Pending
  ).length;

  const getMonthlyRevenueTrend = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const trend = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = targetDate.getMonth();
      const year = targetDate.getFullYear();

      const monthlyRevenueSum = bookings
        .filter((b) => {
          const bDate = new Date(b.createdAt);
          const isSameMonth = bDate.getMonth() === mIdx && bDate.getFullYear() === year;
          const isValidTransaction = b.bookingStatus === BookingStatus.Confirmed || b.bookingStatus === BookingStatus.Complete;
          return isSameMonth && isValidTransaction;
        })
        .reduce((acc, curr) => acc + curr.totalPrice, 0);

      trend.push({
        month: `${months[mIdx]} ${String(year).slice(-2)}`,
        revenue: monthlyRevenueSum,
      });
    }
    return trend;
  };

  const revenueTrendData = getMonthlyRevenueTrend();

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

  const getUpcomingCheckIns = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const limit = new Date(now.getTime() + 7 * 24 * 3600 * 1000);

    return bookings
      .filter((b) => {
        const cIn = new Date(b.checkInDate);
        return cIn >= now && cIn <= limit && b.bookingStatus === BookingStatus.Confirmed;
      })
      .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime())
      .slice(0, 5);
  };

  const upcomingCheckIns = getUpcomingCheckIns();
  const recentReviews = reviews.slice(0, 5);

  return (
    <div className="space-y-10 text-text-primary font-body pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-semibold text-text-primary">Dashboard Workspace</h1>
        <p className="text-sm text-text-secondary">Explore revenues, check-in timelines, and customer satisfaction metrics.</p>
      </div>

      {/* ROW 1 — STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Properties" 
          value={totalProperties} 
          subtitle="portfolio locations" 
          icon={<Building2 className="h-4 w-4" />} 
        />
        <DashboardCard 
          title="Active Bookings" 
          value={activeBookings} 
          subtitle="currently checking in" 
          icon={<Calendar className="h-4 w-4" />} 
          trend={{ value: '14%', isPositive: true }}
        />
        <DashboardCard 
          title="Total Revenue" 
          value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`} 
          subtitle="accumulated faturamento" 
          icon={<CreditCard className="h-4 w-4" />} 
          trend={{ value: '8.2%', isPositive: true }}
        />
        <DashboardCard 
          title="Pending Bookings" 
          value={pendingBookings} 
          subtitle="awaiting manual approval" 
          icon={<MessageSquare className="h-4 w-4" />} 
        />
      </div>

      {/* ROW 2 — RECHARTS ANALYTICS PROTEGIDOS POR ERRORBOUNDARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Isolamento do Gráfico de Área (Linha) */}
        <div className="lg:col-span-8">
          <ErrorBoundary fallback={<div className="p-6 bg-surface border border-border rounded-md text-xs text-text-secondary h-full flex items-center justify-center">Failed to render revenue trend chart.</div>}>
            <RevenueAreaChart data={revenueTrendData} />
          </ErrorBoundary>
        </div>

        {/* Isolamento do Gráfico de Barras */}
        <div className="lg:col-span-4">
          <ErrorBoundary fallback={<div className="p-6 bg-surface border border-border rounded-md text-xs text-text-secondary h-full flex items-center justify-center">Failed to render booking status chart.</div>}>
            <BookingBarChart data={statusStatsData} />
          </ErrorBoundary>
        </div>
      </div>

      {/* ROW 3 — LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide">Upcoming Check-ins (Next 7 Days)</h3>
            <p className="text-[11px] text-text-secondary">Agendamentos com chegada iminente.</p>
          </div>
          {upcomingCheckIns.length === 0 ? (
            <p className="text-xs text-text-tertiary italic text-center py-10">No upcoming check-ins scheduled for the next 7 days.</p>
          ) : (
            <div className="divide-y divide-border">
              {upcomingCheckIns.map((item) => (
                <div key={item.bookingId} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-semibold text-text-primary block truncate">Booking ID: {item.bookingId.substring(0, 8).toUpperCase()}</span>
                    <span className="text-text-secondary block">Check-in: {new Date(item.checkInDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className="font-bold text-accent shrink-0">R$ {item.totalPrice.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-surface border border-border rounded-md space-y-4 shadow-sm">
          <div className="border-b border-border pb-4">
            <h3 className="text-sm font-semibold tracking-wide">Recent Feedbacks</h3>
            <p className="text-[11px] text-text-secondary">Depoimentos deixados recentemente nos hotéis do seu portfólio.</p>
          </div>
          {recentReviews.length === 0 ? (
            <p className="text-xs text-text-tertiary italic text-center py-10">No feedbacks received yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentReviews.map((rev) => (
                <div key={rev.reviewId} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-xs italic text-text-secondary block">"{rev.comment}"</span>
                    <span className="text-[10px] text-text-tertiary block">{new Date(rev.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <RatingStars rating={rev.rating} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}