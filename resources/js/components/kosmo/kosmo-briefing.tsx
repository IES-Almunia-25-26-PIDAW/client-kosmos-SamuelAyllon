import React, { HTMLAttributes, ReactNode } from 'react';
import { Sparkles, X } from 'lucide-react';

export interface KosmoBriefingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  title?: string;
  content?: ReactNode;
  actions?: React.ReactNode;
  onDismiss?: () => void;
  isDismissible?: boolean;
}

export const KosmoBriefing = React.forwardRef<HTMLDivElement, KosmoBriefingProps>(
  (
    {
      title,
      content,
      actions,
      onDismiss,
      isDismissible = false,
      className,
      ...divProps
    },
    ref
  ) => {
    const [dismissed, setDismissed] = React.useState(false);

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    if (dismissed) return null;

    return (
      <div
        ref={ref}
        className={`rounded-lg border border-kosmo-border bg-kosmo-surface p-4 ${className || ''}`}
        {...divProps}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Sparkles className="h-5 w-5 text-kosmo flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="font-satoshi font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {content && (
                <div className="mt-1 text-sm text-foreground">
                  {content}
                </div>
              )}
            </div>
          </div>
          {isDismissible && (
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-kosmo-border rounded transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {actions && (
          <div className="mt-3 flex gap-2">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

KosmoBriefing.displayName = 'KosmoBriefing';
