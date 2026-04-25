import { Sparkles, type LucideProps } from 'lucide-react';
import * as React from 'react';

export type KosmoIconProps = Omit<LucideProps, 'ref'>;

const KosmoIcon = React.forwardRef<SVGSVGElement, KosmoIconProps>(
  ({ size = 20, color = 'var(--ck-colors-kosmo-fg)', ...props }, ref) => (
    <Sparkles ref={ref} size={size} color={color} {...props} />
  )
);
KosmoIcon.displayName = 'KosmoIcon';

export { KosmoIcon };
