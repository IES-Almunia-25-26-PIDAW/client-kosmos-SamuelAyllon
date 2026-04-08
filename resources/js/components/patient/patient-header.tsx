import { ArrowLeft, MoreVertical } from 'lucide-react';
import * as React from 'react';

export interface PatientHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  avatar?: string;
  badges?: Array<{
    label: string;
    variant: 'paid' | 'pending' | 'overdue' | 'noConsent' | 'openDeal';
  }>;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const PatientHeader = React.forwardRef<HTMLDivElement, PatientHeaderProps>(
  ({ className = '', name, avatar, badges, onBack, actions, ...props }, ref) => (
    <div
      ref={ref}
      className={`sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-border)] bg-[var(--color-card)] shadow-sm ${className}`}
      {...props}
    >
      <div className="h-16 px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="flex-shrink-0 p-1 hover:bg-[var(--color-muted)] rounded transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {avatar && (
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          )}

          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-[var(--color-foreground)] truncate">{name}</h1>
            {badges && badges.length > 0 && (
              <div className="flex gap-1 mt-1 overflow-x-auto">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      {
                        paid: 'bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]',
                        pending: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning-fg)]',
                        overdue: 'bg-[var(--color-error-subtle)] text-[var(--color-error-fg)]',
                        noConsent: 'bg-[var(--color-indigo-subtle)] text-[var(--color-indigo-fg)]',
                        openDeal: 'bg-[var(--color-orange-subtle)] text-[var(--color-orange-fg)]',
                      }[badge.variant] || ''
                    }`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  )
);
PatientHeader.displayName = 'PatientHeader';

export { PatientHeader };
