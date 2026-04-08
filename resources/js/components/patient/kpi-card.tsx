import { LucideIcon } from 'lucide-react';
import * as React from 'react';

export interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  ({ className = '', label, value, icon: Icon, trend, description, ...props }, ref) => (
    <div
      ref={ref}
      className={`p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-[var(--color-text-muted)]" />}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-[var(--color-foreground)]">{value}</div>
        {trend && (
          <div className={`text-xs font-medium ${trend.isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
      )}
    </div>
  )
);
KPICard.displayName = 'KPICard';

export { KPICard };
