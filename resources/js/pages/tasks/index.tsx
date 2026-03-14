import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Table2, Calendar, LayoutGrid, ChevronLeft, ChevronRight, ClipboardList, CheckCircle2, Plus, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, TasksProps, Task, ViewType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tareas', href: '/tasks' },
];

const priorityColors: Record<string, string> = {
    high:   'bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:    'bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-900/30 dark:text-blue-400',
};

const priorityLabels: Record<string, string> = {
    high: 'Alta', medium: 'Media', low: 'Baja',
};

// ── Acciones comunes ────────────────────────────────────────────────────────

function toggleTask(task: Task, canAddTask: boolean) {
    if (task.status === 'pending') router.patch(`/tasks/${task.id}/complete`);
    else if (canAddTask) router.patch(`/tasks/${task.id}/reopen`);
}

function deleteTask(task: Task) {
    if (confirm(`¿Eliminar "${task.name}"?`)) router.delete(`/tasks/${task.id}`);
}

function groupByClient(tasks: Task[]) {
    const map = new Map<number | 'none', { name: string | null; color: string; tasks: Task[] }>();
    for (const t of tasks) {
        const key = t.project?.id ?? 'none';
        if (!map.has(key)) map.set(key, { name: t.project?.name ?? null, color: t.project?.color ?? '#94a3b8', tasks: [] });
        map.get(key)!.tasks.push(t);
    }
    return Array.from(map.entries())
        .map(([id, g]) => ({ clientId: id, ...g }))
        .sort((a, b) => {
            if (a.name === null) return 1;
            if (b.name === null) return -1;
            return a.name.localeCompare(b.name);
        });
}

// ── Vista tabla ─────────────────────────────────────────────────────────────

function TableView({ tasks, canAddTask }: { tasks: Task[]; canAddTask: boolean }) {
    if (tasks.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <ClipboardList className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No hay tareas con el filtro actual.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border-2 bg-card/50">
            <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b">
                    <tr>
                        <th className="w-10 p-4" />
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Nombre</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Prioridad</th>
                        <th className="hidden p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground sm:table-cell">Cliente</th>
                        <th className="hidden p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground md:table-cell">Vencimiento</th>
                        <th className="p-4 text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {tasks.map(task => {
                        const isOverdue = task.due_date && task.status === 'pending' && new Date(task.due_date) < new Date();
                        return (
                            <tr key={task.id} className={`group transition-all hover:bg-primary/5 ${task.status === 'completed' ? 'opacity-60 bg-muted/20' : ''}`}>
                                <td className="p-4">
                                    <Checkbox
                                        checked={task.status === 'completed'}
                                        disabled={task.status === 'completed' && !canAddTask}
                                        onCheckedChange={() => toggleTask(task, canAddTask)}
                                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                    />
                                </td>
                                <td className="p-4">
                                    <span className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                        {task.name}
                                    </span>
                                    {task.description && (
                                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${priorityColors[task.priority]}`}>
                                        {priorityLabels[task.priority]}
                                    </span>
                                </td>
                                <td className="hidden p-4 sm:table-cell">
                                    {task.project ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.project.color || '#3A5A40' }} />
                                            {task.project.name}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </td>
                                <td className={`hidden p-4 md:table-cell`}>
                                    {task.due_date ? (
                                        <span className={`inline-flex items-center gap-1.5 text-xs ${isOverdue ? 'text-red-600 font-semibold dark:text-red-400' : 'text-muted-foreground'}`}>
                                            {isOverdue && <AlertCircle className="h-3.5 w-3.5" />}
                                            {!isOverdue && <Clock className="h-3.5 w-3.5" />}
                                            {new Date(task.due_date).toLocaleDateString('es-ES')}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/tasks/${task.id}/edit`}>
                                            <Button size="sm" variant="ghost" title="Editar" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" title="Eliminar" onClick={() => deleteTask(task)}>
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
        <div className="rounded-xl border-2 overflow-hidden bg-card/50">
            {/* Navegación mes */}
            <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent px-6 py-4">
                <Button variant="ghost" size="sm" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="font-bold text-lg capitalize">{monthLabel}</span>
                <Button variant="ghost" size="sm" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10">
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Cabecera días */}
            <div className="grid grid-cols-7 border-b bg-muted/30">
                {dayNames.map(d => (
                    <div key={d} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {d}
                    </div>
                ))}
            </div>

            {/* Celdas */}
            <div className="grid grid-cols-7">
                {/* Celdas vacías iniciales */}
                {Array.from({ length: startDow }).map((_, i) => (
                    <div key={`e-${i}`} className="min-h-[100px] border-b border-r bg-muted/10 p-2" />
                ))}

                {/* Días del mes */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayTasks = tasksByDate[dateKey] ?? [];
                    const isToday = dateKey === todayStr;
                    return (
                        <div key={day} className={`min-h-[100px] border-b border-r p-2 transition-colors hover:bg-primary/5 ${isToday ? 'bg-primary/10' : ''}`}>
                            <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold
                                ${isToday ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>
                                {day}
                            </div>
                            <div className="flex flex-col gap-1">
                                {dayTasks.slice(0, 3).map(task => (
                                    <div key={task.id} className={`truncate rounded-lg px-1.5 py-1 text-xs font-medium transition-all hover:scale-[1.02]
                                        ${task.status === 'completed'
                                            ? 'bg-muted text-muted-foreground line-through'
                                            : task.priority === 'high'
                                                ? 'bg-red-500/15 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                : task.priority === 'medium'
                                                    ? 'bg-yellow-500/15 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                                                    : 'bg-blue-500/15 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}>
                                        {task.name}
                                    </div>
                                ))}
                                {dayTasks.length > 3 && (
                                    <span className="text-xs font-semibold text-primary">+{dayTasks.length - 3} más</span>
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
        return (
            <div className="rounded-2xl border-2 border-dashed py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <ClipboardList className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No hay tareas con el filtro actual.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map(task => {
                const isOverdue = task.due_date && task.status === 'pending' && new Date(task.due_date) < new Date();
                return (
                    <Card key={task.id} className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20 ${task.status === 'completed' ? 'opacity-60' : ''}`}>
                        <div className={`absolute top-0 left-0 w-1 h-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                        <CardHeader className="pb-2 pl-5">
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    className="mt-1 shrink-0 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                    checked={task.status === 'completed'}
                                    disabled={task.status === 'completed' && !canAddTask}
                                    onCheckedChange={() => toggleTask(task, canAddTask)}
                                />
                                <CardTitle className={`text-sm font-semibold leading-snug ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.name}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 pl-5">
                            <div className="flex flex-wrap gap-1.5">
                                <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${priorityColors[task.priority]}`}>
                                    {priorityLabels[task.priority]}
                                </span>
                                {task.project && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.project.color || '#3A5A40' }} />
                                        {task.project.name}
                                    </span>
                                )}
                            </div>
                            {task.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                            )}
                            {task.due_date && (
                                <p className={`inline-flex items-center gap-1.5 text-xs ${isOverdue ? 'font-semibold text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                                    {isOverdue ? <AlertCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                                    {isOverdue ? 'Vencida · ' : 'Vence · '}
                                    {new Date(task.due_date).toLocaleDateString('es-ES')}
                                </p>
                            )}
                            <div className="mt-auto flex justify-end gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/tasks/${task.id}/edit`}>
                                    <Button size="sm" variant="ghost" title="Editar" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" title="Eliminar" onClick={() => deleteTask(task)}>
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
    const { props } = usePage<{ flash?: { success?: string }; errors?: { limit?: string } }>();
    const flash = props.flash;
    const errors = props.errors;

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

                {/* Cabecera mejorada */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border-2 p-6">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                                <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Mis tareas</h1>
                                <p className="text-sm text-muted-foreground">
                                    {pending.length} pendiente{pending.length !== 1 ? 's' : ''}
                                    {isFreeUser && <span className="text-orange-600 dark:text-orange-400 ml-1">· máx. 5 activas</span>}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Selector de vista */}
                            <div className="flex rounded-xl border-2 p-1 gap-1 bg-background/50">
                                {viewButtons.map(({ value, icon, title }) => (
                                    <Button key={value} size="sm" variant={view === value ? 'default' : 'ghost'}
                                        className={`h-8 w-8 p-0 rounded-lg transition-all ${view === value ? 'shadow-sm' : ''}`} onClick={() => setView(value)} title={title}>
                                        {icon}
                                    </Button>
                                ))}
                            </div>
                            {canAddTask ? (
                                <Link href="/tasks/create">
                                    <Button className="gap-2 shadow-lg shadow-primary/25">
                                        <Plus className="h-4 w-4" />
                                        Nueva tarea
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/checkout">
                                    <Button variant="outline" className="gap-2 border-2">
                                        <Sparkles className="h-4 w-4" />
                                        Actualizar a Premium
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filtros mejorados */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-xl border-2 p-1 gap-1 bg-background/50">
                        <Button size="sm" variant={!showAll ? 'default' : 'ghost'} className="h-8 px-4 text-xs rounded-lg font-semibold" onClick={() => setShowAll(false)}>Hoy</Button>
                        <Button size="sm" variant={showAll ? 'default' : 'ghost'} className="h-8 px-4 text-xs rounded-lg font-semibold" onClick={() => setShowAll(true)}>Todas</Button>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <div className="flex flex-wrap gap-2">
                        {priorities.map(({ value, label }) => (
                            <Button key={value} size="sm" variant={priorityFilter === value ? 'default' : 'outline'}
                                className={`h-8 px-4 text-xs rounded-lg font-semibold border-2 transition-all ${priorityFilter === value ? 'shadow-sm' : ''}`} onClick={() => setPriorityFilter(value)}>
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Flash mejorado */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border-2 border-green-500/20 px-4 py-3">
                        <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">{flash.success}</span>
                    </div>
                )}
                {errors?.limit && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border-2 border-red-500/20 px-4 py-3">
                        <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">{errors.limit}</span>
                    </div>
                )}

                {/* Sin tareas */}
                {tasks.length === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <ClipboardList className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">Ninguna tarea pendiente</p>
                                <p className="text-sm text-muted-foreground">¿Buen momento para planificar la semana?</p>
                            </div>
                            {canAddTask && (
                                <Link href="/tasks/create">
                                    <Button className="gap-2 shadow-lg shadow-primary/25">
                                        <Plus className="h-4 w-4" />
                                        Crear primera tarea
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                {tasks.length > 0 && filtered.length === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                                <ClipboardList className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-center">
                                {!showAll ? 'No tienes tareas programadas para hoy.' : 'No hay tareas con ese filtro.'}
                            </p>
                            {!showAll && (
                                <Button variant="outline" size="sm" onClick={() => setShowAll(true)} className="gap-2 border-2">
                                    Ver todas las tareas
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Vistas */}
                {filtered.length > 0 && view === 'table' && (
                    <div className="flex flex-col gap-6">
                        {groupByClient(filtered).map(group => {
                            const gPending = group.tasks.filter(t => t.status === 'pending');
                            const gCompleted = group.tasks.filter(t => t.status === 'completed');
                            return (
                                <div key={group.clientId}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} />
                                        <p className="text-sm font-semibold">{group.name ?? 'Sin cliente'}</p>
                                        <span className="text-xs text-muted-foreground">({gPending.length} pendiente{gPending.length !== 1 ? 's' : ''})</span>
                                    </div>
                                    {gPending.length > 0 && <TableView tasks={gPending} canAddTask={canAddTask} />}
                                    {gCompleted.length > 0 && (
                                        <div className="mt-3 opacity-60">
                                            <TableView tasks={gCompleted} canAddTask={canAddTask} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {filtered.length > 0 && view === 'calendar' && (
                    <CalendarView tasks={filtered} />
                )}

                {filtered.length > 0 && view === 'gallery' && (
                    <div className="flex flex-col gap-6">
                        {groupByClient(filtered).map(group => {
                            const gPending = group.tasks.filter(t => t.status === 'pending');
                            const gCompleted = group.tasks.filter(t => t.status === 'completed');
                            return (
                                <div key={group.clientId}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} />
                                        <p className="text-sm font-semibold">{group.name ?? 'Sin cliente'}</p>
                                        <span className="text-xs text-muted-foreground">({gPending.length} pendiente{gPending.length !== 1 ? 's' : ''})</span>
                                    </div>
                                    {gPending.length > 0 && <GalleryView tasks={gPending} canAddTask={canAddTask} />}
                                    {gCompleted.length > 0 && (
                                        <div className="mt-3 opacity-60">
                                            <GalleryView tasks={gCompleted} canAddTask={canAddTask} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
