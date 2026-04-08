import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { ConsultingSessionType, Patient, Payment } from '@/types';

interface Props {
    patient: Patient;
    lastSession: ConsultingSessionType | null;
    lastPayment: Payment | null;
}

interface NoteForm {
    content: string;
    type: string;
    [key: string]: string;
}

interface AgreementForm {
    content: string;
    [key: string]: string;
}

interface PaymentForm {
    amount: string;
    due_date: string;
    concept: string;
    payment_method: string;
    [key: string]: string;
}

export default function PostSession({ patient, lastSession }: Props) {
    const noteForm = useForm<NoteForm>({ content: '', type: 'session_note' });
    const agreementForm = useForm<AgreementForm>({ content: '' });
    const paymentForm = useForm<PaymentForm>({
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        concept: 'Sesión de psicología',
        payment_method: '',
    });

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        noteForm.post(`/patients/${patient.id}/notes`, { onSuccess: () => noteForm.reset() });
    };

    const submitAgreement = (e: React.FormEvent) => {
        e.preventDefault();
        agreementForm.post(`/patients/${patient.id}/agreements`, { onSuccess: () => agreementForm.reset() });
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(`/patients/${patient.id}/payments`, { onSuccess: () => paymentForm.reset() });
    };

    return (
        <AppLayout>
            <Head title={`Post-sesión: ${patient.project_name} — ClientKosmos`} />

            <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-4xl">

                <div>
                    <Link
                        href={`/patients/${patient.id}`}
                        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-4"
                    >
                        <ArrowLeft size={16} />
                        Volver a {patient.project_name}
                    </Link>
                    <h1 className="text-display-2xl text-[var(--color-text)]">Cerrar sesión</h1>
                    <p className="text-body-md text-[var(--color-text-secondary)] mt-1">{patient.project_name}</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Note */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                        <h3 className="text-display-lg text-[var(--color-text)] mb-4">Nota de sesión</h3>
                        <form onSubmit={submitNote} className="space-y-3">
                            <textarea
                                value={noteForm.data.content}
                                onChange={(e) => noteForm.setData('content', e.target.value)}
                                placeholder="¿Qué has trabajado en esta sesión? Observaciones clave, avances, puntos a seguir…"
                                className="w-full min-h-[120px] px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-base resize-y focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow] duration-[var(--duration-normal)] placeholder:text-[var(--color-text-muted)]"
                            />
                            <Button type="submit" variant="primary" size="sm" loading={noteForm.processing} disabled={!noteForm.data.content}>
                                Guardar nota
                            </Button>
                        </form>
                    </div>

                    {/* Agreement */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                        <h3 className="text-display-lg text-[var(--color-text)] mb-4">Acuerdo de la sesión</h3>
                        <form onSubmit={submitAgreement} className="space-y-3">
                            <textarea
                                value={agreementForm.data.content}
                                onChange={(e) => agreementForm.setData('content', e.target.value)}
                                placeholder="¿Qué se acordó hacer antes de la próxima sesión? Tarea, compromiso, reflexión…"
                                className="w-full min-h-[120px] px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-base resize-y focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow] duration-[var(--duration-normal)] placeholder:text-[var(--color-text-muted)]"
                            />
                            <Button type="submit" variant="secondary" size="sm" loading={agreementForm.processing} disabled={!agreementForm.data.content}>
                                Registrar acuerdo
                            </Button>
                        </form>
                    </div>

                    {/* Payment */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] lg:col-span-2">
                        <h3 className="text-display-lg text-[var(--color-text)] mb-4">Registrar cobro</h3>
                        <form onSubmit={submitPayment} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-1.5">
                                <Label className="text-label text-[var(--color-text)]">Importe (€)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={paymentForm.data.amount}
                                    onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                    placeholder="60.00"
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-label text-[var(--color-text)]">Fecha vencimiento</Label>
                                <Input
                                    type="date"
                                    value={paymentForm.data.due_date}
                                    onChange={(e) => paymentForm.setData('due_date', e.target.value)}
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-label text-[var(--color-text)]">Método de pago</Label>
                                <select
                                    value={paymentForm.data.payment_method}
                                    onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                    className="w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-base focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                >
                                    <option value="">Sin especificar</option>
                                    <option value="cash">Efectivo</option>
                                    <option value="bizum">Bizum</option>
                                    <option value="transfer">Transferencia</option>
                                    <option value="card">Tarjeta</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full h-10"
                                    loading={paymentForm.processing}
                                    disabled={!paymentForm.data.amount || !paymentForm.data.due_date}
                                >
                                    Registrar cobro
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Done */}
                <div className="flex justify-end pt-4 border-t border-[var(--color-border-subtle)]">
                    <Link href={`/patients/${patient.id}`}>
                        <Button variant="secondary">Terminar y volver al paciente</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
