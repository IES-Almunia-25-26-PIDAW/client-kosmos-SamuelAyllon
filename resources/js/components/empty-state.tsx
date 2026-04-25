import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

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
    ({ icon: Icon, title, description, action, ...props }, ref) => (
        <Flex
            ref={ref}
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            py="12"
            px="4"
            {...props}
        >
            <Box mb="4" p="3" rounded="lg" bg="bg.muted">
                <Icon size={40} color="var(--ck-colors-fg-subtle)" />
            </Box>
            <Heading as="h3" size="md" mb="2" color="fg">
                {title}
            </Heading>
            {description && (
                <Text fontSize="sm" color="fg.muted" mb="6" maxW="sm">
                    {description}
                </Text>
            )}
            {action && (
                <Button type="button" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </Flex>
    ),
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
