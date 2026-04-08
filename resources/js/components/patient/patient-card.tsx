import React, { HTMLAttributes } from 'react';
import { StatusBadge } from '@/components/ui/status-badge';

export interface PatientCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: string | number;
  name: string;
  description?: string;
  avatar?: string;
  status?: 'paid' | 'pending' | 'overdue' | 'noConsent' | 'openDeal';
  statusLabel?: string;
  metrics?: Array<{
    label: string;
    value: string | number;
  }>;
  actions?: React.ReactNode;
}

export const PatientCard = React.forwardRef<HTMLDivElement, PatientCardProps>(
  (
    {
      id,
      name,
      description,
      avatar,
      status,
      statusLabel,
      metrics,
      actions,
      className,
      ...divProps
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        id={String(id)}
        className={`rounded-lg border border-border bg-card p-4 ${className || ''}`}
        {...divProps}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {avatar && (
              <img
                src={avatar}
                alt={name}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-satoshi font-semibold text-foreground truncate">
                {name}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground truncate">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions}
        </div>

        {status && statusLabel && (
          <div className="mt-3">
            <StatusBadge>{statusLabel}</StatusBadge>
          </div>
        )}

        {metrics && metrics.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-border">
            {metrics.map((metric, idx) => (
              <div key={idx} className="text-center">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="font-semibold text-foreground">{metric.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

PatientCard.displayName = 'PatientCard';
