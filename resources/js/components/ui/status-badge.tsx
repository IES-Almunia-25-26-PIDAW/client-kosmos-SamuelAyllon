import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const statusBadgeVariants = cva('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors', {
  variants: {
    variant: {
      paid: 'bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]',
      pending: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning-fg)]',
      overdue: 'bg-[var(--color-error-subtle)] text-[var(--color-error-fg)]',
      noConsent: 'bg-[var(--color-indigo-subtle)] text-[var(--color-indigo-fg)]',
      openDeal: 'bg-[var(--color-orange-subtle)] text-[var(--color-orange-fg)]',
    },
  },
  defaultVariants: {
    variant: 'pending',
  },
});

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  dot?: boolean;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, children, dot = true, ...props }, ref) => {
    const variantColor = {
      paid: 'bg-[var(--color-success)]',
      pending: 'bg-[var(--color-warning)]',
      overdue: 'bg-[var(--color-error)]',
      noConsent: 'bg-[var(--color-indigo)]',
      openDeal: 'bg-[var(--color-orange)]',
    }[variant || 'pending'];

    return (
      <span ref={ref} className={statusBadgeVariants({ variant, className })} {...props}>
        {dot && <span className={`w-2 h-2 rounded-full ${variantColor}`} />}
        {children}
      </span>
    );
  }
);
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge, statusBadgeVariants };
