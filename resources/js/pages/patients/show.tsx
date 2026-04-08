import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle, FileText, Receipt, Shield } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PatientHeader } from '@/components/patient/patient-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import type { Agreement, ConsentForm, ConsultingSessionType, Document, Note, Patient, Payment } from '@/types';

interface Props {
    patient: Patient & {
        sessions: ConsultingSessionType[];
        notes: Note[];
        agreements: Agreement[];
        payments: Payment[];
        documents: Document[];
        consent_forms: ConsentForm[];
    };
}

type Tab = 'resumen' | 'acuerdos' | 'notas' | 'documentos' | 'cobros';

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

const formatDateTime = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

export default function PatientShow({ patient }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('resumen');

    const { data: noteData, setData: setNoteData, post: postNote, processing: savingNote, reset: resetNote } = useForm({
        content: '',
        type: 'quick_note' as const,
    });

    const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
        { key: 'resumen', label: 'Resumen', icon: FileText },
        { key: 'acuerdos', label: 'Acuerdos', icon: CheckCircle },
        { key: 'notas', label: 'Notas', icon: FileText },
        { key: 'documentos', label: 'Documentos', icon: Shield },
        { key: 'cobros', label: 'Cobros', icon: Receipt },
    ];

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        postNote(`/patients/${patient.id}/notes`, {
            onSuccess: () => resetNote(),
        });
    };

    return (
        <AppLayout>
            <Head title={`${patient.project_name} — ClientKosmos`} />

            <div className="flex flex-col">

                {/* Patient Header */}
                <PatientHeader patient={patient} />

                {/* Tabs */}
                <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 sticky top-[73px] z-[var(--z-sticky)]">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-[var(--duration-normal)] ${
                                    activeTab === tab.key
                                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                        : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 max-w-4xl">

                    {/* Tab Resumen */}
                    {activeTab === 'resumen' && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="space-y-4">
                                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                                    <h3 className="text-display-lg text-[var(--color-text)] mb-4">Datos del paciente</h3>
                                    <dl className="space-y-3">
                                        {patient.service_scope && (
                                            <div>
                                                <dt className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Motivo de consulta</dt>
                                                <dd className="text-sm text-[var(--color-text)] mt-0.5">{patient.service_scope}</dd>
                                            </div>
                                        )}
                                        {patient.brand_tone && (
                                            <div>
                                                <dt className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Enfoque terapéutico</dt>
                                                <dd className="text-sm text-[var(--color-text)] mt-0.5">{patient.brand_tone}</dd>
                                            </div>
                                        )}
                                        {patient.next_deadline && (
                                            <div>
                                                <dt className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Próxima sesión</dt>
                                                <dd className="text-sm text-[var(--color-text)] mt-0.5">{formatDate(patient.next_deadline)}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                                <div className="flex gap-3">
                                    <Link href={`/patients/${patient.id}/pre-session`}>
                                        <Button variant="primary" size="md">Preparar sesión</Button>
                                    </Link>
                                    <Link href={`/patients/${patient.id}/post-session`}>
                                        <Button variant="secondary" size="md">Al terminar</Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {patient.sessions.slice(0, 3).length > 0 && (
                                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                                        <h3 className="text-display-lg text-[var(--color-text)] px-5 pt-5 pb-3">Últimas sesiones</h3>
                                        {patient.sessions.slice(0, 3).map((session) => (
                                            <div key={session.id} className="px-5 py-3 border-t border-[var(--color-border-subtle)]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-[var(--color-text)]">
                                                        {formatDateTime(session.scheduled_at)}
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]">
                                                        {session.duration_minutes ?? 50} min
                                                    </span>
                                                </div>
                                                {session.ai_summary && (
                                                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                                                        {session.ai_summary}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab Acuerdos */}
                    {activeTab === 'acuerdos' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-display-lg text-[var(--color-text)]">Acuerdos terapéuticos</h3>
                            </div>
                            {patient.agreements.length === 0 ? (
                                <EmptyState
                                    icon={CheckCircle}
                                    title="Sin acuerdos"
                                    description="Los acuerdos terapéuticos aparecerán aquí."
                                />
                            ) : (
                                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)] divide-y divide-[var(--color-border-subtle)]">
                                    {patient.agreements.map((agreement) => (
                                        <div key={agreement.id} className="flex items-start gap-3 p-4">
                                            <input
                                                type="checkbox"
                                                checked={agreement.is_completed}
                                                onChange={() => router.patch(`/patients/${patient.id}/agreements/${agreement.id}`, {
                                                    is_completed: !agreement.is_completed,
                                                })}
                                                className="mt-1 h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
                                            />
                                            <div className="flex-1">
                                                <p className={`text-sm text-[var(--color-text)] ${agreement.is_completed ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                                                    {agreement.content}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-muted)] mt-1">{formatDate(agreement.created_at)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Notas */}
                    {activeTab === 'notas' && (
                        <div className="space-y-4">
                            <h3 className="text-display-lg text-[var(--color-text)]">Notas de sesión</h3>
                            <form onSubmit={submitNote}>
                                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-[var(--duration-normal)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
                                    <textarea
                                        value={noteData.content}
                                        onChange={(e) => setNoteData('content', e.target.value)}
                                        placeholder="Escribe una nota rápida…"
                                        className="w-full min-h-[80px] px-3 py-2 bg-transparent resize-y text-[var(--color-text)] text-base placeholder:text-[var(--color-text-muted)] focus:outline-none"
                                    />
                                    {noteData.content && (
                                        <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--color-border-subtle)]">
                                            <span className="text-xs text-[var(--color-text-muted)]">{noteData.content.length} caracteres</span>
                                            <Button type="submit" size="sm" variant="primary" loading={savingNote}>
                                                Guardar nota
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </form>

                            {patient.notes.length === 0 ? (
                                <EmptyState
                                    icon={FileText}
                                    title="Sin notas todavía"
                                    description="Aquí irán tus notas de sesión y observaciones clave."
                                />
                            ) : (
                                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)] divide-y divide-[var(--color-border-subtle)]">
                                    {patient.notes.map((note) => (
                                        <div key={note.id} className="p-4">
                                            <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">{note.content}</p>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-2">{formatDate(note.created_at)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Documentos */}
                    {activeTab === 'documentos' && (
                        <div className="space-y-4">
                            <h3 className="text-display-lg text-[var(--color-text)]">Documentos</h3>
                            {patient.documents.length === 0 ? (
                                <EmptyState
                                    icon={Shield}
                                    title="Sin documentos"
                                    description="Guarda aquí los consentimientos RGPD, informes y documentos del paciente."
                                />
                            ) : (
                                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)] divide-y divide-[var(--color-border-subtle)]">
                                    {patient.documents.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-4">
                                            <div>
                                                <p className="text-sm font-medium text-[var(--color-text)]">{doc.name}</p>
                                                <p className="text-xs text-[var(--color-text-muted)]">{formatDate(doc.created_at)}</p>
                                            </div>
                                            {doc.is_rgpd && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-indigo-subtle)] text-[var(--color-indigo-fg)]">
                                                    RGPD
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Cobros */}
                    {activeTab === 'cobros' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-display-lg text-[var(--color-text)]">Cobros</h3>
                            </div>
                            {patient.payments.length === 0 ? (
                                <EmptyState
                                    icon={Receipt}
                                    title="Sin cobros registrados"
                                    description="Aquí verás el historial de pagos de este paciente."
                                />
                            ) : (
                                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)]">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Fecha</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Concepto</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Importe</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--color-border-subtle)]">
                                            {patient.payments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-[var(--color-surface-alt)] transition-colors">
                                                    <td className="px-4 py-3 text-[var(--color-text)]">{formatDate(payment.due_date)}</td>
                                                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{payment.concept ?? 'Sesión'}</td>
                                                    <td className="px-4 py-3 text-right font-medium text-[var(--color-text)] font-variant-numeric: tabular-nums">
                                                        €{Number(payment.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge status={payment.status as 'paid' | 'pending' | 'overdue'} variant="subtle" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
