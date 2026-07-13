import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/features/booking/services/bookingService';
import { propertyService } from '@/features/property/services/propertyService';
import { BookingStatus, Booking } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Button } from '../../../@/components/ui/button';
import { 
  Loader2, BarChart3, Calendar, DollarSign, Percent, Download, Building2, AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

// ═══ TODO: RECOMENDAÇÃO DE ENDPOINTS DE BACKEND (BACKEND GAPS) ═══
//
// 1. POST /api/Admin/Reports/export-csv
//    - Permissão: Role "Admin" obrigatória
//    - Body: { startDate?, endDate?, reportType: "bookings" | "revenue" }
//    - Returns: File Stream (CSV / XLSX File)
//    - Comentário: O cálculo de dados volumétricos em tempo real e a conversão de arrays estruturados 
//      para planilhas de faturamento é altamente custosa. O ideal é que o motor do banco realize a 
//      geração do buffer e envie o arquivo binário direto para download no navegador do auditor.

export default function ReportsPage() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 1. Carrega todas as propriedades registradas (Admin vê todo o catálogo)
  const { data: propertiesResponse, isLoading: loadingProperties } = useQuery({
    queryKey: ['properties', 'admin', 'reports'],
    queryFn: () => propertyService.searchProperties({}),
  });

  const allProperties = propertiesResponse?.data || [];

  // 2. Carrega todas as reservas registradas (Admin vê todo o histórico)
  const { data: bookingsResponse, isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings', 'admin', 'reports'],
    queryFn: () => bookingService.getBookingHistory(),
  });

  const bookings = bookingsResponse?.data || [];

  const handleExportCSV = () => {
    // TODO: SYSTEM REPORT EXPORT CAPABILITY REQUIRED
    // O botão abaixo atua como espaço reservado. Na Fase 7, integraremos um gerador de planilhas locais.
    toast.info('CSV Generation is currently pending. Scheduled for Phase 7 optimization sprint.');
  };

  // --- CÁLCULO REATIVO DE RELATÓRIOS (CLIENT-SIDE) ---

  // Filtra as reservas baseando-se no intervalo de datas selecionado pelo Admin
  const filteredBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.createdAt);
    if (startDate && bookingDate < new Date(startDate)) return false;
    if (endDate && bookingDate > new Date(endDate)) return false;
    return true;
  });

  // --- REPORT 1: BOOKING SUMMARY ---
  const totalBookingsCount = filteredBookings.length;
  
  const confirmedAndCompletedBookings = filteredBookings.filter(
    (b) => b.bookingStatus === BookingStatus.Confirmed || b.bookingStatus === BookingStatus.Complete
  );

  const totalRevenue = confirmedAndCompletedBookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const averageBookingValue = confirmedAndCompletedBookings.length > 0 
    ? totalRevenue / confirmedAndCompletedBookings.length 
    : 0;

  // --- REPORT 2: PROPERTY PERFORMANCE (RANKING) ---
  const getPropertyPerformanceRanking = () => {
    const propertyCounts: Record<string, number> = {};
    filteredBookings.forEach((b) => {
      propertyCounts[b.propertyId] = (propertyCounts[b.propertyId] || 0) + 1;
    });

    return Object.entries(propertyCounts)
      .map(([propertyId, count]) => {
        const matchedProp = allProperties.find((p) => p.id === propertyId);
        return {
          id: propertyId,
          name: matchedProp ? matchedProp.propertyname : `Sanctuary ID: #${propertyId.substring(0,6).toUpperCase()}`,
          city: matchedProp ? matchedProp.city : 'N/A',
          bookingsCount: count,
        };
      })
      .sort((a, b) => b.bookingsCount - a.bookingsCount)
      .slice(0, 5); // Exibe o Top 5
  };

  const performanceRanking = getPropertyPerformanceRanking();

  // --- REPORT 3: CANCELLATION RATE ---
  const canceledBookingsCount = filteredBookings.filter(
    (b) => b.bookingStatus === BookingStatus.Canceled
  ).length;

  const cancellationRate = totalBookingsCount > 0 
    ? (canceledBookingsCount / totalBookingsCount) * 100 
    : 0;

  const isLoading = loadingProperties || loadingBookings;

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3 font-body">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-secondary">Generating audit reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-heading font-semibold">Analytical Reports</h1>
          <p className="text-xs text-text-secondary">Audit faturamento balances, reservation values, and cancellation proportions.</p>
        </div>
        <Button onClick={handleExportCSV} className="h-10 text-xs px-4 flex items-center gap-1.5 cursor-pointer">
          <Download className="h-4 w-4" /> Export CSV Report
        </Button>
      </div>

      {/* Date Range Filters Bar */}
      <div className="p-4 bg-surface border border-border rounded-md shadow-sm flex flex-col sm:flex-row sm:items-end gap-4 max-w-2xl">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
            className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-error" 
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)} 
            className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-error" 
          />
        </div>
        {(startDate || endDate) && (
          <Button 
            variant="ghost" 
            onClick={() => { setStartDate(''); setEndDate(''); }} 
            className="h-10 text-xs hover:text-error"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* REPORT 1: BOOKING & REVENUE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-surface border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent" /> Total Bookings
            </CardDescription>
            <CardTitle className="text-2xl font-body font-bold mt-1">{totalBookingsCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-text-tertiary">Agendamentos criados no intervalo de datas selecionado.</p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-accent" /> Total Billing
            </CardDescription>
            <CardTitle className="text-2xl font-body font-bold mt-1">R$ {totalRevenue.toLocaleString('pt-BR')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-text-tertiary">Soma de faturamentos confirmados ou concluídos no período.</p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-accent" /> Average Ticket Value
            </CardDescription>
            <CardTitle className="text-2xl font-body font-bold mt-1">R$ {averageBookingValue.toLocaleString('pt-BR')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-text-tertiary">Média de gasto financeiro por transação de reserva bem-sucedida.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* REPORT 2: PROPERTY PERFORMANCE RANKING (TOP 5) */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Building2 className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-semibold tracking-wide">Property Performance Ranking (Top 5)</h3>
          </div>

          {performanceRanking.length === 0 ? (
            <div className="h-40 border border-dashed border-border rounded-md flex items-center justify-center text-xs text-text-tertiary italic">
              No performance data to display for this selected period.
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-md overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-background/50 border-b border-border text-text-secondary uppercase tracking-wider text-[9px]">
                    <th className="p-4 font-semibold">Rank</th>
                    <th className="p-4 font-semibold">Sanctuary Name</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold text-right">Agendamentos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {performanceRanking.map((rank, index) => (
                    <tr key={rank.id} className="hover:bg-background/20 transition-colors">
                      <td className="p-4 font-bold text-accent">#{index + 1}</td>
                      <td className="p-4 font-medium text-text-primary">{rank.name}</td>
                      <td className="p-4 text-text-secondary">{rank.city}</td>
                      <td className="p-4 font-bold text-right text-text-primary">{rank.bookingsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* REPORT 3: CANCELLATION RATE CARD */}
        <div className="md:col-span-4">
          <Card className="bg-surface border-border">
            <CardHeader className="border-b border-border pb-4 mb-4">
              <CardDescription className="text-[10px] uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-error animate-pulse" /> Cancellation Rate
              </CardDescription>
              <CardTitle className="text-3xl font-body font-bold text-error mt-2">
                {cancellationRate.toFixed(1)}%
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-text-secondary leading-relaxed font-body">
              <p>
                Este índice representa a proporção de reservas canceladas em relação ao total bruto de agendamentos efetuados dentro do período selecionado.
              </p>
              
              <div className="border border-border p-3 rounded-sm bg-background/50 flex justify-between">
                <span>Canceled Bookings:</span>
                <span className="font-bold text-error">{canceledBookingsCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}