import { chakra } from '@chakra-ui/react';
import * as React from 'react';
import { ChakraSlot } from './context';

export function SidebarMenuSub({ ...props }: React.ComponentProps<'ul'>) {
    return (
        <chakra.ul
            data-slot="sidebar-menu-sub"
            data-sidebar="menu-sub"
            display="flex"
            minW="0"
            flexDirection="column"
            gap="1"
            listStyle="none"
            mx="3.5"
            px="2.5"
            py="0.5"
            borderLeftWidth="1px"
            borderColor="sidebar.border"
            css={{
                transform: 'translateX(1px)',
                '[data-collapsible=icon] &': { display: 'none' },
            }}
            {...props}
        />
    );
}

export function SidebarMenuSubItem({ ...props }: React.ComponentProps<'li'>) {
    return (
        <chakra.li
            data-slot="sidebar-menu-sub-item"
            data-sidebar="menu-sub-item"
            position="relative"
            {...props}
        />
    );
}

export function SidebarMenuSubButton({
    asChild = false,
    size = 'md',
    isActive = false,
    ...props
}: React.ComponentProps<'a'> & {
    asChild?: boolean;
    size?: 'sm' | 'md';
    isActive?: boolean;
}) {
    const Comp = asChild ? ChakraSlot : chakra.a;

    return (
        <Comp
            data-slot="sidebar-menu-sub-button"
            data-sidebar="menu-sub-button"
            data-size={size}
            data-active={isActive}
            display="flex"
            h="7"
            minW="0"
            alignItems="center"
            gap="2"
            overflow="hidden"
            borderRadius="md"
            px="2"
            outline="none"
            fontSize={size === 'sm' ? 'xs' : 'sm'}
            color={isActive ? 'sidebar.accentFg' : 'sidebar.fg'}
            bg={isActive ? 'sidebar.accent' : 'transparent'}
            _hover={{ bg: 'sidebar.accent', color: 'sidebar.accentFg' }}
            _active={{ bg: 'sidebar.accent', color: 'sidebar.accentFg' }}
            _disabled={{ pointerEvents: 'none', opacity: 0.5 }}
            css={{
                transform: 'translateX(-1px)',
                outlineColor: 'var(--ck-colors-sidebar-ring)',
                '&:focus-visible': { outline: '2px solid', outlineOffset: '0' },
                '&[aria-disabled=true]': { pointerEvents: 'none', opacity: 0.5 },
                '& > span:last-child': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
                '& > svg': {
                    width: '1rem',
                    height: '1rem',
                    flexShrink: 0,
                    color: 'var(--ck-colors-sidebar-accentFg)',
                },
                '[data-collapsible=icon] &': { display: 'none' },
            }}
            {...props}
        />
    );
}
