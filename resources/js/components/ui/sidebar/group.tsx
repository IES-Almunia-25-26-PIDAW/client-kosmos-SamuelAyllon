import { chakra, type HTMLChakraProps } from '@chakra-ui/react';
import * as React from 'react';
import { ChakraSlot } from './context';

export function SidebarGroup({ ...props }: HTMLChakraProps<'div'>) {
    return (
        <chakra.div
            data-slot="sidebar-group"
            data-sidebar="group"
            position="relative"
            display="flex"
            w="full"
            minW="0"
            flexDirection="column"
            px="2"
            css={{
                transition: 'padding 200ms linear',
                '[data-collapsible=icon] &': { paddingInline: '0' },
            }}
            {...props}
        />
    );
}

export function SidebarGroupLabel({
    asChild = false,
    ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
    const Comp = asChild ? ChakraSlot : chakra.div;

    return (
        <Comp
            data-slot="sidebar-group-label"
            data-sidebar="group-label"
            display="flex"
            h="6"
            flexShrink={0}
            alignItems="center"
            borderRadius="md"
            px="2"
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="wider"
            textTransform="uppercase"
            outline="none"
            opacity={0.5}
            color="sidebar.fg"
            css={{
                transition: 'margin opacity 200ms linear',
                outlineColor: 'var(--ck-colors-sidebar-ring)',
                '&:focus-visible': { outline: '2px solid', outlineOffset: '0' },
                '& > svg': { width: '1rem', height: '1rem', flexShrink: 0 },
                '[data-collapsible=icon] &': {
                    marginTop: '-2rem',
                    opacity: 0,
                    userSelect: 'none',
                    pointerEvents: 'none',
                },
            }}
            {...props}
        />
    );
}

export function SidebarGroupAction({
    asChild = false,
    ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
    const Comp = asChild ? ChakraSlot : chakra.button;

    return (
        <Comp
            data-slot="sidebar-group-action"
            data-sidebar="group-action"
            position="absolute"
            top="3.5"
            right="3"
            display="flex"
            aspectRatio="square"
            w="5"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
            p="0"
            outline="none"
            color="sidebar.fg"
            _hover={{ bg: 'sidebar.accent', color: 'sidebar.accentFg' }}
            css={{
                transition: 'transform 200ms',
                outlineColor: 'var(--ck-colors-sidebar-ring)',
                '&:focus-visible': { outline: '2px solid', outlineOffset: '0' },
                '& > svg': { width: '1rem', height: '1rem', flexShrink: 0 },
                '&::after': { position: 'absolute', inset: '-0.5rem', content: '""' },
                '@media (min-width: 768px)': { '&::after': { display: 'none' } },
                '[data-collapsible=icon] &': { display: 'none' },
            }}
            {...props}
        />
    );
}

export function SidebarGroupContent({ ...props }: React.ComponentProps<'div'>) {
    return (
        <chakra.div
            data-slot="sidebar-group-content"
            data-sidebar="group-content"
            w="full"
            fontSize="sm"
            {...props}
        />
    );
}
