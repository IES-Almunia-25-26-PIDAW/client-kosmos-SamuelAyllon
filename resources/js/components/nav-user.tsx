import { chakra } from '@chakra-ui/react';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';

const ChevronIcon = chakra(ChevronsUpDown);

export function NavUser() {
    const { auth } = usePage().props;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu positioning={{ placement: 'top-end' }}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            color="sidebar.accentFg"
                            tooltip={{ children: auth.user.name }}
                            css={{
                                '&[data-state=open]': { background: 'var(--ck-colors-sidebar-accent)' },
                                '[data-collapsible=icon] &': { justifyContent: 'center' },
                            }}
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronIcon
                                ml="auto"
                                boxSize="4"
                                flexShrink={0}
                                css={{ '[data-collapsible=icon] &': { display: 'none' } }}
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        minW="56"
                        borderRadius="lg"
                        align="end"
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
