import { Box, Flex, Text, chakra, type BoxProps } from '@chakra-ui/react';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

export interface BottomBarItem {
    key: string;
    label: string;
    icon: LucideIcon;
    href?: string;
    onClick?: () => void;
    active?: boolean;
}

export interface BottomBarProps extends BoxProps {
    items: BottomBarItem[];
    onItemClick?: (key: string, item: BottomBarItem) => void;
}

const BottomBar = React.forwardRef<HTMLDivElement, BottomBarProps>(({ items, onItemClick, ...boxProps }, ref) => (
    <Box
        ref={ref}
        as="div"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex="sticky"
        display={{ base: 'block', md: 'none' }}
        bg="bg.surface"
        borderTopWidth="1px"
        borderColor="border.DEFAULT"
        boxShadow="sm"
        {...boxProps}
    >
        <Flex as="nav" alignItems="center" justifyContent="space-around" h="16">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <chakra.button
                        key={item.key}
                        type="button"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        h="full"
                        px="3"
                        borderTopWidth={item.active ? '2px' : '0'}
                        borderTopColor="brand.solid"
                        color={item.active ? 'brand.solid' : 'fg.subtle'}
                        _hover={item.active ? undefined : { bg: 'bg.muted' }}
                        css={{ transition: 'background-color var(--duration-normal) var(--ease-standard)' }}
                        onClick={() => {
                            item.onClick?.();
                            onItemClick?.(item.key, item);
                        }}
                    >
                        <Icon size={24} />
                        <Text fontSize="xs" fontWeight="medium" mt="0.5">
                            {item.label}
                        </Text>
                    </chakra.button>
                );
            })}
        </Flex>
    </Box>
));
BottomBar.displayName = 'BottomBar';

export { BottomBar };
