import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  total: number;
  page: number; // Página atual (iniciando em 1)
  pageSize: number;
  onChange: (page: number) => void;
}

export default function Pagination({ total, page, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  // Se houver apenas uma página de conteúdo, não há necessidade de renderizar o seletor
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 py-10 font-body text-text-primary">
      {/* Botão Retroceder */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-9 w-9 rounded-sm border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-accent/40 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Páginas Numéricas */}
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isSelected = page === pageNum;

          return (
            <button
              key={idx}
              onClick={() => onChange(pageNum)}
              className={cn(
                'h-9 w-9 rounded-sm border flex items-center justify-center transition-all cursor-pointer',
                isSelected
                  ? 'bg-accent border-accent text-background'
                  : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-accent/40'
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Botão Avançar */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-9 w-9 rounded-sm border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-accent/40 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}