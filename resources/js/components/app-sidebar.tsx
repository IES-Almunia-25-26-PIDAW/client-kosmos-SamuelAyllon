import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    CalendarRange,
    CircleDollarSign,
    FileText,
    Handshake,
    Home,
    Library,
    MessageSquare,
    Receipt,
    Settings,
    Sparkles,
    Users,
} from 'lucide-react';
import type { MouseEventHandler } from 'react';
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
        title: 'Cobros',
        href: '/invoices',
        icon: CircleDollarSign,
    },
    {
        title: 'Recursos',
        href: '/resources',
        icon: Library,
    },
    {
        title: 'Calendario',
        href: '/schedule',
        icon: CalendarRange,
    },
    {
        title: 'Kosmo',
        href: '/kosmo',
        icon: Sparkles,
    },
    {
        title: 'Equipo',
        href: '/team',
        icon: Handshake,
    },
];

const patientNavItems: NavItem[] = [
    {
        title: 'Inicio',
        href: '/portal',
        icon: Home,
    },
    {
        title: 'Citas',
        href: '/portal/appointments',
        icon: CalendarDays,
    },
    {
        title: 'Mensajes',
        href: '/portal/messages',
        icon: MessageSquare,
    },
    {
        title: 'Acuerdos',
        href: '/portal/consent-forms',
        icon: FileText,
    },
    {
        title: 'Facturas',
        href: '/portal/invoices',
        icon: Receipt,
    },
    {
        title: 'Profesionales',
        href: '#',
        icon: Users,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Usuarios',
        href: '/admin/users',
        icon: Users,
    },
];

type AppSidebarProps = {
    onMouseEnter?: MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: MouseEventHandler<HTMLDivElement>;
};

export function AppSidebar({ onMouseEnter, onMouseLeave }: AppSidebarProps = {}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth?.user?.role;
    const isAdmin = role === 'admin';
    const isPatient = role === 'patient';

    const homeHref = isAdmin ? '/admin/users' : isPatient ? '/portal' : '/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild h="24 !important">
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {isAdmin && <NavMain items={adminNavItems} label="Administración" />}
                {isPatient && <NavMain items={patientNavItems} label="Mi portal" />}
                {!isAdmin && !isPatient && <NavMain items={professionalNavItems} label="General" />}
            </SidebarContent>

            <SidebarFooter>
                {!isAdmin && !isPatient && <NavFooter items={footerNavItems} mt="auto" />}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
