import { Head, Link, router } from '@inertiajs/react';
import {
    UserCircle, ArrowLeft, Trash2, ClipboardList, CheckCircle2,
    Lightbulb, FolderOpen, CreditCard, Crown, Calendar,
} from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminUserShowProps } from '@/types';

const planLabels: Record<string, string> = {
    free: 'Gratuito', premium_monthly: 'Premium mensual', premium_yearly: 'Premium anual',
};

const planColors: Record<string, string> = {
    free:            'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    premium_monthly: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    premium_yearly:  'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
};

const statusColors: Record<string, string> = {
    active:    'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    expired:   'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    cancelled: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
};

const statusLabels: Record<string, string> = {
    active: 'Activa', expired: 'Expirada', cancelled: 'Cancelada',
};

const paymentStatusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    pending:   'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    failed:    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

const paymentStatusLabels: Record<string, string> = {
    completed: 'Completado', pending: 'Pendiente', failed: 'Fallido',
};

export default function AdminUserShow({ user, dashboardData }: AdminUserShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Usuarios', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Admin — ${user.name}`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <UserCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/users">
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <ArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="gap-1.5">
                                    <Trash2 className="h-4 w-4" />
                                    Eliminar
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Eliminar a {user.name}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Se eliminarán todos los datos asociados a este usuario.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => router.delete(`/admin/users/${user.id}`)}
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                        Eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Activity */}
                    <Card className="shadow-sm">
                        <CardHeader className="border-b bg-muted/30 pb-4">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base font-semibold">Actividad</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3 rounded-lg border p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                                    <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{dashboardData.active_tasks}</p>
                                    <p className="text-xs text-muted-foreground">Tareas activas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{dashboardData.completed_this_month}</p>
                                    <p className="text-xs text-muted-foreground">Completadas este mes</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{dashboardData.total_ideas}</p>
                                    <p className="text-xs text-muted-foreground">Ideas activas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <FolderOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{dashboardData.total_projects}</p>
                                    <p className="text-xs text-muted-foreground">Clientes activos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscription */}
                    <Card className="shadow-sm">
                        <CardHeader className="border-b bg-muted/30 pb-4">
                            <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base font-semibold">Suscripción</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {!user.subscription ? (
                                <div className="rounded-xl border-2 border-dashed py-8 text-center">
                                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
                                        <Crown className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Sin suscripción registrada.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-2">
                                            <Crown className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Plan</span>
                                        </div>
                                        <Badge variant="outline" className={planColors[user.subscription.plan]}>
                                            {planLabels[user.subscription.plan]}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Estado</span>
                                        </div>
                                        <Badge variant="outline" className={statusColors[user.subscription.status]}>
                                            {statusLabels[user.subscription.status] ?? user.subscription.status}
                                        </Badge>
                                    </div>
                                    {user.subscription.expires_at && (
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Expira</span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {new Date(user.subscription.expires_at).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Payments */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <CardTitle className="text-base font-semibold">Historial de pagos</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {!user.payments || user.payments.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed py-8 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">Sin pagos registrados.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {user.payments.map(payment => (
                                    <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/30">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(payment.created_at).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className={paymentStatusColors[payment.status]}>
                                            {paymentStatusLabels[payment.status] ?? payment.status}
                                        </Badge>
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
