import { Head, router } from '@inertiajs/react';
import { Crown, Users, Calendar, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminSubscriptionsProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Suscripciones', href: '/admin/subscriptions' },
];

const planColors: Record<string, string> = {
    free:            'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    premium_monthly: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    premium_yearly:  'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
};

const planLabels: Record<string, string> = {
    free: 'Gratuito', premium_monthly: 'Premium mensual', premium_yearly: 'Premium anual',
};

const statusColors: Record<string, string> = {
    active:    'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    expired:   'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    cancelled: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
};

const statusLabels: Record<string, string> = {
    active: 'Activa', expired: 'Expirada', cancelled: 'Cancelada',
};

export default function AdminSubscriptionsIndex({ subscriptions, summary }: AdminSubscriptionsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Suscripciones" />

            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Suscripciones</h1>
                        <p className="text-sm text-muted-foreground">{subscriptions.total} suscripciones registradas</p>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-3 pt-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-500/10">
                                <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{summary.free}</p>
                                <p className="text-xs text-muted-foreground">Gratuitos</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-3 pt-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                                <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{summary.premium_monthly}</p>
                                <p className="text-xs text-muted-foreground">Mensual</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-3 pt-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                                <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{summary.premium_yearly}</p>
                                <p className="text-xs text-muted-foreground">Anual</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-3 pt-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{summary.expired}</p>
                                <p className="text-xs text-muted-foreground">Expiradas</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-3 pt-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                                <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{summary.cancelled}</p>
                                <p className="text-xs text-muted-foreground">Canceladas</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* List */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-primary" />
                            <CardTitle className="text-base font-semibold">Lista de suscripciones</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {subscriptions.data.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed py-12 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                                    <Crown className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">Sin suscripciones registradas.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {subscriptions.data.map(sub => (
                                    <div key={sub.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/30">

                                        {/* User */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{sub.user.name}</p>
                                            <p className="truncate text-sm text-muted-foreground">{sub.user.email}</p>
                                        </div>

                                        {/* Plan */}
                                        <Badge variant="outline" className={planColors[sub.plan]}>
                                            {planLabels[sub.plan]}
                                        </Badge>

                                        {/* Status */}
                                        <Badge variant="outline" className={statusColors[sub.status]}>
                                            {statusLabels[sub.status]}
                                        </Badge>

                                        {/* Expiry */}
                                        <div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {sub.expires_at
                                                ? new Date(sub.expires_at).toLocaleDateString('es-ES')
                                                : '—'
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {subscriptions.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-1">
                                {subscriptions.links.map((link, i) => (
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
