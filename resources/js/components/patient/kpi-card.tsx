import { Box, Flex, Text, type BoxProps } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

export interface KPICardProps extends Omit<BoxProps, 'title'> {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
}

const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
    ({ label, value, icon: Icon, trend, description, ...boxProps }, ref) => (
        <Box
            ref={ref}
            p="4"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border"
            bg="card"
            {...boxProps}
        >
            <Flex align="center" justify="space-between" mb="2">
                <Text
                    fontSize="xs"
                    fontWeight="medium"
                    color="fg.muted"
                    textTransform="uppercase"
                    letterSpacing="wider"
                >
                    {label}
                </Text>
                {Icon && <Icon size={16} color="var(--ck-colors-fg-subtle)" />}
            </Flex>

            <Box mb="2">
                <Text fontSize="2xl" fontWeight="bold" color="fg">
                    {value}
                </Text>
                {trend && (
                    <Text
                        fontSize="xs"
                        fontWeight="medium"
                        color={trend.isPositive ? 'success.fg' : 'danger.fg'}
                    >
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </Text>
                )}
            </Box>

            {description && (
                <Text fontSize="xs" color="fg.muted">
                    {description}
                </Text>
            )}
        </Box>
    ),
);
KPICard.displayName = 'KPICard';

export { KPICard };
