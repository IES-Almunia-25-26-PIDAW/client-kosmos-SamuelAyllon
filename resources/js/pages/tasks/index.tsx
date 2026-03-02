import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, TasksProps, Task } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tareas', href: '/tasks' },
];

const priorityColors: Record<string, string> = {
    high:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

const priorityLabels: Record<string, string> = {
    high: 'Alta', medium: 'Media', low: 'Baja',
};

function TaskCard({ task, canAddTask }: { task: Task; canAddTask: boolean }) {
    const isOverdue = task.due_date && task.status === 'pending' && new Date(task.due_date) < new Date();

    function handleToggle() {
        if (task.status === 'pending') {
            router.patch(`/tasks/${task.id}/complete`);
        } else if (canAddTask) {
            router.patch(`/tasks/${task.id}/reopen`);
        }
    }

    function handleDelete() {
        if (confirm(`¿Eliminar "${task.name}"?`)) {
            router.delete(`/tasks/${task.id}`);
        }
    }

    return (
        <div className={`flex items-start gap-3 rounded-lg border p-4 ${task.status === 'completed' ? 'opacity-60' : ''}`}>

            {/* Checkbox */}
            <Checkbox
                className="mt-0.5 shrink-0"
                checked={task.status === 'completed'}
                disabled={task.status === 'completed' && !canAddTask}
                onCheckedChange={handleToggle}
                title={task.status === 'pending' ? 'Marcar como completada' : 'Reabrir tarea'}
            />

            {/* Contenido */}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.name}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
                        {priorityLabels[task.priority]}
                    </span>
                    {task.project && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {task.project.name}
                        </span>
                    )}
                </div>
                {task.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                )}
                {task.due_date && (
                    <p className={`mt-1 text-xs ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-muted-foreground'}`}>
                        {isOverdue ? 'Vencida · ' : 'Vence · '}
                        {new Date(task.due_date).toLocaleDateString('es-ES')}
                    </p>
                )}
            </div>

            {/* Acciones */}
            <div className="flex shrink-0 gap-1">
                <Link href={`/tasks/${task.id}/edit`}>
                    <Button size="sm" variant="ghost" title="Editar">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default function TasksIndex({ tasks, canAddTask, isFreeUser }: TasksProps) {
    const { props } = usePage<{ flash?: { success?: string }; errors?: { limit?: string } }>();
    const flash = props.flash;
    const errors = props.errors;

    const pending = tasks.filter(t => t.status === 'pending');
    const completed = tasks.filter(t => t.status === 'completed');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tareas" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mis tareas</h1>
                        <p className="text-sm text-muted-foreground">
                            {pending.length} pendiente{pending.length !== 1 ? 's' : ''}
                            {isFreeUser && ` · máx. 5 activas`}
                        </p>
                    </div>
                    {canAddTask ? (
                        <Link href="/tasks/create">
                            <Button>Nueva tarea</Button>
                        </Link>
                    ) : (
                        <Link href="/checkout">
                            <Button variant="outline">Actualizar a Premium</Button>
                        </Link>
                    )}
                </div>

                {/* Mensajes flash */}
                {flash?.success && (
                    <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {flash.success}
                    </div>
                )}
                {errors?.limit && (
                    <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {errors.limit}
                    </div>
                )}

                {/* Sin tareas */}
                {tasks.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                            <p className="text-muted-foreground">No tienes tareas todavía.</p>
                            {canAddTask && (
                                <Link href="/tasks/create">
                                    <Button>Crear primera tarea</Button>
                                </Link>
                            )}
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
                            {pending.map(task => (
                                <TaskCard key={task.id} task={task} canAddTask={canAddTask} />
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
                            {completed.map(task => (
                                <TaskCard key={task.id} task={task} canAddTask={canAddTask} />
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
