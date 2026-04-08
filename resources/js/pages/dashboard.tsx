import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, CalendarDays, Sparkles } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { KosmoBriefing as KosmoBriefingComponent } from '@/components/kosmo/kosmo-briefing';
import { KPICard } from '@/components/patient/kpi-card';
import { PatientCard } from '@/components/patient/patient-card';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Auth, KosmoBriefing, Patient } from '@/types';

interface DashboardStats {
    sessions_this_week: number;
    pending_payments: number;
    active_patients: number;
    collection_rate: number;
}

interface DashboardAlerts {
    payment: Pick<Patient, 'id' | 'project_name' | 'payment_status'>[];
    consent: Pick<Patient, 'id' | 'project_name'>[];
}

interface TodaySession {
    id: number;
    scheduled_at: string;
    patient: Pick<Patient, 'id' | 'project_name' | 'brand_tone' | 'payment_status' | 'has_valid_consent' | 'has_open_agreement' | 'statuses'>;
}

interface Props {
    activePatients: Patient[];
    todaySessions: TodaySession[];
    alerts: DashboardAlerts;
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
    new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

const formatTime = (dt: string): string =>
    new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(dt));

export default function Dashboard({ activePatients, todaySessions, alerts, dailyBriefing, stats }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const hasAlerts = alerts.payment.length > 0 || alerts.consent.length > 0;

    return (
        <AppLayout>
            <Head title="Hoy — ClientKosmos" />

            <div className="flex flex-col gap-8 p-6 lg:p-8">

                {/* Header */}
                <div>
                    <h1 className="text-display-2xl text-[var(--color-text)]">
                        {greeting()}, {auth.user.name.split(' ')[0]}
                    </h1>
                    <p className="mt-1 text-body-md text-[var(--color-text-secondary)] capitalize">
                        {formatDate()}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Main column */}
                    <div className="space-y-6 lg:col-span-2">

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

                        {/* Today's agenda */}
                        <div>
                            <h2 className="text-display-lg text-[var(--color-text)] mb-4 flex items-center gap-2">
                                <CalendarDays size={20} className="text-[var(--color-primary)]" />
                                Agenda de hoy
                            </h2>
                            {todaySessions.length === 0 ? (
                                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-8 text-center">
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        No hay sesiones programadas para hoy. ¡Disfruta el descanso!
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)] divide-y divide-[var(--color-border-subtle)]">
                                    {todaySessions.map((session) => (
                                        <div key={session.id} className="flex items-center justify-between p-4 hover:bg-[var(--color-surface-alt)] transition-colors duration-[var(--duration-normal)]">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-[var(--color-text-secondary)] w-12 shrink-0">
                                                    {formatTime(session.scheduled_at)}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-[var(--color-text)]">
                                                        {session.patient.project_name}
                                                    </p>
                                                    {session.patient.brand_tone && (
                                                        <p className="text-xs text-[var(--color-text-secondary)]">
                                                            {session.patient.brand_tone}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    {session.patient.statuses?.map((s) => (
                                                        <StatusBadge key={s} status={s} variant="subtle" />
                                                    ))}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/patients/${session.patient.id}/pre-session`}
                                                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                                            >
                                                Preparar sesión →
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Sidebar column */}
                    <div className="space-y-6">

                        {/* Alerts */}
                        {hasAlerts && (
                            <div>
                                <h2 className="text-display-lg text-[var(--color-text)] mb-4 flex items-center gap-2">
                                    <AlertTriangle size={20} className="text-[var(--color-warning)]" />
                                    Necesita atención
                                </h2>
                                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)] divide-y divide-[var(--color-border-subtle)]">
                                    {alerts.payment.map((p) => (
                                        <Link key={p.id} href={`/patients/${p.id}`} className="flex items-center justify-between p-3 hover:bg-[var(--color-surface-alt)] transition-colors">
                                            <span className="text-sm text-[var(--color-text)]">{p.project_name}</span>
                                            <StatusBadge status={p.payment_status as 'pending' | 'overdue'} variant="subtle" />
                                        </Link>
                                    ))}
                                    {alerts.consent.map((p) => (
                                        <Link key={p.id} href={`/patients/${p.id}`} className="flex items-center justify-between p-3 hover:bg-[var(--color-surface-alt)] transition-colors">
                                            <span className="text-sm text-[var(--color-text)]">{p.project_name}</span>
                                            <StatusBadge status="noConsent" variant="subtle" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* KPIs */}
                        <div>
                            <h2 className="text-display-lg text-[var(--color-text)] mb-4 flex items-center gap-2">
                                <Sparkles size={20} className="text-[var(--color-kosmo)]" />
                                Esta semana
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                <KPICard label="Sesiones" value={stats.sessions_this_week} />
                                <KPICard label="Cobros pendientes" value={`€${stats.pending_payments.toLocaleString('es-ES')}`} />
                                <KPICard label="Pacientes activos" value={stats.active_patients} />
                                <KPICard label="Tasa de cobro" value={`${stats.collection_rate}%`} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Active patients quick access */}
                {activePatients.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-display-lg text-[var(--color-text)]">Mis pacientes</h2>
                            <Link href="/patients" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                                Ver todos →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {activePatients.slice(0, 6).map((patient) => (
                                <PatientCard key={patient.id} patient={patient} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
