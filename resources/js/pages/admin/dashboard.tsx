import { Head, Link } from '@inertiajs/react';
import { LayoutDashboard, Users, Crown, CreditCard, TrendingUp, DollarSign, Activity, ArrowRight, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminDashboardProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Dashboard', href: '/admin/dashboard' },
];

const paymentStatusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    pending:   'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    failed:    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

const paymentStatusLabels: Record<string, string> = {
    completed: 'Completado', pending: 'Pendiente', failed: 'Fallido',
};

export default function AdminDashboard({ stats, recentPayments, recentUsers }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Panel de administración</h1>
                        <p className="text-sm text-muted-foreground">Estadísticas globales de Flowly</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.total_users}</p>
                                <p className="text-sm text-muted-foreground">Usuarios totales</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-500/10">
                                <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.free_users}</p>
                                <p className="text-sm text-muted-foreground">Usuarios gratuitos</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.premium_users}</p>
                                <p className="text-sm text-muted-foreground">Usuarios premium</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stats.active_subscriptions}</p>
                                <p className="text-sm text-muted-foreground">Suscripciones activas</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">${stats.payments_this_month.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Ingresos este mes</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold">${stats.total_revenue.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Ingresos totales</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent data */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Pagos recientes */}
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base font-semibold">Pagos recientes</CardTitle>
                            </div>
                            <Link href="/admin/payments" className="flex items-center gap-1 text-sm text-primary hover:underline">
                                Ver todos <ArrowRight className="h-3 w-3" />
                            </Link>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {recentPayments.length === 0 ? (
                                <div className="rounded-xl border-2 border-dashed py-8 text-center">
                                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
                                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Sin pagos registrados.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {recentPayments.map(payment => (
                                        <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/30">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{payment.user.name}</p>
                                                <p className="truncate text-xs text-muted-foreground">{payment.user.email}</p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                <Badge variant="outline" className={paymentStatusColors[payment.status]}>
                                                    {paymentStatusLabels[payment.status]}
                                                </Badge>
                                                <span className="text-sm font-semibold">${payment.amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Usuarios recientes */}
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
                            <div className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base font-semibold">Usuarios recientes</CardTitle>
                            </div>
                            <Link href="/admin/users" className="flex items-center gap-1 text-sm text-primary hover:underline">
                                Ver todos <ArrowRight className="h-3 w-3" />
                            </Link>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {recentUsers.length === 0 ? (
                                <div className="rounded-xl border-2 border-dashed py-8 text-center">
                                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Sin usuarios registrados.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {recentUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/30">
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
