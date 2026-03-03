import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Table2, Calendar, LayoutGrid, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Proyectos', href: '/projects' },
];

const statusColors: Record<string, string> = {
    created:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    active:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const statusLabels: Record<string, string> = {
    created: 'Creado', active: 'Activo', completed: 'Completado',
};

type ViewType = 'table' | 'calendar' | 'gallery';

function deleteProject(project: Project) {
    if (confirm(`¿Eliminar "${project.name}"? Se eliminarán también sus tareas.`)) {
        router.delete(`/projects/${project.id}`);
    }
}

function toggleComplete(project: Project) {
    router.patch(`/projects/${project.id}/complete`);
}

// ── Vista tabla ─────────────────────────────────────────────────────────────

function TableView({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
        return <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No hay proyectos con el filtro actual.</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead className="bg-muted/40">
                    <tr>
                        <th className="w-10 p-3" />
                        <th className="p-3 text-left font-medium">Nombre</th>
                        <th className="p-3 text-left font-medium">Estado</th>
                        <th className="hidden p-3 text-left font-medium sm:table-cell">Tareas</th>
                        <th className="hidden p-3 text-left font-medium md:table-cell">Pendientes</th>
                        <th className="hidden p-3 text-left font-medium md:table-cell">Creado</th>
                        <th className="p-3 text-right font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {projects.map(project => (
                        <tr key={project.id} className={`transition-colors hover:bg-muted/30 ${project.status === 'completed' ? 'opacity-60' : ''}`}>
                            <td className="p-3">
                                <Checkbox
                                    checked={project.status === 'completed'}
                                    onCheckedChange={() => toggleComplete(project)}
                                    title={project.status === 'completed' ? 'Reabrir' : 'Marcar como completado'}
                                />
                            </td>
                            <td className="p-3">
                                <div className="flex items-center gap-2">
                                    {project.color && (
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
                                    )}
                                    <span className={`font-medium ${project.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                        {project.name}
                                    </span>
                                </div>
                                {project.description && (
                                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                                )}
                            </td>
                            <td className="p-3">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>
                                    {statusLabels[project.status]}
                                </span>
                            </td>
                            <td className="hidden p-3 text-muted-foreground sm:table-cell">
                                {project.tasks_count ?? 0}
                            </td>
                            <td className="hidden p-3 text-orange-600 font-medium md:table-cell">
                                {project.pending_tasks_count ?? 0}
                            </td>
                            <td className="hidden p-3 text-xs text-muted-foreground md:table-cell">
                                {new Date(project.created_at).toLocaleDateString('es-ES')}
                            </td>
                            <td className="p-3">
                                <div className="flex justify-end gap-1">
                                    <Link href={`/projects/${project.id}`}>
                                        <Button size="sm" variant="ghost" title="Ver">Ver</Button>
                                    </Link>
                                    <Link href={`/projects/${project.id}/edit`}>
                                        <Button size="sm" variant="ghost" title="Editar">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => deleteProject(project)}>
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
        <div className="rounded-lg border overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                <Button variant="ghost" size="sm" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium capitalize">{monthLabel}</span>
                <Button variant="ghost" size="sm" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-7 border-b">
                {dayNames.map(d => (
                    <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {Array.from({ length: startDow }).map((_, i) => (
                    <div key={`e-${i}`} className="min-h-[90px] border-b border-r bg-muted/10 p-1" />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayProjects = projectsByDate[dateKey] ?? [];
                    const isToday = dateKey === todayStr;

                    return (
                        <div key={day} className={`min-h-[90px] border-b border-r p-1 ${isToday ? 'bg-primary/5' : ''}`}>
                            <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium
                                ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                                {day}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {dayProjects.slice(0, 3).map(project => (
                                    <div key={project.id} className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-xs bg-muted text-muted-foreground">
                                        {project.color && (
                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
                                        )}
                                        <span className={`truncate ${project.status === 'completed' ? 'line-through' : ''}`}>
                                            {project.name}
                                        </span>
                                    </div>
                                ))}
                                {dayProjects.length > 3 && (
                                    <span className="text-xs text-muted-foreground">+{dayProjects.length - 3} más</span>
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
        return <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No hay proyectos con el filtro actual.</div>;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
                <Card key={project.id} className={`flex flex-col ${project.status === 'completed' ? 'opacity-60' : ''}`}>
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <Checkbox
                                    className="shrink-0"
                                    checked={project.status === 'completed'}
                                    onCheckedChange={() => toggleComplete(project)}
                                    title={project.status === 'completed' ? 'Reabrir proyecto' : 'Marcar como completado'}
                                />
                                {project.color && (
                                    <span className="shrink-0 h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
                                )}
                                <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
                                <CardTitle className={`truncate text-base ${project.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                    {project.name}
                                </CardTitle>
                            </div>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>
                                {statusLabels[project.status]}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3">
                        {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex gap-4 text-sm">
                            <span className="text-muted-foreground">
                                <span className="font-medium text-foreground">{project.tasks_count ?? 0}</span> tareas
                            </span>
                            <span className="text-muted-foreground">
                                <span className="font-medium text-orange-600">{project.pending_tasks_count ?? 0}</span> pendientes
                            </span>
                        </div>
                        <div className="mt-auto flex gap-2">
                            <Link href={`/projects/${project.id}`} className="flex-1">
                                <Button size="sm" variant="outline" className="w-full">Ver</Button>
                            </Link>
                            <Link href={`/projects/${project.id}/edit`}>
                                <Button size="sm" variant="ghost" title="Editar">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => deleteProject(project)}>
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
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const [view, setView] = useState<ViewType>('gallery');
    const [statusFilter, setStatusFilter] = useState<'all' | 'created' | 'active' | 'completed'>('all');

    const filtered = projects.filter(p => statusFilter === 'all' || p.status === statusFilter);

    const statuses: Array<{ value: 'all' | 'created' | 'active' | 'completed'; label: string }> = [
        { value: 'all', label: 'Todos' },
        { value: 'created', label: 'Creado' },
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

                {/* Cabecera */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Mis proyectos</h1>
                        <p className="text-sm text-muted-foreground">{projects.length} proyecto{projects.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border p-0.5 gap-0.5">
                            {viewButtons.map(({ value, icon, title }) => (
                                <Button key={value} size="sm" variant={view === value ? 'default' : 'ghost'}
                                    className="h-7 w-7 p-0" onClick={() => setView(value)} title={title}>
                                    {icon}
                                </Button>
                            ))}
                        </div>
                        <Link href="/projects/create"><Button>Nuevo proyecto</Button></Link>
                    </div>
                </div>

                {/* Filtros por estado */}
                <div className="flex flex-wrap gap-1">
                    {statuses.map(({ value, label }) => (
                        <Button key={value} size="sm" variant={statusFilter === value ? 'default' : 'outline'}
                            className="h-7 px-3 text-xs" onClick={() => setStatusFilter(value)}>
                            {label}
                        </Button>
                    ))}
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Sin proyectos */}
                {projects.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                            <p className="text-muted-foreground">No tienes proyectos todavía.</p>
                            <Link href="/projects/create"><Button>Crear primer proyecto</Button></Link>
                        </CardContent>
                    </Card>
                )}

                {projects.length > 0 && filtered.length === 0 && (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">No hay proyectos con estado "{statusLabels[statusFilter]}".</p>
                        </CardContent>
                    </Card>
                )}

                {/* Vistas */}
                {filtered.length > 0 && view === 'table'    && <TableView    projects={filtered} />}
                {filtered.length > 0 && view === 'calendar' && <CalendarView projects={filtered} />}
                {filtered.length > 0 && view === 'gallery'  && <GalleryView  projects={filtered} />}
            </div>
        </AppLayout>
    );
}
