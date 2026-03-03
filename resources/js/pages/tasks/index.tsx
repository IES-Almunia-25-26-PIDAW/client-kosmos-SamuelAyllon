import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Table2, Calendar, LayoutGrid, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VoiceRecorder from '@/components/voice-recorder';
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

type ViewType = 'table' | 'calendar' | 'gallery';

// ── Acciones comunes ────────────────────────────────────────────────────────

function toggleTask(task: Task, canAddTask: boolean) {
    if (task.status === 'pending') router.patch(`/tasks/${task.id}/complete`);
    else if (canAddTask) router.patch(`/tasks/${task.id}/reopen`);
}

function deleteTask(task: Task) {
    if (confirm(`¿Eliminar "${task.name}"?`)) router.delete(`/tasks/${task.id}`);
}

// ── Vista tabla ─────────────────────────────────────────────────────────────

function TableView({ tasks, canAddTask }: { tasks: Task[]; canAddTask: boolean }) {
    if (tasks.length === 0) {
        return <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No hay tareas con el filtro actual.</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead className="bg-muted/40">
                    <tr>
                        <th className="w-10 p-3" />
                        <th className="p-3 text-left font-medium">Nombre</th>
                        <th className="p-3 text-left font-medium">Prioridad</th>
                        <th className="hidden p-3 text-left font-medium sm:table-cell">Proyecto</th>
                        <th className="hidden p-3 text-left font-medium md:table-cell">Vencimiento</th>
                        <th className="p-3 text-right font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {tasks.map(task => {
                        const isOverdue = task.due_date && task.status === 'pending' && new Date(task.due_date) < new Date();
                        return (
                            <tr key={task.id} className={`transition-colors hover:bg-muted/30 ${task.status === 'completed' ? 'opacity-60' : ''}`}>
                                <td className="p-3">
                                    <Checkbox
                                        checked={task.status === 'completed'}
                                        disabled={task.status === 'completed' && !canAddTask}
                                        onCheckedChange={() => toggleTask(task, canAddTask)}
                                    />
                                </td>
                                <td className="p-3">
                                    <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : 'font-medium'}>
                                        {task.name}
                                    </span>
                                    {task.description && (
                                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                                    )}
                                </td>
                                <td className="p-3">
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
                                        {priorityLabels[task.priority]}
                                    </span>
                                </td>
                                <td className="hidden p-3 text-muted-foreground sm:table-cell">
                                    {task.project?.name ?? '—'}
                                </td>
                                <td className={`hidden p-3 text-xs md:table-cell ${isOverdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES') : '—'}
                                </td>
                                <td className="p-3">
                                    <div className="flex justify-end gap-1">
                                        <Link href={`/tasks/${task.id}/edit`}>
                                            <Button size="sm" variant="ghost" title="Editar">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => deleteTask(task)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ── Vista calendario ────────────────────────────────────────────────────────

function CalendarView({ tasks }: { tasks: Task[] }) {
    const [viewDate, setViewDate] = useState(new Date());
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Lunes como primer día de la semana
    let startDow = new Date(year, month, 1).getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;

    const tasksByDate: Record<string, Task[]> = {};
    tasks.forEach(task => {
        if (task.due_date) {
            const key = task.due_date.substring(0, 10);
            if (!tasksByDate[key]) tasksByDate[key] = [];
            tasksByDate[key].push(task);
        }
    });

    const todayStr = new Date().toISOString().substring(0, 10);
    const monthLabel = viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return (
        <div className="rounded-lg border overflow-hidden">
            {/* Navegación mes */}
            <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                <Button variant="ghost" size="sm" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium capitalize">{monthLabel}</span>
                <Button variant="ghost" size="sm" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Cabecera días */}
            <div className="grid grid-cols-7 border-b">
                {dayNames.map(d => (
                    <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
                        {d}
                    </div>
                ))}
            </div>

            {/* Celdas */}
            <div className="grid grid-cols-7">
                {/* Celdas vacías iniciales */}
                {Array.from({ length: startDow }).map((_, i) => (
                    <div key={`e-${i}`} className="min-h-[90px] border-b border-r bg-muted/10 p-1" />
                ))}

                {/* Días del mes */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayTasks = tasksByDate[dateKey] ?? [];
                    const isToday = dateKey === todayStr;

                    return (
                        <div key={day} className={`min-h-[90px] border-b border-r p-1 ${isToday ? 'bg-primary/5' : ''}`}>
                            <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium
                                ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                                {day}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {dayTasks.slice(0, 3).map(task => (
                                    <div key={task.id} className={`truncate rounded px-1 py-0.5 text-xs
                                        ${task.status === 'completed'
                                            ? 'bg-muted text-muted-foreground line-through'
                                            : task.priority === 'high'
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : task.priority === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-muted text-muted-foreground'}`}>
                                        {task.name}
                                    </div>
                                ))}
                                {dayTasks.length > 3 && (
                                    <span className="text-xs text-muted-foreground">+{dayTasks.length - 3} más</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Vista galería ───────────────────────────────────────────────────────────

function GalleryView({ tasks, canAddTask }: { tasks: Task[]; canAddTask: boolean }) {
    if (tasks.length === 0) {
        return <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No hay tareas con el filtro actual.</div>;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map(task => {
                const isOverdue = task.due_date && task.status === 'pending' && new Date(task.due_date) < new Date();
                return (
                    <Card key={task.id} className={task.status === 'completed' ? 'opacity-60' : ''}>
                        <CardHeader className="pb-2">
                            <div className="flex items-start gap-2">
                                <Checkbox
                                    className="mt-0.5 shrink-0"
                                    checked={task.status === 'completed'}
                                    disabled={task.status === 'completed' && !canAddTask}
                                    onCheckedChange={() => toggleTask(task, canAddTask)}
                                />
                                <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <CardTitle className={`text-sm font-medium leading-snug ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.name}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-1">
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
                                <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                            )}
                            {task.due_date && (
                                <p className={`text-xs ${isOverdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                                    {isOverdue ? 'Vencida · ' : 'Vence · '}
                                    {new Date(task.due_date).toLocaleDateString('es-ES')}
                                </p>
                            )}
                            <div className="mt-auto flex justify-end gap-1 pt-1">
                                <Link href={`/tasks/${task.id}/edit`}>
                                    <Button size="sm" variant="ghost" title="Editar">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => deleteTask(task)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

// ── Página principal ────────────────────────────────────────────────────────

export default function TasksIndex({ tasks, canAddTask, isFreeUser }: TasksProps) {
    const { props } = usePage<{ flash?: { success?: string }; errors?: { limit?: string }; auth: { is_premium: boolean } }>();
    const flash = props.flash;
    const errors = props.errors;
    const isPremium = props.auth.is_premium;

    const today = new Date().toISOString().split('T')[0];
    const [view, setView] = useState<ViewType>('table');
    const [showAll, setShowAll] = useState(false);
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

    const filtered = tasks
        .filter(t => showAll || t.due_date?.startsWith(today))
        .filter(t => priorityFilter === 'all' || t.priority === priorityFilter);

    const pending = filtered.filter(t => t.status === 'pending');
    const completed = filtered.filter(t => t.status === 'completed');

    const priorities: Array<{ value: 'all' | 'high' | 'medium' | 'low'; label: string }> = [
        { value: 'all', label: 'Todas' },
        { value: 'high', label: 'Alta' },
        { value: 'medium', label: 'Media' },
        { value: 'low', label: 'Baja' },
    ];

    const viewButtons: Array<{ value: ViewType; icon: React.ReactNode; title: string }> = [
        { value: 'table',    icon: <Table2 className="h-4 w-4" />,    title: 'Vista tabla' },
        { value: 'calendar', icon: <Calendar className="h-4 w-4" />,  title: 'Vista calendario' },
        { value: 'gallery',  icon: <LayoutGrid className="h-4 w-4" />, title: 'Vista galería' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tareas" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Mis tareas</h1>
                        <p className="text-sm text-muted-foreground">
                            {pending.length} pendiente{pending.length !== 1 ? 's' : ''}
                            {isFreeUser && ` · máx. 5 activas`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Selector de vista */}
                        <div className="flex rounded-lg border p-0.5 gap-0.5">
                            {viewButtons.map(({ value, icon, title }) => (
                                <Button key={value} size="sm" variant={view === value ? 'default' : 'ghost'}
                                    className="h-7 w-7 p-0" onClick={() => setView(value)} title={title}>
                                    {icon}
                                </Button>
                            ))}
                        </div>
                        {isPremium && canAddTask && (
                            <VoiceRecorder
                                onTranscription={(text) => router.post('/tasks', { name: text, priority: 'medium' })}
                            />
                        )}
                        {canAddTask ? (
                            <Link href="/tasks/create"><Button>Nueva tarea</Button></Link>
                        ) : (
                            <Link href="/checkout"><Button variant="outline">Actualizar a Premium</Button></Link>
                        )}
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-lg border p-0.5 gap-0.5">
                        <Button size="sm" variant={!showAll ? 'default' : 'ghost'} className="h-7 px-3 text-xs" onClick={() => setShowAll(false)}>Hoy</Button>
                        <Button size="sm" variant={showAll ? 'default' : 'ghost'} className="h-7 px-3 text-xs" onClick={() => setShowAll(true)}>Todas</Button>
                    </div>
                    <div className="h-5 w-px bg-border" />
                    <div className="flex flex-wrap gap-1">
                        {priorities.map(({ value, label }) => (
                            <Button key={value} size="sm" variant={priorityFilter === value ? 'default' : 'outline'}
                                className="h-7 px-3 text-xs" onClick={() => setPriorityFilter(value)}>
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Flash */}
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
                            {canAddTask && <Link href="/tasks/create"><Button>Crear primera tarea</Button></Link>}
                        </CardContent>
                    </Card>
                )}

                {tasks.length > 0 && filtered.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                            <p className="text-muted-foreground">
                                {!showAll ? 'No tienes tareas programadas para hoy.' : 'No hay tareas con ese filtro.'}
                            </p>
                            {!showAll && (
                                <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>Ver todas las tareas</Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Vistas */}
                {filtered.length > 0 && view === 'table' && (
                    <>
                        {pending.length > 0 && (
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Pendientes ({pending.length})</p>
                                <TableView tasks={pending} canAddTask={canAddTask} />
                            </div>
                        )}
                        {completed.length > 0 && (
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Completadas ({completed.length})</p>
                                <TableView tasks={completed} canAddTask={canAddTask} />
                            </div>
                        )}
                    </>
                )}

                {filtered.length > 0 && view === 'calendar' && (
                    <CalendarView tasks={filtered} />
                )}

                {filtered.length > 0 && view === 'gallery' && (
                    <>
                        {pending.length > 0 && (
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Pendientes ({pending.length})</p>
                                <GalleryView tasks={pending} canAddTask={canAddTask} />
                            </div>
                        )}
                        {completed.length > 0 && (
                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">Completadas ({completed.length})</p>
                                <GalleryView tasks={completed} canAddTask={canAddTask} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
