import { Head, Link, router } from '@inertiajs/react';
import { Users, Eye, Trash2, ClipboardList, Lightbulb, FolderOpen } from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminUser, AdminUsersIndexProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Usuarios', href: '/admin/users' },
];

const roleColors: Record<string, string> = {
    admin:        'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    premium_user: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    free_user:    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
};

const roleLabels: Record<string, string> = {
    admin: 'Admin', premium_user: 'Premium', free_user: 'Free',
};

const planLabels: Record<string, string> = {
    free: 'Free', premium_monthly: 'Premium mensual', premium_yearly: 'Premium anual',
};

export default function AdminUsersIndex({ users }: AdminUsersIndexProps) {
    const roleName = (user: AdminUser) => user.roles?.[0]?.name ?? 'free_user';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Usuarios" />

            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
                        <p className="text-sm text-muted-foreground">{users.total} usuarios registrados</p>
                    </div>
                </div>

                {/* Table */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <CardTitle className="text-base font-semibold">Lista de usuarios</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {users.data.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed py-12 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                                    <Users className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">Sin usuarios registrados.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {users.data.map(user => (
                                    <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/30">

                                        {/* Info principal */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate font-medium">{user.name}</p>
                                                <Badge variant="outline" className={roleColors[roleName(user)]}>
                                                    {roleLabels[roleName(user)] ?? roleName(user)}
                                                </Badge>
                                            </div>
                                            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                                        </div>

                                        {/* Plan */}
                                        <div className="shrink-0 text-center">
                                            <p className="text-xs text-muted-foreground">Plan</p>
                                            <p className="text-sm font-medium">
                                                {user.subscription ? planLabels[user.subscription.plan] : 'Sin plan'}
                                            </p>
                                        </div>

                                        {/* Counts */}
                                        <div className="flex shrink-0 gap-4 text-center">
                                            <div className="flex items-center gap-1.5">
                                                <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-sm font-medium">{user.tasks_count ?? 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Lightbulb className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-sm font-medium">{user.ideas_count ?? 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-sm font-medium">{user.projects_count ?? 0}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex shrink-0 gap-2">
                                            <Link href={`/admin/users/${user.id}`}>
                                                <Button size="sm" variant="outline" className="gap-1.5">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Ver
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive" className="gap-1.5">
                                                        <Trash2 className="h-3.5 w-3.5" />
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
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-1">
                                {users.links.map((link, i) => (
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
