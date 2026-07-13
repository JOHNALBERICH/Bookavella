import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'h-96 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 bg-surface/30 gap-4 text-center font-body text-text-primary animate-in fade-in duration-normal',
        className
      )}
    >
      {/* Círculo do Ícone com Destaque Dourado */}
      <div className="h-12 w-12 rounded-full bg-border/40 flex items-center justify-center text-text-secondary shrink-0">
        <Icon className="h-6 w-6 text-accent" />
      </div>

      {/* Título e Descrição */}
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
      </div>

      {/* Botão de Ação Opcional */}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}