import { LucideIcon } from 'lucide-react';
import * as React from 'react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className = '', icon: Icon, title, description, action, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`} {...props}>
      <div className="mb-4 p-3 rounded-lg bg-[var(--color-muted)]">
        <Icon className="w-10 h-10 text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-fg)] font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
