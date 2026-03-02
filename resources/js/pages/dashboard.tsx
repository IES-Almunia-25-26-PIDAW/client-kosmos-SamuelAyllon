import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem } from '@/types';
import { DashboardProps } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

const priorityColors: Record<string, string> = {
    high:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const priorityLabels: Record<string, string> = {
    high: 'Alta', medium: 'Media', low: 'Baja',
};

const planLabels: Record<string, string> = {
    free: 'Gratuito', premium_monthly: 'Premium', premium_yearly: 'Premium Anual',
};

export default function Dashboard({ pendingTasks, activeIdeas, activeProjects, subscription }: DashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const isPremium = subscription?.plan === 'premium_monthly'
                   || subscription?.plan === 'premium_yearly';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Hola, {auth.user.name}</h1>
                        <p className="text-sm text-muted-foreground">Resumen de tu actividad</p>
                    </div>
                    <Badge className={isPremium
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }>
                        {planLabels[subscription?.plan ?? 'free']}
                    </Badge>
                </div>

                {/* Estadísticas */}
                <div className={`grid gap-4 ${isPremium ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{pendingTasks.length}</p>
                            <p className="text-sm text-muted-foreground">Tareas pendientes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-3xl font-bold">{activeIdeas.length}</p>
                            <p className="text-sm text-muted-foreground">Ideas activas</p>
                        </CardContent>
                    </Card>
                    {isPremium && (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-3xl font-bold">{activeProjects.length}</p>
                                <p className="text-sm text-muted-foreground">Proyectos activos</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Secciones de contenido */}
                <div className={`grid gap-6 ${isPremium ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>

                    {/* Tareas pendientes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base">Tareas pendientes</CardTitle>
                            <Link href="/tasks" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                                Ver todas →
                            </Link>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {pendingTasks.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Sin tareas pendientes. ¡Buen trabajo!</p>
                            ) : (
                                pendingTasks.map(task => (
                                    <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
                                                {priorityLabels[task.priority]}
                                            </span>
                                            <span className="truncate text-sm">{task.name}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => router.patch(`/tasks/${task.id}/complete`)}
                                            className="shrink-0 text-green-600 hover:text-green-700"
                                        >
                                            ✓
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Ideas activas */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base">Ideas activas</CardTitle>
                            <Link href="/ideas" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                                Ver todas →
                            </Link>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {activeIdeas.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Sin ideas activas.</p>
                            ) : (
                                activeIdeas.slice(0, 5).map(idea => (
                                    <div key={idea.id} className="rounded-lg border p-3">
                                        <p className="text-sm font-medium">{idea.name}</p>
                                        {idea.description && (
                                            <p className="mt-1 truncate text-xs text-muted-foreground">{idea.description}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Proyectos activos — solo premium */}
                    {isPremium && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base">Proyectos activos</CardTitle>
                                <Link href="/projects" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                                    Ver todos →
                                </Link>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                {activeProjects.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Sin proyectos activos.</p>
                                ) : (
                                    activeProjects.map(project => (
                                        <div key={project.id} className="flex items-center gap-3 rounded-lg border p-3">
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-full"
                                                style={{ backgroundColor: project.color }}
                                            />
                                            <span className="truncate text-sm font-medium">{project.name}</span>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
