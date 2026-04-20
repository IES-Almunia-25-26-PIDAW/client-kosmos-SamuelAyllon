import { Head, Link, router } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { EmptyState } from '@/components/empty-state';
import IndexAction from '@/actions/App/Http/Controllers/Appointment/IndexAction';
import ShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';

interface AppointmentItem {
    id: number;
    starts_at: string;
    ends_at: string | null;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    modality: string;
    patient: { id: number; name: string } | null;
    service: { id: number; name: string } | null;
}

interface Paginated {
    data: AppointmentItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    appointments: Paginated;
    filters: { status?: string; date?: string };
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    scheduled:   { label: 'Programada',    bg: 'bg-[var(--color-indigo-subtle)]',  text: 'text-[var(--color-indigo-fg)]',  dot: 'bg-[var(--color-indigo)]' },
    confirmed:   { label: 'Confirmada',    bg: 'bg-[var(--color-success-subtle)]', text: 'text-[var(--color-success-fg)]', dot: 'bg-[var(--color-success)]' },
    in_progress: { label: 'En curso',      bg: 'bg-[var(--color-warning-subtle)]', text: 'text-[var(--color-warning-fg)]', dot: 'bg-[var(--color-warning)]' },
    completed:   { label: 'Completada',    bg: 'bg-[var(--color-surface-alt)]',    text: 'text-[var(--color-text-secondary)]', dot: 'bg-[var(--color-text-muted)]' },
    cancelled:   { label: 'Cancelada',     bg: 'bg-[var(--color-error-subtle)]',   text: 'text-[var(--color-error-fg)]',   dot: 'bg-[var(--color-error)]' },
};

const modalityLabel: Record<string, string> = {
    presencial:   'Presencial',
    online:       'Online',
    videollamada: 'Videollamada',
    telefono:     'Teléfono',
};

const isOnline = (modality: string) =>
    ['online', 'videollamada', 'telefono'].includes(modality?.toLowerCase());

const formatDateTime = (dt: string) => {
    const date = new Date(dt);
    return {
        date: new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(date),
        time: new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date),
    };
};

const statusFilters = [
    { value: '', label: 'Todas' },
    { value: 'scheduled', label: 'Programadas' },
    { value: 'confirmed', label: 'Confirmadas' },
    { value: 'completed', label: 'Completadas' },
    { value: 'cancelled', label: 'Canceladas' },
];

export default function AppointmentsIndex({ appointments, filters }: Props) {
    const setFilter = (status: string) => {
        router.get(IndexAction.url(), { status: status || undefined, date: filters.date }, { preserveState: true });
    };

    return (
        <>
            <Head title="Citas — ClientKosmos" />

            <div className="flex flex-col gap-6 p-6 lg:p-8">

                {/* Header */}
                <div>
                    <h1 className="text-display-2xl text-[var(--color-text)]">Listado  de citas</h1>
                    <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">
                        Historial y gestión de todas tus citas
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                    {statusFilters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={[
                                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                                (filters.status ?? '') === f.value
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]',
                            ].join(' ')}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                {appointments.data.length === 0 ? (
                    <EmptyState
                        icon={CalendarDays}
                        title="Sin citas"
                        description="No hay citas que coincidan con los filtros seleccionados."
                    />
                ) : (
                    <div className="flex flex-col gap-2">
                        {appointments.data.map((appt) => {
                            const { date, time } = formatDateTime(appt.starts_at);
                            const cfg = statusConfig[appt.status] ?? statusConfig.scheduled;
                            const online = isOnline(appt.modality);

                            return (
                                <div
                                    key={appt.id}
                                    className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 hover:shadow-[var(--shadow-sm)] transition-shadow"
                                >
                                    {/* Status dot */}
                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />

                                    {/* Date + time */}
                                    <div className="w-28 shrink-0">
                                        <p className="text-xs font-medium text-[var(--color-text-secondary)] capitalize">{date}</p>
                                        <p className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-1 mt-0.5">
                                            <Clock size={12} className="text-[var(--color-text-muted)]" />
                                            {time}
                                        </p>
                                    </div>

                                    {/* Patient + service */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                                            {appt.patient?.name ?? 'Paciente'}
                                        </p>
                                        {appt.service && (
                                            <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
                                                {appt.service.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Modality badge */}
                                    <span
                                        className={[
                                            'shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                            online
                                                ? 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
                                                : 'bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]',
                                        ].join(' ')}
                                    >
                                        {modalityLabel[appt.modality?.toLowerCase()] ?? appt.modality ?? 'Presencial'}
                                    </span>

                                    {/* Status badge */}
                                    <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                                        {cfg.label}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                                            <Link
                                                href={ShowAction.url(appt.id)}
                                                className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                                            >
                                                Ver sesión
                                            </Link>
                                        )}
                                        {appt.patient && (
                                            <Link
                                                href={PatientShowAction.url(appt.patient.id)}
                                                className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors"
                                            >
                                                Ver ficha
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {appointments.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            {appointments.total} citas · Página {appointments.current_page} de {appointments.last_page}
                        </p>
                        <div className="flex gap-1">
                            {appointments.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={[
                                        'px-3 py-1 text-xs rounded-[var(--radius-sm)] transition-colors',
                                        link.active
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : link.url
                                                ? 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                                                : 'text-[var(--color-text-muted)] cursor-not-allowed',
                                    ].join(' ')}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AppointmentsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
