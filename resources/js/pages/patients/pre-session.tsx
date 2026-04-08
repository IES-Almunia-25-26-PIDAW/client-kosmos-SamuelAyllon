import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { KosmoBriefing as KosmoBriefingComponent } from '@/components/kosmo/kosmo-briefing';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import type { Agreement, ConsultingSessionType, KosmoBriefing, Note, Patient, Payment, ConsentForm } from '@/types';

interface SessionContext {
    lastSessions: ConsultingSessionType[];
    recentNotes: Note[];
    openAgreements: Agreement[];
    lastPayment: Payment | null;
    validConsent: ConsentForm | null;
}

interface Props {
    patient: Patient;
    context: SessionContext;
    briefing: KosmoBriefing | null;
}

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

const formatDateTime = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

export default function PreSession({ patient, context, briefing }: Props) {
    return (
        <AppLayout>
            <Head title={`Pre-sesión: ${patient.project_name} — ClientKosmos`} />

            <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-4xl">

                {/* Back + Header */}
                <div>
                    <Link
                        href={`/patients/${patient.id}`}
                        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-4"
                    >
                        <ArrowLeft size={16} />
                        Volver a {patient.project_name}
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-display-2xl text-[var(--color-text)]">Preparar sesión</h1>
                            <p className="text-body-md text-[var(--color-text-secondary)] mt-1">{patient.project_name}</p>
                        </div>
                        <div className="flex gap-2">
                            {patient.statuses?.map((s) => (
                                <StatusBadge key={s} status={s} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Left column */}
                    <div className="space-y-5">

                        {/* Kosmo briefing */}
                        {briefing && (
                            <KosmoBriefingComponent
                                title="Kosmo te recuerda"
                                content={
                                    <div className="space-y-2">
                                        {Object.entries(briefing.content).map(([k, v]) => (
                                            <p key={k} className="text-sm text-[var(--color-text-secondary)]">{String(v)}</p>
                                        ))}
                                    </div>
                                }
                            />
                        )}

                        {/* Last sessions */}
                        {context.lastSessions.length > 0 && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                                <h3 className="text-display-lg text-[var(--color-text)] mb-4">Últimas sesiones</h3>
                                <div className="space-y-2">
                                    {context.lastSessions.map((session) => (
                                        <div key={session.id} className="flex items-center justify-between py-2 border-t border-[var(--color-border-subtle)] first:border-0">
                                            <span className="text-sm font-medium text-[var(--color-text)]">
                                                {formatDateTime(session.scheduled_at)}
                                            </span>
                                            <span className="text-xs text-[var(--color-text-secondary)]">
                                                {session.duration_minutes ?? 50} min
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent notes */}
                        {context.recentNotes.length > 0 && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                                <h3 className="text-display-lg text-[var(--color-text)] mb-4">Notas recientes</h3>
                                <div className="space-y-3">
                                    {context.recentNotes.map((note) => (
                                        <div key={note.id} className="border-l-2 border-[var(--color-border)] pl-3">
                                            <p className="text-sm text-[var(--color-text)] line-clamp-3">{note.content}</p>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-1">{formatDate(note.created_at)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column */}
                    <div className="space-y-5">

                        {/* Open agreements */}
                        {context.openAgreements.length > 0 && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-orange)] bg-[var(--color-orange-subtle)] p-5">
                                <h3 className="text-display-lg text-[var(--color-text)] mb-4 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[var(--color-orange)]" />
                                    Acuerdos pendientes
                                </h3>
                                <ul className="space-y-2">
                                    {context.openAgreements.map((a) => (
                                        <li key={a.id} className="text-sm text-[var(--color-text)]">• {a.content}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Payment status */}
                        {context.lastPayment && context.lastPayment.status !== 'paid' && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-warning)] bg-[var(--color-warning-subtle)] p-5">
                                <h3 className="text-display-lg text-[var(--color-text)] mb-2">Cobro pendiente</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    €{Number(context.lastPayment.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })} —
                                    vencimiento {formatDate(context.lastPayment.due_date)}
                                </p>
                            </div>
                        )}

                        {/* No consent warning */}
                        {!patient.has_valid_consent && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-indigo)] bg-[var(--color-indigo-subtle)] p-5">
                                <h3 className="text-display-lg text-[var(--color-text)] mb-2">Sin consentimiento RGPD</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Este paciente no tiene un consentimiento informado firmado activo.
                                </p>
                            </div>
                        )}

                        {/* Motivo de consulta */}
                        {patient.service_scope && (
                            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                                <h3 className="text-display-lg text-[var(--color-text)] mb-2">Motivo de consulta</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">{patient.service_scope}</p>
                                {patient.brand_tone && (
                                    <p className="text-xs text-[var(--color-text-muted)] mt-2">
                                        Enfoque: {patient.brand_tone}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Cuando la sesión termine, registra el cierre desde el botón de la derecha.
                    </p>
                    <Link href={`/patients/${patient.id}/post-session`}>
                        <Button variant="primary">
                            <Sparkles size={16} className="mr-2" />
                            Cerrar sesión
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
