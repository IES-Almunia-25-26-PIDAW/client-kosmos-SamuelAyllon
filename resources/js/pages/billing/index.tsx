import { Head, router } from '@inertiajs/react';
import { Receipt } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { KPICard } from '@/components/patient/kpi-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/empty-state';
import type { Payment } from '@/types';

interface Stats {
    total_paid: number;
    total_pending: number;
    total_overdue: number;
}

interface PaginatedPayments {
    data: Payment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    payments: PaginatedPayments;
    stats: Stats;
    filters: { status?: string; patient_id?: string };
}

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Cobrado',
    overdue: 'Vencido',
    claimed: 'Reclamado',
};

export default function BillingIndex({ payments, stats, filters }: Props) {
    return (
        <AppLayout>
            <Head title="Cobros — ClientKosmos" />

            <div className="flex flex-col gap-6 p-6 lg:p-8">

                {/* Header */}
                <div>
                    <h1 className="text-display-2xl text-[var(--color-text)]">Cobros</h1>
                    <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">
                        Control de pagos y estado de cobros de todos tus pacientes
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <KPICard
                        label="Cobrado este mes"
                        value={`€${stats.total_paid.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                    />
                    <KPICard
                        label="Pendiente de cobro"
                        value={`€${stats.total_pending.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                    />
                    <KPICard
                        label="Vencido sin cobrar"
                        value={`€${stats.total_overdue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                    {['', 'paid', 'pending', 'overdue', 'claimed'].map((s) => (
                        <button
                            key={s}
                            onClick={() => router.get('/billing', { status: s || undefined }, { preserveState: true })}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                (filters.status ?? '') === s
                                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]'
                                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                            }`}
                        >
                            {s === '' ? 'Todos' : statusLabels[s]}
                        </button>
                    ))}
                </div>

                {/* Table */}
                {payments.data.length === 0 ? (
                    <EmptyState
                        icon={Receipt}
                        title="Sin cobros"
                        description="Cuando registres cobros desde las sesiones de tus pacientes, aparecerán aquí."
                    />
                ) : (
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)]">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Paciente</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Concepto</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Vencimiento</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Importe</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border-subtle)]">
                                {payments.data.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-[var(--color-surface-alt)] transition-colors">
                                        <td className="px-4 py-3 text-[var(--color-text)] font-medium">
                                            {payment.patient?.project_name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                                            {payment.concept ?? 'Sesión'}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                                            {formatDate(payment.due_date)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-[var(--color-text)] tabular-nums">
                                            €{Number(payment.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge
                                                status={payment.status as 'paid' | 'pending' | 'overdue'}
                                                variant="subtle"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {payments.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)]">
                                <p className="text-xs text-[var(--color-text-secondary)]">
                                    {payments.total} cobros · Página {payments.current_page} de {payments.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {payments.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={`px-3 py-1 text-xs rounded-[var(--radius-sm)] transition-colors ${
                                                link.active
                                                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]'
                                                    : link.url
                                                        ? 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                                                        : 'text-[var(--color-text-muted)] cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
