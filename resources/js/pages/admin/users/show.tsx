import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminUserShowProps } from '@/types';

const planLabels: Record<string, string> = {
    free: 'Gratuito', premium_monthly: 'Premium mensual', premium_yearly: 'Premium anual',
};

const planColors: Record<string, string> = {
    free:            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    premium_monthly: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    premium_yearly:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const statusColors: Record<string, string> = {
    active:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    expired:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const paymentStatusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminUserShow({ user, dashboardData }: AdminUserShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Usuarios', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}` },
    ];

    function confirmDelete() {
        if (confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Admin — ${user.name}`} />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/users">
                            <Button variant="outline">← Volver</Button>
                        </Link>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Eliminar usuario
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Actividad */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Actividad</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border p-4 text-center">
                                <p className="text-3xl font-bold">{dashboardData.active_tasks}</p>
                                <p className="text-xs text-muted-foreground">Tareas activas</p>
                            </div>
                            <div className="rounded-lg border p-4 text-center">
                                <p className="text-3xl font-bold">{dashboardData.completed_this_month}</p>
                                <p className="text-xs text-muted-foreground">Completadas este mes</p>
                            </div>
                            <div className="rounded-lg border p-4 text-center">
                                <p className="text-3xl font-bold">{dashboardData.total_ideas}</p>
                                <p className="text-xs text-muted-foreground">Ideas activas</p>
                            </div>
                            <div className="rounded-lg border p-4 text-center">
                                <p className="text-3xl font-bold">{dashboardData.total_projects}</p>
                                <p className="text-xs text-muted-foreground">Proyectos activos</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Suscripción */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Suscripción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!user.subscription ? (
                                <p className="text-sm text-muted-foreground">Sin suscripción registrada.</p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Plan</span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${planColors[user.subscription.plan]}`}>
                                            {planLabels[user.subscription.plan]}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Estado</span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[user.subscription.status]}`}>
                                            {user.subscription.status}
                                        </span>
                                    </div>
                                    {user.subscription.expires_at && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Expira</span>
                                            <span className="text-sm">
                                                {new Date(user.subscription.expires_at).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Pagos */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Historial de pagos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!user.payments || user.payments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Sin pagos registrados.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {user.payments.map(payment => (
                                    <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(payment.created_at).toLocaleDateString('es-ES')}
                                        </span>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${paymentStatusColors[payment.status]}`}>
                                            {payment.status}
                                        </span>
                                        <span className="text-sm font-semibold">${payment.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
