import * as React from 'react';
import { KosmoIcon } from './kosmo-icon';

export interface KosmoChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const KosmoChip = React.forwardRef<HTMLSpanElement, KosmoChipProps>(
  ({ className = '', children, ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-kosmo-surface)] text-[var(--color-kosmo)] text-xs font-medium border border-[var(--color-kosmo-border)] ${className}`}
      {...props}
    >
      <KosmoIcon className="w-3.5 h-3.5" />
      {children}
    </span>
  )
);
KosmoChip.displayName = 'KosmoChip';

export { KosmoChip };
