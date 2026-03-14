import { Link, usePage } from '@inertiajs/react';
import {
    CheckSquare,
    CreditCard,
    LayoutGrid,
    Lightbulb,
    Shield,
    Star,
    Users as UsersIcon,
    FolderKanban,
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
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { is_admin: boolean; is_premium: boolean } }>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Clientes',
            href: '/clients',
            icon: FolderKanban,
        },
        {
            title: 'Tareas',
            href: '/tasks',
            icon: CheckSquare,
        },
        {
            title: 'Notas',
            href: '/notes',
            icon: Lightbulb,
        },
        {
            title: 'Suscripción',
            href: '/subscription',
            icon: Star,
        },
    ];

    const adminNavItems: NavItem[] = auth.is_admin ? [
        {
            title: 'Panel admin',
            href: '/admin/dashboard',
            icon: Shield,
        },
        {
            title: 'Usuarios',
            href: '/admin/users',
            icon: UsersIcon,
        },
        {
            title: 'Pagos',
            href: '/admin/payments',
            icon: CreditCard,
        },
        {
            title: 'Suscripciones',
            href: '/admin/subscriptions',
            icon: Star,
        },
    ] : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {!auth.is_admin && <NavMain items={mainNavItems} label="General" />}
                {auth.is_admin && <NavMain items={adminNavItems} label="Administración" />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
