import * as React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'paid' | 'pending' | 'overdue' | 'noConsent' | 'openDeal' | 'claimed';

const statusConfig: Record<StatusType, { label: string; bg: string; text: string; dot: string }> = {
    paid:      { label: 'Cobrado',          bg: 'bg-[var(--color-success-subtle)]',  text: 'text-[var(--color-success-fg)]',  dot: 'bg-[var(--color-success)]' },
    pending:   { label: 'Cobro pendiente',  bg: 'bg-[var(--color-warning-subtle)]',  text: 'text-[var(--color-warning-fg)]',  dot: 'bg-[var(--color-warning)]' },
    overdue:   { label: 'Pago vencido',     bg: 'bg-[var(--color-error-subtle)]',    text: 'text-[var(--color-error-fg)]',    dot: 'bg-[var(--color-error)]' },
    noConsent: { label: 'Sin consentimiento', bg: 'bg-[var(--color-indigo-subtle)]', text: 'text-[var(--color-indigo-fg)]',   dot: 'bg-[var(--color-indigo)]' },
    openDeal:  { label: 'Acuerdo abierto',  bg: 'bg-[var(--color-orange-subtle)]',   text: 'text-[var(--color-orange-fg)]',   dot: 'bg-[var(--color-orange)]' },
    claimed:   { label: 'Reclamado',        bg: 'bg-[var(--color-error-subtle)]',    text: 'text-[var(--color-error-fg)]',    dot: 'bg-[var(--color-error)]' },
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: StatusType;
    variant?: 'default' | 'subtle';
    showDot?: boolean;
    children?: React.ReactNode;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
    ({ className, status, variant = 'default', showDot = true, children, ...props }, ref) => {
        const config = statusConfig[status] ?? statusConfig.pending;

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
                    variant === 'subtle' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm',
                    config.bg,
                    config.text,
                    className
                )}
                {...props}
            >
                {showDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />}
                {children ?? config.label}
            </span>
        );
    }
);
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
