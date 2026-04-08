import { X } from 'lucide-react';
import * as React from 'react';
import { KosmoIcon } from './kosmo-icon';

export interface KosmoNudgeProps extends React.HTMLAttributes<HTMLDivElement> {
  message: React.ReactNode;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const KosmoNudge = React.forwardRef<HTMLDivElement, KosmoNudgeProps>(
  ({ className = '', message, onDismiss, action, ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-kosmo-surface)] border border-[var(--color-kosmo-border)] text-sm text-[var(--color-text-secondary)] ${className}`}
      {...props}
    >
      <KosmoIcon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {action && (
        <button
          onClick={action.onClick}
          className="flex-shrink-0 ml-2 font-medium text-[var(--color-kosmo)] hover:underline"
        >
          {action.label}
        </button>
      )}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-0.5 hover:bg-[var(--color-kosmo-border)] rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
);
KosmoNudge.displayName = 'KosmoNudge';

export { KosmoNudge };
