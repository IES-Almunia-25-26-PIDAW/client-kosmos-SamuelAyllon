import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Table2, Calendar, LayoutGrid, ChevronLeft, ChevronRight, Plus, CheckCircle2, FolderKanban, CalendarDays, ListTodo, Clock, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem, Project, ViewType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Clientes', href: '/clients' },
];

const statusColors: Record<string, string> = {
    inactive:  'bg-muted text-muted-foreground',
    active:    'bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary',
    completed: 'bg-green-500/10 text-green-600 border border-green-500/20 dark:bg-green-900/30 dark:text-green-400',
};

const statusLabels: Record<string, string> = {
    inactive: 'Inactivo', active: 'Activo', completed: 'Completado',
};

function deleteProject(project: Project) {
    if (confirm(`¿Eliminar "${project.name}"? Se eliminarán también sus tareas.`)) {
        router.delete(`/clients/${project.id}`);
    }
}

function toggleComplete(project: Project) {
    router.patch(`/clients/${project.id}/complete`);
}

// ── Vista tabla ─────────────────────────────────────────────────────────────

function TableView({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <FolderKanban className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No hay clientes con el filtro actual.</p>
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
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Estado</th>
                        <th className="hidden p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground sm:table-cell">Tareas</th>
                        <th className="hidden p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground md:table-cell">Pendientes</th>
                        <th className="hidden p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground md:table-cell">Creado</th>
                        <th className="p-4 text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {projects.map(project => (
                        <tr key={project.id} className={`group transition-all hover:bg-primary/5 ${project.status === 'completed' ? 'opacity-60 bg-muted/20' : ''}`}>
                            <td className="p-4">
                                <Checkbox
                                    checked={project.status === 'completed'}
                                    onCheckedChange={() => toggleComplete(project)}
                                    title={project.status === 'completed' ? 'Reabrir' : 'Marcar como completado'}
                                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    {project.color && (
                                        <span className="h-3 w-3 shrink-0 rounded-full shadow-sm" style={{ backgroundColor: project.color }} />
                                    )}
                                    <span className={`font-medium ${project.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                        {project.name}
                                    </span>
                                </div>
                                {project.description && (
                                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                                )}
                            </td>
                            <td className="p-4">
                                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColors[project.status]}`}>
                                    {statusLabels[project.status]}
                                </span>
                            </td>
                            <td className="hidden p-4 sm:table-cell">
                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <ListTodo className="h-3.5 w-3.5" />
                                    {project.tasks_count ?? 0}
                                </span>
                            </td>
                            <td className="hidden p-4 md:table-cell">
                                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${(project.pending_tasks_count ?? 0) > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                    <Clock className="h-3.5 w-3.5" />
                                    {project.pending_tasks_count ?? 0}
                                </span>
                            </td>
                            <td className="hidden p-4 md:table-cell">
                                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {new Date(project.created_at).toLocaleDateString('es-ES')}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/clients/${project.id}`}>
                                        <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg border-2">Ver</Button>
                                    </Link>
                                    <Link href={`/clients/${project.id}/edit`}>
                                        <Button size="sm" variant="ghost" title="Editar" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" title="Eliminar" onClick={() => deleteProject(project)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Vista calendario ────────────────────────────────────────────────────────

function CalendarView({ projects }: { projects: Project[] }) {
    const [viewDate, setViewDate] = useState(new Date());
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let startDow = new Date(year, month, 1).getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;

    // Agrupar proyectos por fecha de creación
    const projectsByDate: Record<string, Project[]> = {};
    projects.forEach(project => {
        const key = project.created_at.substring(0, 10);
        if (!projectsByDate[key]) projectsByDate[key] = [];
        projectsByDate[key].push(project);
    });

    const todayStr = new Date().toISOString().substring(0, 10);
    const monthLabel = viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return (
        <div className="rounded-xl border-2 overflow-hidden bg-card/50">
            <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent px-6 py-4">
                <Button variant="ghost" size="sm" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="font-bold text-lg capitalize">{monthLabel}</span>
                <Button variant="ghost" size="sm" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10">
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            <div className="grid grid-cols-7 border-b bg-muted/30">
                {dayNames.map(d => (
                    <div key={d} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {Array.from({ length: startDow }).map((_, i) => (
                    <div key={`e-${i}`} className="min-h-[100px] border-b border-r bg-muted/10 p-2" />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayProjects = projectsByDate[dateKey] ?? [];
                    const isToday = dateKey === todayStr;

                    return (
                        <div key={day} className={`min-h-[100px] border-b border-r p-2 transition-colors hover:bg-primary/5 ${isToday ? 'bg-primary/10' : ''}`}>
                            <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold
                                ${isToday ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>
                                {day}
                            </div>
                            <div className="flex flex-col gap-1">
                                {dayProjects.slice(0, 3).map(project => (
                                    <div key={project.id} className="flex items-center gap-1.5 truncate rounded-lg px-1.5 py-1 text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary transition-all hover:scale-[1.02]">
                                        {project.color && (
                                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
                                        )}
                                        <span className={`truncate ${project.status === 'completed' ? 'line-through' : ''}`}>
                                            {project.name}
                                        </span>
                                    </div>
                                ))}
                                {dayProjects.length > 3 && (
                                    <span className="text-xs font-semibold text-primary">+{dayProjects.length - 3} más</span>
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

function GalleryView({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <FolderKanban className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No hay clientes con el filtro actual.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
                <Card key={project.id} className={`group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20 ${project.status === 'completed' ? 'opacity-60' : ''}`}>
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: project.color || '#8B5CF6' }} />
                    <CardHeader className="pb-2 pl-5">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                                <Checkbox
                                    className="shrink-0 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                    checked={project.status === 'completed'}
                                    onCheckedChange={() => toggleComplete(project)}
                                    title={project.status === 'completed' ? 'Reabrir proyecto' : 'Marcar como completado'}
                                />
                                {project.color && (
                                    <span className="shrink-0 h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: project.color }} />
                                )}
                                <CardTitle className={`truncate text-base font-semibold ${project.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                    {project.name}
                                </CardTitle>
                            </div>
                            <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColors[project.status]}`}>
                                {statusLabels[project.status]}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3 pl-5">
                        {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex gap-4 text-sm">
                            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                <ListTodo className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">{project.tasks_count ?? 0}</span> tareas
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span className={`font-semibold ${(project.pending_tasks_count ?? 0) > 0 ? 'text-orange-600' : ''}`}>{project.pending_tasks_count ?? 0}</span> pendientes
                            </span>
                        </div>
                        <div className="mt-auto flex gap-2 pt-2">
                            <Link href={`/clients/${project.id}`} className="flex-1">
                                <Button size="sm" variant="outline" className="w-full border-2 rounded-lg">Ver</Button>
                            </Link>
                            <Link href={`/clients/${project.id}/edit`}>
                                <Button size="sm" variant="ghost" title="Editar" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity" title="Eliminar" onClick={() => deleteProject(project)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ── Página principal ────────────────────────────────────────────────────────

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    const { props } = usePage<{ flash?: { success?: string }; auth: Auth }>();
    const flash = props.flash;
    const isPremium = props.auth.is_premium;
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const [view, setView] = useState<ViewType>('gallery');
    const [statusFilter, setStatusFilter] = useState<'all' | 'inactive' | 'active' | 'completed'>('all');

    const filtered = projects.filter(p => statusFilter === 'all' || p.status === statusFilter);

    const statuses: Array<{ value: 'all' | 'inactive' | 'active' | 'completed'; label: string }> = [
        { value: 'all', label: 'Todos' },
        { value: 'inactive', label: 'Inactivo' },
        { value: 'active', label: 'Activo' },
        { value: 'completed', label: 'Completado' },
    ];

    const viewButtons: Array<{ value: ViewType; icon: React.ReactNode; title: string }> = [
        { value: 'table',    icon: <Table2 className="h-4 w-4" />,    title: 'Vista tabla' },
        { value: 'calendar', icon: <Calendar className="h-4 w-4" />,  title: 'Vista calendario' },
        { value: 'gallery',  icon: <LayoutGrid className="h-4 w-4" />, title: 'Vista galería' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Proyectos" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera mejorada */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border-2 p-6">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                                <FolderKanban className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Mis clientes</h1>
                                <p className="text-sm text-muted-foreground">{projects.length} cliente{projects.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex rounded-xl border-2 p-1 gap-1 bg-background/50">
                                {viewButtons.map(({ value, icon, title }) => (
                                    <Button key={value} size="sm" variant={view === value ? 'default' : 'ghost'}
                                        className={`h-8 w-8 p-0 rounded-lg transition-all ${view === value ? 'shadow-sm' : ''}`} onClick={() => setView(value)} title={title}>
                                        {icon}
                                    </Button>
                                ))}
                            </div>
                            <Button className="gap-2 shadow-lg shadow-primary/25" onClick={() => {
                                if (!isPremium && projects.length >= 1) {
                                    setShowUpgradeModal(true);
                                } else {
                                    router.visit('/clients/create');
                                }
                            }}>
                                <Plus className="h-4 w-4" />
                                Nuevo cliente
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filtros por estado mejorados */}
                <div className="flex flex-wrap gap-2">
                    {statuses.map(({ value, label }) => (
                        <Button key={value} size="sm" variant={statusFilter === value ? 'default' : 'outline'}
                            className={`h-8 px-4 text-xs rounded-lg font-semibold border-2 transition-all ${statusFilter === value ? 'shadow-sm' : ''}`} onClick={() => setStatusFilter(value)}>
                            {label}
                        </Button>
                    ))}
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

                {/* Sin proyectos */}
                {projects.length === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <FolderKanban className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">Aquí vivirán tus clientes</p>
                                <p className="text-sm text-muted-foreground">Añade el primero y Flowly recordará todo por ti.</p>
                            </div>
                            <Link href="/clients/create">
                                <Button className="gap-2 shadow-lg shadow-primary/25">
                                    <Plus className="h-4 w-4" />
                                    Crear primer cliente
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {projects.length > 0 && filtered.length === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                                <FolderKanban className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-center">No hay clientes con estado "{statusLabels[statusFilter]}".</p>
                        </CardContent>
                    </Card>
                )}

                {/* Vistas */}
                {filtered.length > 0 && view === 'table'    && <TableView    projects={filtered} />}
                {filtered.length > 0 && view === 'calendar' && <CalendarView projects={filtered} />}
                {filtered.length > 0 && view === 'gallery'  && <GalleryView  projects={filtered} />}

                {/* Modal de upgrade */}
                {showUpgradeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowUpgradeModal(false)}>
                        <Card className="max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <CardContent className="flex flex-col items-center gap-4 p-8">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Crown className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold">Límite alcanzado</p>
                                    <p className="text-sm text-muted-foreground mt-1">Para gestionar varios clientes a la vez, pasa a Solo.</p>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <Button variant="outline" className="flex-1" onClick={() => setShowUpgradeModal(false)}>Cancelar</Button>
                                    <Button asChild className="flex-1 gap-2">
                                        <Link href="/subscription">
                                            <Crown className="h-4 w-4" />
                                            Ver planes
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
