import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Stats {
    total_users: number;
    free_users: number;
    premium_users: number;
    total_revenue: number;
    payments_this_month: number;
    active_subscriptions: number;
}

interface RecentPayment {
    id: number;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
    user: { id: number; name: string; email: string };
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    recentPayments: RecentPayment[];
    recentUsers: RecentUser[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Dashboard', href: '/admin/dashboard' },
];

const paymentStatusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const paymentStatusLabels: Record<string, string> = {
    completed: 'Completado', pending: 'Pendiente', failed: 'Fallido',
};

export default function AdminDashboard({ stats, recentPayments, recentUsers }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Dashboard" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div>
                    <h1 className="text-2xl font-bold">Panel de administración</h1>
                    <p className="text-sm text-muted-foreground">Estadísticas globales de Flowly</p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{stats.total_users}</p>
                            <p className="text-sm text-muted-foreground">Usuarios totales</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{stats.free_users}</p>
                            <p className="text-sm text-muted-foreground">Usuarios gratuitos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{stats.premium_users}</p>
                            <p className="text-sm text-muted-foreground">Usuarios premium</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{stats.active_subscriptions}</p>
                            <p className="text-sm text-muted-foreground">Suscripciones activas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">${stats.payments_this_month.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Ingresos este mes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">${stats.total_revenue.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Ingresos totales</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tablas */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Pagos recientes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base">Pagos recientes</CardTitle>
                            <Link href="/admin/payments" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                                Ver todos →
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentPayments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Sin pagos registrados.</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {recentPayments.map(payment => (
                                        <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{payment.user.name}</p>
                                                <p className="truncate text-xs text-muted-foreground">{payment.user.email}</p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${paymentStatusColors[payment.status]}`}>
                                                    {paymentStatusLabels[payment.status]}
                                                </span>
                                                <span className="text-sm font-semibold">${payment.amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Usuarios recientes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base">Usuarios recientes</CardTitle>
                            <Link href="/admin/users" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                                Ver todos →
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentUsers.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Sin usuarios registrados.</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {recentUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{user.name}</p>
                                                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                            <span className="shrink-0 text-xs text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
