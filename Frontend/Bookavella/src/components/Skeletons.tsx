import { Skeleton } from "../../@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ═══ 1. PROPERTY CARD SKELETON ═══
export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col bg-surface border border-border rounded-lg overflow-hidden shadow-sm h-full">
      {/* Imagem Placeholder (16/9) */}
      <Skeleton className="aspect-video w-full rounded-none" />
      
      {/* Detalhes Placeholder */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-12 shrink-0" />
          </div>
          <Skeleton className="h-4 w-1/3" />
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

// ═══ 2. ROOM CARD SKELETON ═══
export function RoomCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Imagem Placeholder */}
      <Skeleton className="w-full md:w-72 aspect-video md:aspect-auto rounded-none shrink-0" />

      {/* Detalhes Placeholder */}
      <div className="flex-1 p-6 flex flex-col justify-between gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}

// ═══ 3. REVIEW CARD SKELETON ═══
export function ReviewCardSkeleton() {
  return (
    <div className="p-6 bg-surface border border-border rounded-lg space-y-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar circular */}
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

// ═══ 4. BOOKING CARD SKELETON ═══
export function BookingCardSkeleton() {
  return (
    <div className="p-6 bg-surface border border-border rounded-lg space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      <Skeleton className="h-[1px] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

// ═══ 5. DASHBOARD CARD SKELETON ═══
export function DashboardCardSkeleton() {
  return (
    <div className="p-6 bg-surface border border-border rounded-md shadow-sm flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// ═══ 6. DATATABLE SKELETON (Linhas configuráveis) ═══
interface DataTableSkeletonProps {
  rows?: number;
}

export function DataTableSkeleton({ rows = 5 }: DataTableSkeletonProps) {
  return (
    <div className="bg-surface border border-border rounded-md shadow-sm overflow-hidden">
      {/* Cabeçalho da Tabela */}
      <div className="border-b border-border bg-background/50 h-10 px-4 flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      {/* Linhas */}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-14 px-4 flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ 7. PROPERTY DETAIL SKELETON (Tela cheia) ═══
export function PropertyDetailSkeleton() {
  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto px-4 py-8 animate-pulse">
      {/* Imagem principal */}
      <Skeleton className="aspect-video w-full rounded-lg" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-3 flex-1">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-9 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-10 w-28 shrink-0" />
      </div>

      {/* Detalhes adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="md:col-span-4 space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}