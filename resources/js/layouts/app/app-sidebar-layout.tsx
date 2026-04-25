import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import type { AppLayoutProps } from '@/types';

/**
 * Inner component that must render inside SidebarProvider to access useSidebar.
 * Controls open/close via mouse hover on the fixed sidebar panel.
 */
function SidebarHoverController() {
    const { setOpen } = useSidebar();

    return (
        <AppSidebar
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        />
    );
}

export default function AppSidebarLayout({
    children,
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <SidebarHoverController />
            <AppContent variant="sidebar" overflowX="hidden">
                {children}
            </AppContent>
        </AppShell>
    );
}
