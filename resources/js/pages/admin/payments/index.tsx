import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminPaymentsProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Pagos', href: '/admin/payments' },
];

const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusLabels: Record<string, string> = {
    completed: 'Completado', pending: 'Pendiente', failed: 'Fallido',
};

export default function AdminPaymentsIndex({ payments, summary }: AdminPaymentsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Pagos" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div>
                    <h1 className="text-2xl font-bold">Pagos</h1>
                    <p className="text-sm text-muted-foreground">{payments.total} pagos registrados</p>
                </div>

                {/* Resumen */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">${summary.total_completed.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Ingresos completados</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{summary.total_pending}</p>
                            <p className="text-sm text-muted-foreground">Pagos pendientes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{summary.total_failed}</p>
                            <p className="text-sm text-muted-foreground">Pagos fallidos</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Historial de pagos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {payments.data.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Sin pagos registrados.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {payments.data.map(payment => (
                                    <div key={payment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">

                                        {/* Usuario */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{payment.user.name}</p>
                                            <p className="truncate text-sm text-muted-foreground">{payment.user.email}</p>
                                        </div>

                                        {/* Fecha */}
                                        <span className="shrink-0 text-sm text-muted-foreground">
                                            {new Date(payment.created_at).toLocaleDateString('es-ES')}
                                        </span>

                                        {/* Estado */}
                                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[payment.status]}`}>
                                            {statusLabels[payment.status]}
                                        </span>

                                        {/* Importe */}
                                        <span className="shrink-0 text-sm font-semibold">
                                            ${payment.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Paginación */}
                        {payments.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-1">
                                {payments.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`rounded px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground font-medium'
                                                : link.url
                                                    ? 'hover:bg-muted cursor-pointer'
                                                    : 'cursor-not-allowed text-muted-foreground'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
