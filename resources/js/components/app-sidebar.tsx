import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Receipt,
    Sparkles,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Ajustes',
        href: '/settings',
        icon: Settings,
    },
];

const professionalNavItems: NavItem[] = [
    {
        title: 'Hoy',
        href: '/dashboard',
        icon: CalendarDays,
    },
    {
        title: 'Pacientes',
        href: '/patients',
        icon: Users,
    },
    {
        title: 'Kosmo',
        href: '/kosmo',
        icon: Sparkles,
    },
    {
        title: 'Cobros',
        href: '/billing',
        icon: Receipt,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Usuarios',
        href: '/admin/users',
        icon: Users,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth?.user?.role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isAdmin ? '/admin/users' : '/dashboard'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {isAdmin
                    ? <NavMain items={adminNavItems} label="Administración" />
                    : <NavMain items={professionalNavItems} label="General" />
                }
            </SidebarContent>

            <SidebarFooter>
                {!isAdmin && <NavFooter items={footerNavItems} className="mt-auto" />}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
