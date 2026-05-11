import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './context';

export function SidebarTrigger({
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
