import { chakra, type HTMLChakraProps } from '@chakra-ui/react';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { SIDEBAR_WIDTH_MOBILE, useSidebar } from './context';

export function Sidebar({
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    children,
    onMouseEnter,
    onMouseLeave,
    ...props
}: React.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === 'none') {
        return (
            <chakra.div
                data-slot="sidebar"
                display="flex"
                h="full"
                w="var(--sidebar-width)"
                flexDirection="column"
                bg="transparent"
                color="sidebar.fg"
                {...props}
            >
                {children}
            </chakra.div>
        );
    }

    if (isMobile) {
        return (
            <Sheet open={openMobile} onOpenChange={setOpenMobile} {...(props as object)}>
                <SheetContent
                    data-sidebar="sidebar"
                    data-slot="sidebar"
                    data-mobile="true"
                    bg="sidebar.DEFAULT"
                    color="sidebar.fg"
                    side={side}
                    style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
                    css={{
                        width: 'var(--sidebar-width)',
                        padding: '0',
                        '& > button': { display: 'none' },
                    }}
                >
                    <SheetHeader
                        style={{
                            position: 'absolute',
                            width: '1px',
                            height: '1px',
                            padding: 0,
                            margin: '-1px',
                            overflow: 'hidden',
                            clip: 'rect(0,0,0,0)',
                            whiteSpace: 'nowrap',
                            borderWidth: 0,
                        }}
                    >
                        <SheetTitle>Sidebar</SheetTitle>
                        <SheetDescription>Displays the mobile sidebar.</SheetDescription>
                    </SheetHeader>
                    <chakra.div display="flex" h="full" w="full" flexDirection="column">
                        {children}
                    </chakra.div>
                </SheetContent>
            </Sheet>
        );
    }

    const isFloatingOrInset = variant === 'floating' || variant === 'inset';

    return (
        <chakra.div
            display={{ base: 'none', md: 'block' }}
            color="sidebar.fg"
            data-state={state}
            data-collapsible={state === 'collapsed' ? collapsible : ''}
            data-variant={variant}
            data-side={side}
            data-slot="sidebar"
            css={{ position: 'relative' }}
        >
            {/* Spacer that creates the layout gap */}
            <chakra.div
                position="relative"
                h="100svh"
                w="var(--sidebar-width)"
                bg="transparent"
                css={{
                    transition: 'width 200ms linear',
                    '[data-collapsible=offcanvas] &': { width: '0' },
                    '[data-side=right] &': { transform: 'rotate(180deg)' },
                    '[data-collapsible=icon] &': isFloatingOrInset
                        ? { width: 'calc(var(--sidebar-width-icon) + var(--spacing, 1rem))' }
                        : { width: 'var(--sidebar-width-icon)' },
                }}
            />
            {/* Fixed sidebar panel */}
            <chakra.div
                position="fixed"
                top="0"
                bottom="0"
                zIndex={10}
                display={{ base: 'none', md: 'flex' }}
                h="100svh"
                w="var(--sidebar-width)"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                css={{
                    transition: 'left right width 200ms linear',
                    ...(side === 'left'
                        ? {
                              left: '0',
                              '[data-collapsible=offcanvas] &': {
                                  left: 'calc(var(--sidebar-width) * -1)',
                              },
                          }
                        : {
                              right: '0',
                              '[data-collapsible=offcanvas] &': {
                                  right: 'calc(var(--sidebar-width) * -1)',
                              },
                          }),
                    ...(isFloatingOrInset
                        ? {
                              padding: '0.5rem',
                              '[data-collapsible=icon] &': {
                                  width: 'calc(var(--sidebar-width-icon) + var(--spacing, 1rem) + 2px)',
                              },
                          }
                        : {
                              '[data-collapsible=icon] &': { width: 'var(--sidebar-width-icon)' },
                              '[data-side=left] &': { borderRight: '1px solid var(--ck-colors-sidebar-border)' },
                              '[data-side=right] &': { borderLeft: '1px solid var(--ck-colors-sidebar-border)' },
                          }),
                }}
                {...props}
            >
                <chakra.div
                    data-sidebar="sidebar"
                    display="flex"
                    h="full"
                    w="full"
                    flexDirection="column"
                    bg="transparent"
                    css={{
                        '[data-variant=floating] &': {
                            borderRadius: 'var(--radii-lg)',
                            border: '1px solid var(--ck-colors-sidebar-border)',
                            boxShadow: 'var(--shadows-sm)',
                        },
                    }}
                >
                    {children}
                </chakra.div>
            </chakra.div>
        </chakra.div>
    );
}

export function SidebarRail({ ...props }: React.ComponentProps<'button'>) {
    const { toggleSidebar } = useSidebar();

    return (
        <chakra.button
            data-sidebar="rail"
            data-slot="sidebar-rail"
            aria-label="Toggle Sidebar"
            tabIndex={-1}
            onClick={toggleSidebar}
            title="Toggle Sidebar"
            position="absolute"
            top="0"
            bottom="0"
            zIndex={20}
            display={{ base: 'none', sm: 'flex' }}
            w="4"
            css={{
                transform: 'translateX(-50%)',
                transitionProperty: 'all',
                transitionTimingFunction: 'linear',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '0',
                    bottom: '0',
                    left: '50%',
                    width: '2px',
                },
                '&:hover::after': { background: 'var(--ck-colors-sidebar-border)' },
                '[data-side=left] &': { right: '-1rem', cursor: 'w-resize' },
                '[data-side=right] &': { left: '0', cursor: 'e-resize' },
                '[data-side=left][data-state=collapsed] &': { cursor: 'e-resize' },
                '[data-side=right][data-state=collapsed] &': { cursor: 'w-resize' },
                '[data-collapsible=offcanvas] &:hover': { background: 'var(--ck-colors-sidebar)' },
                '[data-collapsible=offcanvas] &': { transform: 'translateX(0)' },
                '[data-collapsible=offcanvas] &::after': { left: '100%' },
                '[data-side=left][data-collapsible=offcanvas] &': { right: '-0.5rem' },
                '[data-side=right][data-collapsible=offcanvas] &': { left: '-0.5rem' },
            }}
            {...props}
        />
    );
}

export function SidebarInset({ ...props }: HTMLChakraProps<'main'>) {
    return (
        <chakra.main
            data-slot="sidebar-inset"
            bg="bg.DEFAULT"
            position="relative"
            display="flex"
            maxW="full"
            minH="100svh"
            flex="1"
            flexDirection="column"
            css={{
                '[data-slot=sidebar][data-variant=inset] ~ &': {
                    minHeight: 'calc(100svh - var(--spacing, 1rem))',
                },
                '@media (min-width: 768px)': {
                    '[data-slot=sidebar][data-variant=inset] ~ &': {
                        margin: '0.5rem',
                        marginLeft: '0',
                        borderRadius: 'var(--radii-xl)',
                        boxShadow: 'var(--shadows-sm)',
                    },
                    '[data-slot=sidebar][data-variant=inset][data-state=collapsed] ~ &': {
                        marginLeft: '0',
                    },
                },
            }}
            {...props}
        />
    );
}

export function SidebarInput({ ...props }: React.ComponentProps<typeof Input>) {
    return (
        <Input
            data-slot="sidebar-input"
            data-sidebar="input"
            bg="bg.DEFAULT"
            h="8"
            w="full"
            boxShadow="none"
            {...props}
        />
    );
}

export function SidebarHeader({ ...props }: React.ComponentProps<'div'>) {
    return (
        <chakra.div
            data-slot="sidebar-header"
            data-sidebar="header"
            display="flex"
            flexDirection="column"
            gap="2"
            p="2"
            {...props}
        />
    );
}

export function SidebarFooter({ ...props }: React.ComponentProps<'div'>) {
    return (
        <chakra.div
            data-slot="sidebar-footer"
            data-sidebar="footer"
            display="flex"
            flexDirection="column"
            gap="2"
            p="2"
            {...props}
        />
    );
}

export function SidebarSeparator({ ...props }: React.ComponentProps<typeof Separator>) {
    return (
        <Separator
            data-slot="sidebar-separator"
            data-sidebar="separator"
            borderColor="sidebar.border"
            mx="2"
            w="auto"
            {...props}
        />
    );
}

export function SidebarContent({ ...props }: React.ComponentProps<'div'>) {
    return (
        <chakra.div
            data-slot="sidebar-content"
            data-sidebar="content"
            display="flex"
            minH="0"
            flex="1"
            flexDirection="column"
            gap="2"
            overflow="auto"
            css={{
                '[data-collapsible=icon] &': { overflow: 'hidden' },
            }}
            {...props}
        />
    );
}
