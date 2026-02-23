import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminSubscriptionsProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Suscripciones', href: '/admin/subscriptions' },
];

const planColors: Record<string, string> = {
    free:            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    premium_monthly: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    premium_yearly:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const planLabels: Record<string, string> = {
    free: 'Gratuito', premium_monthly: 'Premium mensual', premium_yearly: 'Premium anual',
};

const statusColors: Record<string, string> = {
    active:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    expired:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const statusLabels: Record<string, string> = {
    active: 'Activa', expired: 'Expirada', cancelled: 'Cancelada',
};

export default function AdminSubscriptionsIndex({ subscriptions, summary }: AdminSubscriptionsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Suscripciones" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div>
                    <h1 className="text-2xl font-bold">Suscripciones</h1>
                    <p className="text-sm text-muted-foreground">{subscriptions.total} suscripciones registradas</p>
                </div>

                {/* Resumen */}
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{summary.free}</p>
                            <p className="text-sm text-muted-foreground">Gratuitos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{summary.premium_monthly}</p>
                            <p className="text-sm text-muted-foreground">Premium mensual</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{summary.premium_yearly}</p>
                            <p className="text-sm text-muted-foreground">Premium anual</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{summary.expired}</p>
                            <p className="text-sm text-muted-foreground">Expiradas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{summary.cancelled}</p>
                            <p className="text-sm text-muted-foreground">Canceladas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Lista de suscripciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {subscriptions.data.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Sin suscripciones registradas.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {subscriptions.data.map(sub => (
                                    <div key={sub.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">

                                        {/* Usuario */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{sub.user.name}</p>
                                            <p className="truncate text-sm text-muted-foreground">{sub.user.email}</p>
                                        </div>

                                        {/* Plan */}
                                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${planColors[sub.plan]}`}>
                                            {planLabels[sub.plan]}
                                        </span>

                                        {/* Estado */}
                                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[sub.status]}`}>
                                            {statusLabels[sub.status]}
                                        </span>

                                        {/* Expiración */}
                                        <span className="shrink-0 text-sm text-muted-foreground">
                                            {sub.expires_at
                                                ? new Date(sub.expires_at).toLocaleDateString('es-ES')
                                                : '—'
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Paginación */}
                        {subscriptions.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-1">
                                {subscriptions.links.map((link, i) => (
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
