import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { ArrowRight, CalendarDays, CheckCircle, Receipt } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import AppointmentShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import type { Auth } from '@/types';

interface UpcomingAppointment {
    id: number;
    scheduled_at: string;
    modality: string;
    status: string;
    professional: {
        id: number;
        name: string;
        specialty: string | null;
        avatar_path: string | null;
    };
    service_name: string | null;
}

interface RecentInvoice {
    id: number;
    amount: number;
    status: string;
    due_at: string | null;
    created_at: string | null;
}

interface PatientStats {
    upcoming_appointments: number;
    completed_sessions: number;
    pending_invoices: number;
}

interface Props {
    upcomingAppointments: UpcomingAppointment[];
    recentInvoices: RecentInvoice[];
    stats: PatientStats;
}

const greeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
};

const formatDate = (): string =>
    new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

const formatDateTime = (dt: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dt));

const getModalityLabel = (modality: string): string => {
    const map: Record<string, string> = {
        in_person: 'Presencial',
        video_call: 'Videollamada',
        online: 'Online',
        telefono: 'Teléfono',
    };
    return map[modality?.toLowerCase()] ?? modality ?? 'Presencial';
};

const isOnlineModality = (modality: string): boolean =>
    ['video_call', 'online', 'telefono'].includes(modality?.toLowerCase());

const invoiceStatusLabel: Record<string, string> = {
    draft: 'Borrador',
    sent: 'Pendiente',
    paid: 'Pagada',
    overdue: 'Vencida',
    cancelled: 'Cancelada',
};

const invoiceStatusClass: Record<string, string> = {
    paid: 'bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]',
    overdue: 'bg-[var(--color-error-subtle)] text-[var(--color-error-fg)]',
    sent: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning-fg)]',
    draft: 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]',
    cancelled: 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]',
};

const getInitials = (name: string): string =>
    name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

export default function PatientDashboard({ upcomingAppointments, recentInvoices, stats }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const nextAppointment = upcomingAppointments[0] ?? null;

    return (
        <>
            <Head title="Inicio — ClientKosmos" />

            <div className="flex flex-col gap-6 p-6 lg:p-8">

                {/* Header */}
                <div>
                    <h1 className="text-display-2xl text-[var(--color-text)]">
                        {greeting()}, {auth.user.name.split(' ')[0]}
                    </h1>
                    <p className="mt-0.5 text-body-md text-[var(--color-text-secondary)] capitalize">
                        {formatDate()}
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] p-5 flex items-center justify-between shadow-[var(--shadow-sm)]">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                                Próximas citas
                            </p>
                            <p className="text-kpi font-bold text-white mt-1 leading-none">
                                {stats.upcoming_appointments.toString().padStart(2, '0')}
                            </p>
                        </div>
                        <div className="rounded-[var(--radius-md)] bg-white/15 p-2.5">
                            <CalendarDays size={22} className="text-white" />
                        </div>
                    </div>

                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex items-center justify-between shadow-[var(--shadow-sm)]">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                                Sesiones completadas
                            </p>
                            <p className="text-kpi font-bold text-[var(--color-text)] mt-1 leading-none">
                                {stats.completed_sessions.toString().padStart(2, '0')}
                            </p>
                        </div>
                        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] p-2.5">
                            <CheckCircle size={22} className="text-[var(--color-text-secondary)]" />
                        </div>
                    </div>

                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex items-center justify-between shadow-[var(--shadow-sm)]">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                                Facturas pendientes
                            </p>
                            <p className="text-kpi font-bold text-[var(--color-text)] mt-1 leading-none">
                                {Number(stats.pending_invoices).toLocaleString('es-ES', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })} €
                            </p>
                        </div>
                        <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] p-2.5">
                            <Receipt size={22} className="text-[var(--color-text-secondary)]" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* === MAIN: Próximas citas === */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-display-lg text-[var(--color-text)]">Próximas citas</h2>
                            <Link
                                href="/appointments"
                                className="text-sm font-medium text-[var(--color-primary)] hover:underline flex items-center gap-1"
                            >
                                Ver todas <ArrowRight size={14} />
                            </Link>
                        </div>

                        {upcomingAppointments.length === 0 ? (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-10 text-center">
                                <CalendarDays size={32} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    No tienes citas próximas programadas.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {upcomingAppointments.map((appointment, index) => {
                                    const isNext = index === 0;
                                    const isOnline = isOnlineModality(appointment.modality);

                                    return (
                                        <div
                                            key={appointment.id}
                                            className={[
                                                'flex items-center gap-4 rounded-[var(--radius-lg)] border bg-[var(--color-surface)] p-4 transition-shadow',
                                                isNext
                                                    ? 'border-[var(--color-primary)] shadow-[var(--shadow-sm)]'
                                                    : 'border-[var(--color-border)] hover:shadow-[var(--shadow-sm)]',
                                            ].join(' ')}
                                        >
                                            {/* Professional avatar */}
                                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center shrink-0 text-sm font-semibold text-[var(--color-primary)]">
                                                {getInitials(appointment.professional.name)}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                                                    {appointment.professional.name}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                                                    {appointment.professional.specialty
                                                        ? `${appointment.professional.specialty} • `
                                                        : ''}
                                                    {formatDateTime(appointment.scheduled_at)}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    <span
                                                        className={[
                                                            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                                            isOnline
                                                                ? 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
                                                                : 'bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]',
                                                        ].join(' ')}
                                                    >
                                                        {getModalityLabel(appointment.modality)}
                                                    </span>
                                                    {appointment.service_name && (
                                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]">
                                                            {appointment.service_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action */}
                                            {isNext && (
                                                <Link
                                                    href={AppointmentShowAction.url(appointment.id)}
                                                    className="shrink-0 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                                                >
                                                    Ver cita
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* === SIDEBAR: Facturas recientes === */}
                    <div className="flex flex-col gap-4">
                        {recentInvoices.length > 0 && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                                <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                                        Facturas recientes
                                    </p>
                                </div>
                                <div className="divide-y divide-[var(--color-border-subtle)]">
                                    {recentInvoices.map((invoice) => (
                                        <div
                                            key={invoice.id}
                                            className="flex items-center justify-between px-4 py-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-[var(--color-text)]">
                                                    {Number(invoice.amount).toLocaleString('es-ES', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })} €
                                                </p>
                                                {invoice.due_at && (
                                                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                                        Vence: {invoice.due_at}
                                                    </p>
                                                )}
                                            </div>
                                            <span
                                                className={[
                                                    'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                                    invoiceStatusClass[invoice.status] ?? invoiceStatusClass.draft,
                                                ].join(' ')}
                                            >
                                                {invoiceStatusLabel[invoice.status] ?? invoice.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2.5 border-t border-[var(--color-border-subtle)]">
                                    <Link
                                        href="/invoices"
                                        className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                                    >
                                        Ver todas las facturas
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Next appointment highlight */}
                        {nextAppointment && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
                                    Tu próxima cita
                                </p>
                                <p className="text-sm font-semibold text-[var(--color-text)]">
                                    {nextAppointment.professional.name}
                                </p>
                                {nextAppointment.professional.specialty && (
                                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                                        {nextAppointment.professional.specialty}
                                    </p>
                                )}
                                <p className="text-xs text-[var(--color-text-muted)] mt-2 capitalize">
                                    {formatDateTime(nextAppointment.scheduled_at)}
                                </p>
                                <Link
                                    href={AppointmentShowAction.url(nextAppointment.id)}
                                    className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
                                >
                                    Ver detalles <ArrowRight size={12} />
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

PatientDashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
