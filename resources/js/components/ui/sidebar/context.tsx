import { chakra } from '@chakra-ui/react';
import * as React from 'react';
import { Slot } from '@/lib/slot';

export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = '18rem';
export const SIDEBAR_WIDTH_MOBILE = '20rem';
export const SIDEBAR_WIDTH_ICON = '3.5rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export type SidebarContextValue = {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};

export const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }
    return context;
}

export const ChakraSlot = chakra(Slot);
