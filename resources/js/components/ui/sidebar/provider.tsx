import { chakra } from '@chakra-ui/react';
import * as React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    SIDEBAR_COOKIE_MAX_AGE,
    SIDEBAR_COOKIE_NAME,
    SIDEBAR_KEYBOARD_SHORTCUT,
    SIDEBAR_WIDTH,
    SIDEBAR_WIDTH_ICON,
    SidebarContext,
    type SidebarContextValue,
} from './context';

export function SidebarProvider({
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

    const contextValue = React.useMemo<SidebarContextValue>(
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
                        '&:has([data-variant=inset])': { background: 'transparent' },
                    }}
                    {...props}
                >
                    {children}
                </chakra.div>
            </TooltipProvider>
        </SidebarContext.Provider>
    );
}
