import { Link, usePage } from '@inertiajs/react';
import {
    Archive,
    CheckSquare,
    CreditCard,
    FolderOpen,
    LayoutGrid,
    Lightbulb,
    Shield,
    Sparkles,
    Star,
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
            title: 'Tareas',
            href: '/tasks',
            icon: CheckSquare,
        },
        {
            title: 'Ideas',
            href: '/ideas',
            icon: Lightbulb,
        },
        ...(auth.is_premium ? [
            {
                title: 'Proyectos',
                href: '/projects',
                icon: FolderOpen,
            },
            {
                title: 'Cajas',
                href: '/boxes',
                icon: Archive,
            },
            {
                title: 'Asistente IA',
                href: '/ai-chats',
                icon: Sparkles,
            },
        ] : []),
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
            icon: Users,
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
