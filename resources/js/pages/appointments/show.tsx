import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { ArrowLeft, CalendarDays, Clock, MapPin, Video, FileText, CheckSquare } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Dashboard/IndexAction';

interface User {
    id: number;
    name: string;
    email: string;
    avatar_path: string | null;
}

interface Service {
    id: number;
    name: string;
    duration_minutes: number;
    price: string;
}

interface NoteItem {
    id: number;
    content: string;
    type: string;
    is_ai_generated: boolean;
    created_at: string;
}

interface AgreementItem {
    id: number;
    content: string;
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
}

interface InvoiceItem {
    id: number;
    quantity: number;
    unit_price: string;
    total: string;
    description: string | null;
    invoice: { id: number; invoice_number: string; status: string } | null;
}

interface Appointment {
    id: number;
    starts_at: string;
    ends_at: string | null;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    modality: string;
    meeting_url: string | null;
    cancellation_reason: string | null;
    patient: User | null;
    professional: User | null;
    service: Service | null;
    notes: NoteItem[];
    agreements: AgreementItem[];
    invoice_items: InvoiceItem[];
}

interface Props {
    appointment: Appointment;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    scheduled:   { label: 'Programada',  bg: 'bg-[var(--color-indigo-subtle)]',  text: 'text-[var(--color-indigo-fg)]' },
    confirmed:   { label: 'Confirmada',  bg: 'bg-[var(--color-success-subtle)]', text: 'text-[var(--color-success-fg)]' },
    in_progress: { label: 'En curso',    bg: 'bg-[var(--color-warning-subtle)]', text: 'text-[var(--color-warning-fg)]' },
    completed:   { label: 'Completada',  bg: 'bg-[var(--color-surface-alt)]',    text: 'text-[var(--color-text-secondary)]' },
    cancelled:   { label: 'Cancelada',   bg: 'bg-[var(--color-error-subtle)]',   text: 'text-[var(--color-error-fg)]' },
};

const modalityLabel: Record<string, string> = {
    presencial:   'Presencial',
    online:       'Online',
    videollamada: 'Videollamada',
    telefono:     'Teléfono',
};

const noteTypeLabel: Record<string, string> = {
    quick_note:   'Nota rápida',
    session_note: 'Nota de sesión',
    observation:  'Observación',
    followup:     'Seguimiento',
};

const formatDateTime = (dt: string) =>
    new Intl.DateTimeFormat('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(dt));

const formatTime = (dt: string) =>
    new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(dt));

const formatShort = (dt: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dt));

const isOnline = (modality: string) =>
    ['online', 'videollamada', 'telefono'].includes(modality?.toLowerCase());

export default function AppointmentShow({ appointment }: Props) {
    const cfg = statusConfig[appointment.status] ?? statusConfig.scheduled;
    const online = isOnline(appointment.modality);

    return (
        <>
            <Head title={`Sesión — ${appointment.patient?.name ?? 'Paciente'}`} />

            <div className="flex flex-col gap-6 p-6 lg:p-8">

                {/* Back + header */}
                <div>
                    <Link
                        href={DashboardIndexAction.url()}
                        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors mb-3"
                    >
                        <ArrowLeft size={16} />
                        Volver al dashboard
                    </Link>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-display-2xl text-[var(--color-text)]">
                                Sesión con {appointment.patient?.name ?? 'Paciente'}
                            </h1>
                            <p className="mt-0.5 text-body-md text-[var(--color-text-secondary)] capitalize">
                                {formatDateTime(appointment.starts_at)}
                            </p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Main column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Session info card */}
                        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                            <h2 className="text-display-lg text-[var(--color-text)] mb-4">Detalles de la sesión</h2>
                            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div>
                                    <dt className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide flex items-center gap-1">
                                        <CalendarDays size={12} /> Fecha
                                    </dt>
                                    <dd className="mt-1 text-sm font-medium text-[var(--color-text)]">
                                        {formatShort(appointment.starts_at)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide flex items-center gap-1">
                                        <Clock size={12} /> Hora
                                    </dt>
                                    <dd className="mt-1 text-sm font-medium text-[var(--color-text)]">
                                        {formatTime(appointment.starts_at)}
                                        {appointment.ends_at && ` – ${formatTime(appointment.ends_at)}`}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide flex items-center gap-1">
                                        {online ? <Video size={12} /> : <MapPin size={12} />}
                                        Modalidad
                                    </dt>
                                    <dd className="mt-1">
                                        <span
                                            className={[
                                                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
                                                online
                                                    ? 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
                                                    : 'bg-[var(--color-success-subtle)] text-[var(--color-success-fg)]',
                                            ].join(' ')}
                                        >
                                            {modalityLabel[appointment.modality?.toLowerCase()] ?? appointment.modality}
                                        </span>
                                    </dd>
                                </div>
                                {appointment.service && (
                                    <div className="col-span-2 sm:col-span-3">
                                        <dt className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                            Servicio
                                        </dt>
                                        <dd className="mt-1 text-sm font-medium text-[var(--color-text)]">
                                            {appointment.service.name}
                                            {appointment.service.duration_minutes && (
                                                <span className="ml-2 text-[var(--color-text-secondary)]">
                                                    · {appointment.service.duration_minutes} min
                                                </span>
                                            )}
                                        </dd>
                                    </div>
                                )}
                                {appointment.meeting_url && online && (
                                    <div className="col-span-2 sm:col-span-3">
                                        <dt className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                            Enlace de videollamada
                                        </dt>
                                        <dd className="mt-1">
                                            <a
                                                href={appointment.meeting_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-[var(--color-primary)] hover:underline break-all"
                                            >
                                                {appointment.meeting_url}
                                            </a>
                                        </dd>
                                    </div>
                                )}
                                {appointment.cancellation_reason && (
                                    <div className="col-span-2 sm:col-span-3">
                                        <dt className="text-xs font-medium text-[var(--color-error-fg)] uppercase tracking-wide">
                                            Motivo de cancelación
                                        </dt>
                                        <dd className="mt-1 text-sm text-[var(--color-text-secondary)]">
                                            {appointment.cancellation_reason}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Notes */}
                        {appointment.notes.length > 0 && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                                <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border-subtle)]">
                                    <FileText size={16} className="text-[var(--color-primary)]" />
                                    <h2 className="text-display-lg text-[var(--color-text)]">Notas</h2>
                                </div>
                                <div className="divide-y divide-[var(--color-border-subtle)]">
                                    {appointment.notes.map((note) => (
                                        <div key={note.id} className="px-5 py-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                                                    {noteTypeLabel[note.type] ?? note.type}
                                                </span>
                                                <span className="text-xs text-[var(--color-text-muted)]">
                                                    {formatShort(note.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">
                                                {note.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Agreements */}
                        {appointment.agreements.length > 0 && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                                <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-border-subtle)]">
                                    <CheckSquare size={16} className="text-[var(--color-primary)]" />
                                    <h2 className="text-display-lg text-[var(--color-text)]">Acuerdos</h2>
                                </div>
                                <div className="divide-y divide-[var(--color-border-subtle)]">
                                    {appointment.agreements.map((agreement) => (
                                        <div key={agreement.id} className="flex items-start gap-3 px-5 py-4">
                                            <span
                                                className={[
                                                    'mt-0.5 w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center',
                                                    agreement.is_completed
                                                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                                                        : 'border-[var(--color-border)]',
                                                ].join(' ')}
                                            >
                                                {agreement.is_completed && (
                                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                                                        <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${agreement.is_completed ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'}`}>
                                                    {agreement.content}
                                                </p>
                                                {agreement.completed_at && (
                                                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                                        Completado {formatShort(agreement.completed_at)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-4">

                        {/* Patient card */}
                        {appointment.patient && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                                    Paciente
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                                        <span className="text-sm font-semibold text-white">
                                            {appointment.patient.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                                            {appointment.patient.name}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-secondary)] truncate">
                                            {appointment.patient.email}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={PatientShowAction.url(appointment.patient.id)}
                                    className="mt-3 block w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-center text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors"
                                >
                                    Ver ficha completa
                                </Link>
                            </div>
                        )}

                        {/* Invoice items */}
                        {appointment.invoice_items.length > 0 && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                                <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                                        Facturación
                                    </p>
                                </div>
                                <div className="divide-y divide-[var(--color-border-subtle)]">
                                    {appointment.invoice_items.map((item) => (
                                        <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-xs text-[var(--color-text)] truncate">
                                                    {item.description ?? 'Servicio'}
                                                </p>
                                                {item.invoice && (
                                                    <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                                                        {item.invoice.invoice_number}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-[var(--color-text)] shrink-0 tabular-nums">
                                                €{Number(item.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

AppointmentShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
