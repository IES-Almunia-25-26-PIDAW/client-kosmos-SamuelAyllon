import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    CreditCard,
    Receipt,
    Sparkles,
    Settings,
    Shield,
    Users,
    CreditCardIcon,
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Ajustes',
        href: '/settings',
        icon: Settings,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { is_admin: boolean; is_premium: boolean } }>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Hoy',
            href: '/dashboard',
            icon: CalendarDays,
        },
        {
            title: 'Pacientes',
            href: '/clients',
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
