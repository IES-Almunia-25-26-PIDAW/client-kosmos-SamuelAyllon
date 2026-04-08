import React, { HTMLAttributes, ReactNode } from 'react';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KosmoBriefingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
    title?: string;
    content?: ReactNode;
    actions?: React.ReactNode;
    onDismiss?: () => void;
    isDismissible?: boolean;
}

export const KosmoBriefing = React.forwardRef<HTMLDivElement, KosmoBriefingProps>(
    ({ title, content, actions, onDismiss, isDismissible = !!onDismiss, className, ...divProps }, ref) => {
        const [dismissed, setDismissed] = React.useState(false);

        const handleDismiss = () => {
            setDismissed(true);
            onDismiss?.();
        };

        if (dismissed) return null;

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-[var(--radius-lg)] border border-[var(--color-kosmo-border)] bg-[var(--color-kosmo-surface)] p-4',
                    className
                )}
                {...divProps}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                        <Sparkles size={18} className="text-[var(--color-kosmo)] shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            {title && (
                                <h3 className="text-label text-[var(--color-text)] mb-1">
                                    {title}
                                </h3>
                            )}
                            {content && (
                                <div className="text-sm text-[var(--color-text-secondary)]">
                                    {content}
                                </div>
                            )}
                        </div>
                    </div>
                    {isDismissible && (
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-[var(--color-kosmo-border)] rounded-[var(--radius-sm)] transition-colors shrink-0"
                            aria-label="Descartar"
                        >
                            <X size={14} className="text-[var(--color-text-secondary)]" />
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
