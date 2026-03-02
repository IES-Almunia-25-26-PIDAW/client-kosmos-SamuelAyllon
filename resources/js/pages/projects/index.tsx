import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
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

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    function handleDelete(project: Project) {
        if (confirm(`¿Eliminar "${project.name}"? Se eliminarán también sus tareas.`)) {
            router.delete(`/projects/${project.id}`);
        }
    }

    function handleToggleComplete(project: Project) {
        router.patch(`/projects/${project.id}/complete`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Proyectos" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mis proyectos</h1>
                        <p className="text-sm text-muted-foreground">{projects.length} proyecto{projects.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Link href="/projects/create">
                        <Button>Nuevo proyecto</Button>
                    </Link>
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
                            <Link href="/projects/create">
                                <Button>Crear primer proyecto</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Cuadrícula de proyectos */}
                {projects.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map(project => (
                            <Card key={project.id} className={`flex flex-col ${project.status === 'completed' ? 'opacity-60' : ''}`}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {/* Checkbox de completar */}
                                            <Checkbox
                                                className="shrink-0"
                                                checked={project.status === 'completed'}
                                                onCheckedChange={() => handleToggleComplete(project)}
                                                title={project.status === 'completed' ? 'Reabrir proyecto' : 'Marcar como completado'}
                                            />
                                            {project.color && (
                                                <span
                                                    className="shrink-0 h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: project.color }}
                                                />
                                            )}
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
                                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => handleDelete(project)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
