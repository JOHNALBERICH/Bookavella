import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: string; // Ex: "12%"
    isPositive: boolean;
  };
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        'p-6 bg-surface border border-border rounded-md shadow-sm flex flex-col justify-between space-y-4 font-body text-text-primary',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{title}</span>
        {icon && <div className="text-accent shrink-0">{icon}</div>}
      </div>

      <div className="space-y-1">
        <h3 className="text-3xl font-heading font-bold text-text-primary leading-none">{value}</h3>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-text-secondary">
            {trend && (
              <span
                className={cn(
                  'flex items-center font-bold shrink-0',
                  trend.isPositive ? 'text-success' : 'text-error'
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                )}
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-text-tertiary truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}