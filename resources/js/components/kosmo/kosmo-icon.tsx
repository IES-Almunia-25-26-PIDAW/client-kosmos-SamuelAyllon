import { Sparkles } from 'lucide-react';
import * as React from 'react';

export interface KosmoIconProps extends React.SVGProps<SVGSVGElement> {}

const KosmoIcon = React.forwardRef<SVGSVGElement, KosmoIconProps>(
  ({ className = 'w-5 h-5', ...props }, ref) => (
    <Sparkles ref={ref} className={`text-[var(--color-kosmo)] ${className}`} {...props} />
  )
);
KosmoIcon.displayName = 'KosmoIcon';

export { KosmoIcon };
