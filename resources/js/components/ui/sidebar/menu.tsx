import { chakra, type HTMLChakraProps } from '@chakra-ui/react';
import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChakraSlot, useSidebar } from './context';

export function SidebarMenu({ ...props }: React.ComponentProps<'ul'>) {
    return (
        <chakra.ul
            data-slot="sidebar-menu"
            data-sidebar="menu"
            display="flex"
            w="full"
            minW="0"
            flexDirection="column"
            gap="0.5"
            listStyle="none"
            m="0"
            paddingInlineStart="1"
            alignItems={{ base: 'stretch' }}
            css={{
                '[data-collapsible=icon] &': {
                    paddingInlineStart: '0',
                    alignItems: 'center',
                },
            }}
            {...props}
        />
    );
}

export function SidebarMenuItem({ ...props }: React.ComponentProps<'li'>) {
    return (
        <chakra.li
            data-slot="sidebar-menu-item"
            data-sidebar="menu-item"
            position="relative"
            {...props}
        />
    );
}

export function SidebarMenuButton({
    asChild = false,
    isActive = false,
    variant = 'default',
    size = 'default',
    tooltip,
    ...props
}: HTMLChakraProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
}) {
    const Comp = asChild ? ChakraSlot : chakra.button;
    const { isMobile, state } = useSidebar();

    const button = (
        <Comp
            data-slot="sidebar-menu-button"
            data-sidebar="menu-button"
            data-size={size}
            data-active={isActive}
            display="flex"
            w="full"
            alignItems="center"
            gap="2"
            overflow="hidden"
            borderRadius="md"
            p="2"
            borderColor="transparent"
            textAlign="left"
            fontSize={size === 'sm' ? 'xs' : 'sm'}
            outline="none"
            h={size === 'sm' ? '7' : size === 'lg' ? '12' : '8'}
            bg={variant === 'outline' ? 'bg.DEFAULT' : isActive ? 'sidebar.accent' : 'transparent'}
            color={isActive ? 'sidebar.accentFg' : 'sidebar.fg'}
            fontWeight={isActive ? 'medium' : 'normal'}
            _hover={{ bg: 'sidebar.accent', color: 'sidebar.accentFg' }}
            _active={{ bg: 'sidebar.accent', color: 'sidebar.accentFg' }}
            _disabled={{ pointerEvents: 'none', opacity: 0.5 }}
            css={{
                transition: 'width height padding 200ms linear',
                outlineColor: 'var(--ck-colors-sidebar-ring)',
                '&:focus-visible': { outline: '2px solid', outlineOffset: '0' },
                '&[aria-disabled=true]': { pointerEvents: 'none', opacity: 0.5 },
                '&[data-state=open]:hover': {
                    background: 'var(--ck-colors-sidebar-accent)',
                    color: 'var(--ck-colors-sidebar-accentFg)',
                },
                '& > span:last-child': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
                '& > svg': { width: '1rem', height: '1rem', flexShrink: 0 },
                '[data-sidebar=menu-item]:has([data-sidebar=menu-action]) &': {
                    paddingRight: '2rem',
                },
                '[data-collapsible=icon] &': {
                    width: size === 'lg' ? '3rem !important' : '2rem !important',
                    height: size === 'lg' ? '3rem !important' : '2rem !important',
                    padding: size === 'lg' ? '0.5rem !important' : '0.5rem !important',
                    justifyContent: 'center',
                    gap: '0',
                },
                '[data-collapsible=icon] & > span': { display: 'none' },
                ...(variant === 'outline' && {
                    boxShadow: '0 0 0 1px var(--ck-colors-sidebar-border)',
                    '&:hover': {
                        boxShadow: '0 0 0 1px var(--ck-colors-sidebar-accent)',
                    },
                }),
            }}
            {...props}
        />
    );

    if (!tooltip) {
        return button;
    }

    if (typeof tooltip === 'string') {
        tooltip = { children: tooltip };
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent
                side="right"
                align="center"
                hidden={state !== 'collapsed' || isMobile}
                {...tooltip}
            />
        </Tooltip>
    );
}

export function SidebarMenuAction({
    asChild = false,
    showOnHover = false,
    ...props
}: React.ComponentProps<'button'> & {
    asChild?: boolean;
    showOnHover?: boolean;
}) {
    const Comp = asChild ? ChakraSlot : chakra.button;

    return (
        <Comp
            data-slot="sidebar-menu-action"
            data-sidebar="menu-action"
            position="absolute"
            top="1.5"
            right="1"
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
                '[data-sidebar=menu-button][data-size=sm] ~ &': { top: '0.25rem' },
                '[data-sidebar=menu-button][data-size=default] ~ &': { top: '0.375rem' },
                '[data-sidebar=menu-button][data-size=lg] ~ &': { top: '0.625rem' },
                '[data-collapsible=icon] &': { display: 'none' },
                '[data-sidebar=menu-button]:hover ~ &': { color: 'var(--ck-colors-sidebar-accentFg)' },
                ...(showOnHover && {
                    opacity: 0,
                    '[data-sidebar=menu-button][data-active=true] ~ &': {
                        color: 'var(--ck-colors-sidebar-accentFg)',
                    },
                    '[data-sidebar=menu-item]:focus-within &': { opacity: 1 },
                    '[data-sidebar=menu-item]:hover &': { opacity: 1 },
                    '&[data-state=open]': { opacity: 1 },
                }),
            }}
            {...props}
        />
    );
}

export function SidebarMenuBadge({ ...props }: React.ComponentProps<'div'>) {
    return (
        <chakra.div
            data-slot="sidebar-menu-badge"
            data-sidebar="menu-badge"
            position="absolute"
            right="1"
            display="flex"
            h="5"
            minW="5"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
            px="1"
            fontSize="xs"
            fontWeight="medium"
            pointerEvents="none"
            userSelect="none"
            color="sidebar.fg"
            css={{
                fontVariantNumeric: 'tabular-nums',
                '[data-sidebar=menu-button]:hover ~ &': {
                    color: 'var(--ck-colors-sidebar-accentFg)',
                },
                '[data-sidebar=menu-button][data-active=true] ~ &': {
                    color: 'var(--ck-colors-sidebar-accentFg)',
                },
                '[data-sidebar=menu-button][data-size=sm] ~ &': { top: '0.25rem' },
                '[data-sidebar=menu-button][data-size=default] ~ &': { top: '0.375rem' },
                '[data-sidebar=menu-button][data-size=lg] ~ &': { top: '0.625rem' },
                '[data-collapsible=icon] &': { display: 'none' },
            }}
            {...props}
        />
    );
}

export function SidebarMenuSkeleton({
    showIcon = false,
    ...props
}: React.ComponentProps<'div'> & {
    showIcon?: boolean;
}) {
    const [skeletonStyle] = React.useState(
        () =>
            ({
                '--skeleton-width': `${Math.floor(Math.random() * 40) + 50}%`,
            }) as React.CSSProperties,
    );

    return (
        <chakra.div
            data-slot="sidebar-menu-skeleton"
            data-sidebar="menu-skeleton"
            display="flex"
            h="8"
            alignItems="center"
            gap="2"
            borderRadius="md"
            px="2"
            {...props}
        >
            {showIcon && (
                <Skeleton
                    data-sidebar="menu-skeleton-icon"
                    style={{ width: '1rem', height: '1rem', borderRadius: 'var(--radii-md)', flexShrink: 0 }}
                />
            )}
            <Skeleton
                data-sidebar="menu-skeleton-text"
                style={{
                    height: '1rem',
                    maxWidth: 'var(--skeleton-width)',
                    flex: '1',
                    ...skeletonStyle,
                }}
            />
        </chakra.div>
    );
}
