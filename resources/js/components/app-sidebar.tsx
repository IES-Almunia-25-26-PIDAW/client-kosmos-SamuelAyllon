import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    CalendarRange,
    CircleDollarSign,
    FileText,
    Handshake,
    Home,
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
import { dashboard as portalDashboard } from '@/routes/patient';
import { index as portalAppointmentsIndex } from '@/routes/patient/appointments';
import { index as portalConsentFormsIndex } from '@/routes/patient/consent-forms';
import { index as portalInvoicesIndex } from '@/routes/patient/invoices';
import { index as portalMessagesIndex } from '@/routes/patient/messages';
import { index as portalProfessionalsIndex } from '@/routes/patient/professionals';
import { dashboard, kosmo, settings } from '@/routes/professional';
import { index as invoicesIndex } from '@/routes/professional/invoices';
import { index as messagesIndex } from '@/routes/professional/messages';
import { index as patientsIndex } from '@/routes/professional/patients';
import { index as scheduleIndex } from '@/routes/professional/schedule';
import { index as teamIndex } from '@/routes/professional/workspace/team';
import type { Auth, NavItem } from '@/types';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Ajustes',
        href: settings.url(),
        icon: Settings,
    },
];

const professionalNavItems: NavItem[] = [
    {
        title: 'Hoy',
        href: dashboard.url(),
        icon: CalendarDays,
    },
    {
        title: 'Pacientes',
        href: patientsIndex.url(),
        icon: Users,
    },
    {
        title: 'Cobros',
        href: invoicesIndex.url(),
        icon: CircleDollarSign,
    },
    {
        title: 'Mensajes',
        href: messagesIndex.url(),
        icon: MessageSquare,
    },
    {
        title: 'Calendario',
        href: scheduleIndex.url(),
        icon: CalendarRange,
    },
    {
        title: 'Kosmo',
        href: kosmo.url(),
        icon: Sparkles,
    },
    {
        title: 'Equipo',
        href: teamIndex.url(),
        icon: Handshake,
    },
];

const patientNavItems: NavItem[] = [
    {
        title: 'Inicio',
        href: portalDashboard.url(),
        icon: Home,
    },
    {
        title: 'Citas',
        href: portalAppointmentsIndex.url(),
        icon: CalendarDays,
    },
    {
        title: 'Mensajes',
        href: portalMessagesIndex.url(),
        icon: MessageSquare,
    },
    {
        title: 'Acuerdos',
        href: portalConsentFormsIndex.url(),
        icon: FileText,
    },
    {
        title: 'Facturas',
        href: portalInvoicesIndex.url(),
        icon: Receipt,
    },
    {
        title: 'Profesionales',
        href: portalProfessionalsIndex.url(),
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

    const homeHref = isAdmin ? '/admin/users' : isPatient ? portalDashboard.url() : dashboard.url();

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
