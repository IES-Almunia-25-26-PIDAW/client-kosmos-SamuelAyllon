import { LucideIcon } from 'lucide-react';
import * as React from 'react';

export interface BottomBarItem {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BottomBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BottomBarItem[];
  onItemClick?: (key: string, item: BottomBarItem) => void;
}

const BottomBar = React.forwardRef<HTMLDivElement, BottomBarProps>(
  ({ className = '', items, onItemClick, ...props }, ref) => (
    <div
      ref={ref}
      className={`fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_-2px_8px_rgba(0,0,0,0.08)] ${className}`}
      {...props}
    >
      <nav className="flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <Icon className={`w-6 h-6 ${item.active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`} />
              <span className={`text-xs font-medium mt-0.5 ${item.active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                {item.label}
              </span>
            </>
          );

          return (
            <button
              key={item.key}
              onClick={() => {
                item.onClick?.();
                onItemClick?.(item.key, item);
              }}
              className={`flex flex-col items-center justify-center h-full px-3 transition-colors ${
                item.active
                  ? 'border-t-2 border-[var(--color-primary)]'
                  : 'hover:bg-[var(--color-muted)]'
              }`}
            >
              {content}
            </button>
          );
        })}
      </nav>
    </div>
  )
);
BottomBar.displayName = 'BottomBar';

export { BottomBar };
