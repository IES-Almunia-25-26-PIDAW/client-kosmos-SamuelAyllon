import { Head, router } from '@inertiajs/react';
import { CreditCard, DollarSign, Clock, AlertCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminPaymentsProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Pagos', href: '/admin/payments' },
];

const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    pending:   'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    failed:    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

const statusLabels: Record<string, string> = {
    completed: 'Completado', pending: 'Pendiente', failed: 'Fallido',
};

export default function AdminPaymentsIndex({ payments, summary }: AdminPaymentsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Pagos" />

            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pagos</h1>
                        <p className="text-sm text-muted-foreground">{payments.total} pagos registrados</p>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">${summary.total_completed.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Ingresos completados</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{summary.total_pending}</p>
                                <p className="text-sm text-muted-foreground">Pagos pendientes</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{summary.total_failed}</p>
                                <p className="text-sm text-muted-foreground">Pagos fallidos</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* List */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <CardTitle className="text-base font-semibold">Historial de pagos</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {payments.data.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed py-12 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">Sin pagos registrados.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {payments.data.map(payment => (
                                    <div key={payment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/30">

                                        {/* User */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{payment.user.name}</p>
                                            <p className="truncate text-sm text-muted-foreground">{payment.user.email}</p>
                                        </div>

                                        {/* Date */}
                                        <div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(payment.created_at).toLocaleDateString('es-ES')}
                                        </div>

                                        {/* Status */}
                                        <Badge variant="outline" className={statusColors[payment.status]}>
                                            {statusLabels[payment.status]}
                                        </Badge>

                                        {/* Amount */}
                                        <span className="shrink-0 text-sm font-semibold">
                                            ${payment.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {payments.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-1">
                                {payments.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`rounded px-3 py-1 text-sm transition-colors ${
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
