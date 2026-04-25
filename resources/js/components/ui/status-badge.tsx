import { Badge, Box } from '@chakra-ui/react';
import * as React from 'react';

type StatusType =
    | 'paid'
    | 'pending'
    | 'overdue'
    | 'noConsent'
    | 'openDeal'
    | 'claimed';

const statusConfig: Record<
    StatusType,
    { label: string; colorPalette: string }
> = {
    paid: { label: 'Cobrado', colorPalette: 'green' },
    pending: { label: 'Cobro pendiente', colorPalette: 'yellow' },
    overdue: { label: 'Pago vencido', colorPalette: 'red' },
    noConsent: { label: 'Sin consentimiento', colorPalette: 'purple' },
    openDeal: { label: 'Acuerdo abierto', colorPalette: 'orange' },
    claimed: { label: 'Reclamado', colorPalette: 'red' },
};

export interface StatusBadgeProps {
    status: StatusType;
    variant?: 'default' | 'subtle';
    showDot?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
    (
        {
            status,
            variant = 'default',
            showDot = true,
            children,
            ...props
        },
        ref,
    ) => {
        const config = statusConfig[status] ?? statusConfig.pending;
        const isSubtle = variant === 'subtle';

        return (
            <Badge
                ref={ref}
                data-slot="status-badge"
                colorPalette={config.colorPalette}
                variant="subtle"
                borderRadius="full"
                fontWeight="medium"
                display="inline-flex"
                alignItems="center"
                gap="1.5"
                px={isSubtle ? '2' : '3'}
                py={isSubtle ? '0.5' : '1.5'}
                fontSize={isSubtle ? 'xs' : 'sm'}
                {...props}
            >
                {showDot && (
                    <Box
                        w="1.5"
                        h="1.5"
                        borderRadius="full"
                        bg="colorPalette.solid"
                        flexShrink={0}
                    />
                )}
                {children ?? config.label}
            </Badge>
        );
    },
);
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
