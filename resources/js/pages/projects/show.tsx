import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Task } from '@/types';

interface TasksSummary {
    total: number;
    pending: number;
    completed: number;
}

interface Props {
    project: Project;
    tasksSummary: TasksSummary;
    progressPercentage: number;
}

const statusColors: Record<string, string> = {
    created:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    active:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const statusLabels: Record<string, string> = {
    created: 'Creado', active: 'Activo', completed: 'Completado',
};

const priorityColors: Record<string, string> = {
    high:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

const priorityLabels: Record<string, string> = {
    high: 'Alta', medium: 'Media', low: 'Baja',
};

export default function ProjectShow({ project, tasksSummary, progressPercentage }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Proyectos', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
    ];

    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const pending = project.tasks?.filter((t: Task) => t.status === 'pending') ?? [];
    const completed = project.tasks?.filter((t: Task) => t.status === 'completed') ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {project.color && (
                            <span className="shrink-0 h-4 w-4 rounded-full" style={{ backgroundColor: project.color }} />
                        )}
                        <div className="min-w-0">
                            <h1 className="truncate text-2xl font-bold">{project.name}</h1>
                            {project.description && (
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Link href={`/projects/${project.id}/edit`}>
                            <Button variant="outline">Editar</Button>
                        </Link>
                        <Link href="/projects">
                            <Button variant="outline">← Volver</Button>
                        </Link>
                    </div>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Estadísticas */}
                <div className="grid gap-4 sm:grid-cols-4">
                    <Card>
                        <CardContent className="pt-4">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>
                                {statusLabels[project.status]}
                            </span>
                            <p className="mt-1 text-xs text-muted-foreground">Estado</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <p className="text-2xl font-bold">{tasksSummary.total}</p>
                            <p className="text-xs text-muted-foreground">Total tareas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <p className="text-2xl font-bold text-orange-600">{tasksSummary.pending}</p>
                            <p className="text-xs text-muted-foreground">Pendientes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <p className="text-2xl font-bold text-green-600">{tasksSummary.completed}</p>
                            <p className="text-xs text-muted-foreground">Completadas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Barra de progreso */}
                {tasksSummary.total > 0 && (
                    <Card>
                        <CardContent className="pt-4">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-sm font-medium">Progreso</p>
                                <p className="text-sm font-semibold">{progressPercentage}%</p>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                                <div
                                    className="h-2 rounded-full bg-green-500 transition-all"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tareas */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Tareas</h2>
                    <Link href="/tasks/create">
                        <Button size="sm">+ Añadir tarea</Button>
                    </Link>
                </div>

                {tasksSummary.total === 0 && (
                    <Card>
                        <CardContent className="flex items-center justify-center py-10">
                            <p className="text-muted-foreground">Este proyecto no tiene tareas todavía.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Pendientes */}
                {pending.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Pendientes ({pending.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {pending.map((task: Task) => (
                                <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                                    <div className="min-w-0 flex-1 flex items-center gap-2">
                                        <p className="truncate text-sm font-medium">{task.name}</p>
                                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
                                            {priorityLabels[task.priority]}
                                        </span>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <Button size="sm" variant="outline" onClick={() => router.patch(`/tasks/${task.id}/complete`)}>
                                            Completar
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => {
                                            if (confirm(`¿Eliminar "${task.name}"?`)) router.delete(`/tasks/${task.id}`);
                                        }}>
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Completadas */}
                {completed.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Completadas ({completed.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {completed.map((task: Task) => (
                                <div key={task.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 opacity-60">
                                    <p className="text-sm line-through text-muted-foreground">{task.name}</p>
                                    <Button size="sm" variant="outline" onClick={() => router.patch(`/tasks/${task.id}/reopen`)}>
                                        Reabrir
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
