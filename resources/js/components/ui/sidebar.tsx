import { chakra } from '@chakra-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContext = {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }
    return context;
}

const ChakraSlot = chakra(Slot);

function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    style,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === 'function' ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        },
        [setOpenProp, open],
    );

    const toggleSidebar = React.useCallback(
        () => (isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)),
        [isMobile, setOpen, setOpenMobile],
    );

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContext>(
        () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <TooltipProvider delayDuration={0}>
                <chakra.div
                    data-slot="sidebar-wrapper"
                    display="flex"
                    minH="100svh"
                    w="full"
                    style={
                        {
                            '--sidebar-width': SIDEBAR_WIDTH,
                            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                            ...style,
                        } as React.CSSProperties
                    }
                    css={{
                        '&:has([data-variant=inset])': { background: 'var(--ck-colors-sidebar)' },
                    }}
                    {...props}
                >
                    {children}
                </chakra.div>
            </TooltipProvider>
        </SidebarContext.Provider>
    );
}

function Sidebar({
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    children,
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
                bg="sidebar.DEFAULT"
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
                    bg="sidebar.DEFAULT"
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

function SidebarTrigger({
    onClick,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { toggleSidebar, isMobile, state } = useSidebar();

    return (
        <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            size="icon"
            h="7"
            w="7"
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
            {...props}
        >
            {isMobile || state === 'collapsed' ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
                Toggle Sidebar
            </span>
        </Button>
    );
}

function SidebarRail({ ...props }: React.ComponentProps<'button'>) {
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

function SidebarInset({ ...props }: React.ComponentProps<'main'>) {
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

function SidebarInput({ ...props }: React.ComponentProps<typeof Input>) {
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

function SidebarHeader({ ...props }: React.ComponentProps<'div'>) {
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

function SidebarFooter({ ...props }: React.ComponentProps<'div'>) {
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

function SidebarSeparator({ ...props }: React.ComponentProps<typeof Separator>) {
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

function SidebarContent({ ...props }: React.ComponentProps<'div'>) {
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

function SidebarGroup({ ...props }: React.ComponentProps<'div'> & { css?: Record<string, unknown> }) {
    return (
        <chakra.div
            data-slot="sidebar-group"
            data-sidebar="group"
            position="relative"
            display="flex"
            w="full"
            minW="0"
            flexDirection="column"
            p="2"
            {...props}
        />
    );
}

function SidebarGroupLabel({
    asChild = false,
    ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
    const Comp = asChild ? ChakraSlot : chakra.div;

    return (
        <Comp
            data-slot="sidebar-group-label"
            data-sidebar="group-label"
            display="flex"
            h="8"
            flexShrink={0}
            alignItems="center"
            borderRadius="md"
            px="2"
            fontSize="xs"
            fontWeight="medium"
            outline="none"
            opacity={0.7}
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

function SidebarGroupAction({
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

function SidebarGroupContent({ ...props }: React.ComponentProps<'div'>) {
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

function SidebarMenu({ ...props }: React.ComponentProps<'ul'>) {
    return (
        <chakra.ul
            data-slot="sidebar-menu"
            data-sidebar="menu"
            display="flex"
            w="full"
            minW="0"
            flexDirection="column"
            gap="1"
            listStyle="none"
            {...props}
        />
    );
}

function SidebarMenuItem({ ...props }: React.ComponentProps<'li'>) {
    return (
        <chakra.li
            data-slot="sidebar-menu-item"
            data-sidebar="menu-item"
            position="relative"
            {...props}
        />
    );
}

function SidebarMenuButton({
    asChild = false,
    isActive = false,
    variant = 'default',
    size = 'default',
    tooltip,
    ...props
}: React.ComponentProps<'button'> & {
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
                    width: '2rem !important',
                    height: '2rem !important',
                    padding: '0.5rem !important',
                },
                ...(size === 'lg' && {
                    '[data-collapsible=icon] &': { padding: '0 !important' },
                }),
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

function SidebarMenuAction({
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

function SidebarMenuBadge({ ...props }: React.ComponentProps<'div'>) {
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

function SidebarMenuSkeleton({
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

function SidebarMenuSub({ ...props }: React.ComponentProps<'ul'>) {
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

function SidebarMenuSubItem({ ...props }: React.ComponentProps<'li'>) {
    return (
        <chakra.li
            data-slot="sidebar-menu-sub-item"
            data-sidebar="menu-sub-item"
            position="relative"
            {...props}
        />
    );
}

function SidebarMenuSubButton({
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

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
};
