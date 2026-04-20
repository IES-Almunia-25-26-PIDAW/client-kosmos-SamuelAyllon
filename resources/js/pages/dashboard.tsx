import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { ArrowRight, CalendarDays, FileText, Receipt } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { KosmoBriefing as KosmoBriefingComponent } from '@/components/kosmo/kosmo-briefing';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';
import AppointmentShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import type { Auth, KosmoBriefing } from '@/types';

interface DashboardStats {
    sessions_today: number;
    appointments_this_week: number;
    pending_invoices: number;
    active_patients: number;
    collection_rate: number;
}

interface TodayAppointment {
    id: number;
    scheduled_at: string;
    modality: string;
    status: string;
    session_number: number;
    total_sessions: number;
    patient: {
        id: number;
        patient_user_id: number;
        name: string;
        avatar_path: string | null;
    };
    service_name: string | null;
}

interface PendingPayment {
    id: number;
    patient_id: number;
    patient_name: string;
    amount: number;
    status: 'sent' | 'overdue';
    due_at: string | null;
    hours_since_due: number | null;
}

interface AlertPatient {
    id: number;
    project_name: string;
    payment_status?: string;
}

interface Props {
    activePatients: { id: number; user_id: number; user?: { id: number; name: string } }[];
    todayAppointments: TodayAppointment[];
    pendingPayments: PendingPayment[];
    alerts: {
        invoice: AlertPatient[];
        consent: AlertPatient[];
    };
    dailyBriefing: KosmoBriefing | null;
    stats: DashboardStats;
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

const formatTime = (dt: string): { time: string; period: string } => {
    const date = new Date(dt);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours < 12 ? 'AM' : 'PM';
    const displayHour = hours % 12 || 12;
    return { time: `${displayHour.toString().padStart(2, '0')}:${minutes}`, period };
};

const getModalityLabel = (modality: string): string => {
    const map: Record<string, string> = {
        presencial: 'Presencial',
        online: 'Online',
        videollamada: 'Videollamada',
        telefono: 'Teléfono',
    };
    return map[modality?.toLowerCase()] ?? modality ?? 'Presencial';
};

const isOnlineModality = (modality: string): boolean =>
    ['online', 'videollamada', 'telefono'].includes(modality?.toLowerCase());

const getPaymentLabel = (payment: PendingPayment): string => {
    if (payment.status === 'overdue') {
        return payment.hours_since_due
            ? `Pago vencido (${payment.hours_since_due}h)`
            : 'Pago vencido';
    }
    if (payment.hours_since_due && payment.hours_since_due >= 48) {
        return `Cobro pendiente (${payment.hours_since_due}h)`;
    }
    return 'Cobro pendiente';
};

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
};

export default function Dashboard({
    todayAppointments,
    pendingPayments,
    alerts,
    dailyBriefing,
    stats,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const allPendingAlerts = [
        ...pendingPayments.map((p) => ({
            id: p.id,
            patientId: p.patient_id,
            name: p.patient_name,
            label: getPaymentLabel(p),
            isOverdue: p.status === 'overdue',
            type: 'invoice' as const,
        })),
        ...alerts.consent.slice(0, 3 - pendingPayments.length).map((p) => ({
            id: p.id,
            patientId: p.id,
            name: p.project_name,
            label: 'Falta consentimiento',
            isOverdue: false,
            type: 'consent' as const,
        })),
    ].slice(0, 4);

    return (
        <>
            <Head title="Hoy — ClientKosmos" />

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

                {/* Kosmo Daily Briefing */}
                {dailyBriefing && (
                    <KosmoBriefingComponent
                        title="Tu día de un vistazo"
                        content={
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                {typeof dailyBriefing.content === 'object' && 'summary' in dailyBriefing.content
                                    ? String(dailyBriefing.content.summary)
                                    : JSON.stringify(dailyBriefing.content)}
                            </p>
                        }
                    />
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* === MAIN COLUMN: Agenda === */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-display-lg text-[var(--color-text)]">Agenda del día</h2>
                            <Link
                                href="/appointments"
                                className="text-sm font-medium text-[var(--color-primary)] hover:underline flex items-center gap-1"
                            >
                                Ver todas las citas <ArrowRight size={14} />
                            </Link>
                        </div>

                        {todayAppointments.length === 0 ? (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-10 text-center">
                                <CalendarDays size={32} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    No hay sesiones programadas para hoy.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {todayAppointments.map((session, index) => {
                                    const isNext = index === 0;
                                    const { time, period } = formatTime(session.scheduled_at);
                                    const isOnline = isOnlineModality(session.modality);

                                    return (
                                        <div
                                            key={session.id}
                                            className={[
                                                'flex items-center gap-4 rounded-[var(--radius-lg)] border bg-[var(--color-surface)] p-4 transition-shadow',
                                                isNext
                                                    ? 'border-[var(--color-primary)] shadow-[var(--shadow-sm)]'
                                                    : 'border-[var(--color-border)] hover:shadow-[var(--shadow-sm)]',
                                            ].join(' ')}
                                        >
                                            {/* Status dot */}
                                            <span
                                                className={[
                                                    'w-2.5 h-2.5 rounded-full shrink-0',
                                                    isNext
                                                        ? 'bg-[var(--color-primary)]'
                                                        : 'bg-[var(--color-text-muted)]',
                                                ].join(' ')}
                                            />

                                            {/* Time */}
                                            <div className="w-14 shrink-0 text-center">
                                                <p className="text-sm font-semibold leading-none text-[var(--color-text)]">
                                                    {time}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{period}</p>
                                            </div>

                                            {/* Session info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                                                    {session.patient.name}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                                                    {session.service_name
                                                        ? `${session.service_name} • Sesión ${session.session_number}/${session.total_sessions}`
                                                        : `Sesión ${session.session_number}/${session.total_sessions}`}
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
                                                        {getModalityLabel(session.modality)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            {isNext ? (
                                                <Link
                                                    href={AppointmentShowAction.url(session.id)}
                                                    className="shrink-0 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                                                >
                                                    Preparar sesión
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={PatientShowAction.url(session.patient.id)}
                                                    className="shrink-0 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors"
                                                >
                                                    Ver ficha
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* === SIDEBAR COLUMN === */}
                    <div className="flex flex-col gap-4">

                        {/* Cobros pendientes */}
                        {allPendingAlerts.length > 0 && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                                <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                                        Cobros pendientes
                                    </p>
                                </div>
                                <div className="divide-y divide-[var(--color-border-subtle)]">
                                    {allPendingAlerts.map((alert) => (
                                        <Link
                                            key={`${alert.type}-${alert.id}`}
                                            href={PatientShowAction.url(alert.patientId)}
                                            className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-surface-alt)] transition-colors"
                                        >
                                            <div className="flex items-start gap-2.5 min-w-0">
                                                <span className="mt-1 w-2 h-2 rounded-full shrink-0 bg-[var(--color-error)]" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[var(--color-text)] truncate">
                                                        {alert.name}
                                                    </p>
                                                    <p
                                                        className={[
                                                            'text-[10px] font-semibold uppercase tracking-wide mt-0.5',
                                                            alert.isOverdue
                                                                ? 'text-[var(--color-error-fg)]'
                                                                : 'text-[var(--color-warning-fg)]',
                                                        ].join(' ')}
                                                    >
                                                        {alert.label}
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight
                                                size={16}
                                                className="shrink-0 text-[var(--color-text-muted)] ml-2"
                                            />
                                        </Link>
                                    ))}
                                </div>
                                <div className="px-4 py-2.5 border-t border-[var(--color-border-subtle)]">
                                    <Link
                                        href="/invoices"
                                        className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                                    >
                                        Ver todo el historial
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* KPI: Sesiones hoy */}
                        <div className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] p-5 flex items-center justify-between shadow-[var(--shadow-sm)]">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                                    Sesiones hoy
                                </p>
                                <p className="text-kpi font-bold text-white mt-1 leading-none">
                                    {stats.sessions_today.toString().padStart(2, '0')}
                                </p>
                            </div>
                            <div className="rounded-[var(--radius-md)] bg-white/15 p-2.5">
                                <CalendarDays size={22} className="text-white" />
                            </div>
                        </div>

                        {/* KPI: Pendientes */}
                        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex items-center justify-between shadow-[var(--shadow-sm)]">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                                    Pendientes
                                </p>
                                <p className="text-kpi font-bold text-[var(--color-text)] mt-1 leading-none">
                                    {Number(stats.pending_invoices).toLocaleString('es-ES', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} €
                                </p>
                                {allPendingAlerts.length > 0 && (
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                        {allPendingAlerts.length}{' '}
                                        {allPendingAlerts.length === 1 ? 'factura' : 'facturas'}
                                    </p>
                                )}
                            </div>
                            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] p-2.5">
                                <Receipt size={22} className="text-[var(--color-text-secondary)]" />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
