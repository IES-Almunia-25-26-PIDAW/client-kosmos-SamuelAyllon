import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Task, Idea, Resource } from '@/types';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    ExternalLink,
    FileText,
    Lightbulb,
    Link2,
    Pencil,
    Plus,
    Sparkles,
    AlertCircle,
    FolderKanban,
    Loader2,
    X,
    Copy,
    Check,
} from 'lucide-react';

interface TasksSummary {
    total: number;
    pending: number;
    completed: number;
}

interface Props {
    project: Project;
    recentCompleted: Task[];
    upcomingPending: Task[];
    ideas: Idea[];
    resources: Resource[];
    tasksSummary: TasksSummary;
    progressPercentage: number;
    isPremium: boolean;
}

const priorityColors: Record<string, string> = {
    high:   'bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:    'bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-900/30 dark:text-blue-400',
};

const priorityLabels: Record<string, string> = {
    high: 'Alta', medium: 'Media', low: 'Baja',
};

const statusColors: Record<string, string> = {
    inactive:  'bg-muted text-muted-foreground',
    active:    'bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary',
    completed: 'bg-green-500/10 text-green-600 border border-green-500/20 dark:bg-green-900/30 dark:text-green-400',
};

const statusLabels: Record<string, string> = {
    inactive: 'Inactivo', active: 'Activo', completed: 'Completado',
};

const resourceTypeIcons: Record<string, string> = {
    link: '🔗', document: '📄', video: '🎬', image: '🖼️', other: '📎',
};

export default function ProjectShow({ project, recentCompleted, upcomingPending, ideas, resources, tasksSummary, progressPercentage, isPremium }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Clientes', href: '/clients' },
        { title: project.name, href: `/clients/${project.id}` },
    ];

    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryResult, setSummaryResult] = useState<string | null>(null);
    const [summaryCopied, setSummaryCopied] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateResult, setUpdateResult] = useState<string | null>(null);
    const [updateCopied, setUpdateCopied] = useState(false);

    const csrfToken = () =>
        decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '');

    const handleSummary = () => {
        setSummaryLoading(true);
        setSummaryResult(null);
        fetch(`/ai/client-summary/${project.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrfToken(),
            },
        })
            .then(res => res.json())
            .then(data => setSummaryResult(data.output ?? 'Sin respuesta.'))
            .catch(() => setSummaryResult('Error al conectar con la IA.'))
            .finally(() => setSummaryLoading(false));
    };

    const handleUpdate = () => {
        setUpdateLoading(true);
        setUpdateResult(null);
        fetch(`/ai/client-update/${project.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrfToken(),
            },
        })
            .then(res => res.json())
            .then(data => setUpdateResult(data.output ?? 'Sin respuesta.'))
            .catch(() => setUpdateResult('Error al conectar con la IA.'))
            .finally(() => setUpdateLoading(false));
    };

    const copyText = (text: string, setter: (v: boolean) => void) => {
        navigator.clipboard.writeText(text);
        setter(true);
        setTimeout(() => setter(false), 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera del cliente */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border-2 p-6">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                            <div
                                className="h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: project.color || '#3B82F6' }}
                            >
                                <FolderKanban className="h-6 w-6 text-white" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold truncate">{project.name}</h1>
                                    <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColors[project.status]}`}>
                                        {statusLabels[project.status]}
                                    </span>
                                </div>
                                {project.description && (
                                    <p className="text-sm text-muted-foreground">{project.description}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                            {isPremium && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-2"
                                        disabled={summaryLoading}
                                        onClick={handleSummary}
                                    >
                                        {summaryLoading
                                            ? <Loader2 className="h-4 w-4 animate-spin" />
                                            : <Sparkles className="h-4 w-4" />
                                        }
                                        Resume cliente
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-2"
                                        disabled={updateLoading}
                                        onClick={handleUpdate}
                                    >
                                        {updateLoading
                                            ? <Loader2 className="h-4 w-4 animate-spin" />
                                            : <FileText className="h-4 w-4" />
                                        }
                                        Genera update
                                    </Button>
                                </>
                            )}
                            <Link href={`/clients/${project.id}/edit`}>
                                <Button variant="outline" size="sm" className="gap-2 border-2">
                                    <Pencil className="h-4 w-4" />
                                    Editar
                                </Button>
                            </Link>
                            <Link href="/clients">
                                <Button variant="outline" size="sm" className="gap-2 border-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Volver
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border-2 border-green-500/20 px-4 py-3">
                        <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">{flash.success}</span>
                    </div>
                )}

                {/* Resultado de Resume cliente */}
                {summaryResult && (
                    <Card className="overflow-hidden border-l-4 border-l-primary bg-ai-surface glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-base">Resumen del cliente</CardTitle>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => copyText(summaryResult, setSummaryCopied)} className="h-8 w-8 p-0">
                                    {summaryCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setSummaryResult(null)} className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <p className="text-sm whitespace-pre-line">{summaryResult}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Resultado de Genera update */}
                {updateResult && (
                    <Card className="overflow-hidden border-l-4 border-l-primary bg-ai-surface glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-base">Update para el cliente</CardTitle>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => copyText(updateResult, setUpdateCopied)} className="h-8 w-8 p-0">
                                    {updateCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setUpdateResult(null)} className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <p className="text-sm whitespace-pre-line">{updateResult}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Estadísticas rápidas */}
                <div className="grid gap-4 sm:grid-cols-4">
                    <Card className="border-2">
                        <CardContent className="pt-4">
                            <p className="text-2xl font-bold">{tasksSummary.total}</p>
                            <p className="text-xs text-muted-foreground">Total tareas</p>
                        </CardContent>
                    </Card>
                    <Card className="border-2">
                        <CardContent className="pt-4">
                            <p className="text-2xl font-bold text-orange-600">{tasksSummary.pending}</p>
                            <p className="text-xs text-muted-foreground">Pendientes</p>
                        </CardContent>
                    </Card>
                    <Card className="border-2">
                        <CardContent className="pt-4">
                            <p className="text-2xl font-bold text-green-600">{tasksSummary.completed}</p>
                            <p className="text-xs text-muted-foreground">Completadas</p>
                        </CardContent>
                    </Card>
                    <Card className="border-2">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-2xl font-bold">{progressPercentage}%</p>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-muted">
                                <div className="h-1.5 rounded-full bg-green-500 transition-all" style={{ width: `${progressPercentage}%` }} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Progreso</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* BLOQUE 1: Contexto estático */}
                    {isPremium && (project.brand_tone || project.service_scope || project.client_notes || (project.key_links && project.key_links.length > 0)) && (
                        <Card className="overflow-hidden border-2">
                            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-base">Contexto del cliente</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 pt-4">
                                {project.service_scope && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Servicio</p>
                                        <p className="text-sm">{project.service_scope}</p>
                                    </div>
                                )}
                                {project.brand_tone && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tono de marca</p>
                                        <p className="text-sm">{project.brand_tone}</p>
                                    </div>
                                )}
                                {project.client_notes && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notas</p>
                                        <p className="text-sm whitespace-pre-line">{project.client_notes}</p>
                                    </div>
                                )}
                                {project.key_links && project.key_links.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Enlaces clave</p>
                                        <div className="flex flex-col gap-1.5">
                                            {project.key_links.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                                >
                                                    <Link2 className="h-3.5 w-3.5 shrink-0" />
                                                    {link.label}
                                                    <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* BLOQUE 2: Timeline */}
                    <Card className="overflow-hidden border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-base">Timeline</CardTitle>
                            </div>
                            <Link href={`/tasks/create?project_id=${project.id}`}>
                                <Button size="sm" variant="outline" className="gap-1.5 h-8 border-2">
                                    <Plus className="h-3.5 w-3.5" />
                                    Tarea
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 pt-4">
                            {/* Próximas pendientes */}
                            {upcomingPending.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Próximas</p>
                                    <div className="flex flex-col gap-1.5">
                                        {upcomingPending.map(task => {
                                            const isOverdue = task.due_date && new Date(task.due_date) < new Date(new Date().toDateString());
                                            return (
                                                <div key={task.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-3 transition-all hover:bg-muted/50">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <span className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold ${priorityColors[task.priority]}`}>
                                                            {priorityLabels[task.priority]}
                                                        </span>
                                                        <span className="truncate text-sm font-medium">{task.name}</span>
                                                        {isOverdue && <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {task.due_date && (
                                                            <span className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                                                                {new Date(task.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                            </span>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => router.patch(`/tasks/${task.id}/complete`)}
                                                            className="h-7 w-7 p-0 text-green-600 hover:bg-green-500/10 rounded-lg"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            {/* Últimas completadas */}
                            {recentCompleted.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Completadas recientemente</p>
                                    <div className="flex flex-col gap-1.5">
                                        {recentCompleted.map(task => (
                                            <div key={task.id} className="flex items-center justify-between rounded-xl bg-muted/20 p-3 opacity-60">
                                                <span className="text-sm line-through text-muted-foreground truncate">{task.name}</span>
                                                {task.completed_at && (
                                                    <span className="text-xs text-muted-foreground shrink-0">
                                                        {new Date(task.completed_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {upcomingPending.length === 0 && recentCompleted.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <p className="text-sm text-muted-foreground">Crea la primera tarea para iniciar el timeline.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* BLOQUE 3: Notas/Ideas vinculadas */}
                    <Card className="overflow-hidden border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Lightbulb className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-base">Notas</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 pt-4">
                            {ideas.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <p className="text-sm text-muted-foreground">Las notas rápidas van aquí. Vincula cada una a un cliente para no perder contexto.</p>
                                </div>
                            ) : (
                                ideas.map(idea => (
                                    <div key={idea.id} className="rounded-xl bg-muted/30 p-3 transition-all hover:bg-muted/50">
                                        <div className="flex items-center gap-2">
                                            <span className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold ${priorityColors[idea.priority]}`}>
                                                {priorityLabels[idea.priority]}
                                            </span>
                                            <p className="text-sm font-medium truncate">{idea.name}</p>
                                        </div>
                                        {idea.description && (
                                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{idea.description}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* BLOQUE 4: Recursos (solo premium) */}
                    {isPremium && (
                        <Card className="overflow-hidden border-2">
                            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Link2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-base">Recursos</CardTitle>
                                </div>
                                <Link href={`/clients/${project.id}/resources/create`}>
                                    <Button size="sm" variant="outline" className="gap-1.5 h-8 border-2">
                                        <Plus className="h-3.5 w-3.5" />
                                        Recurso
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 pt-4">
                                {resources.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                        <p className="text-sm text-muted-foreground">Añade enlaces, briefs y archivos útiles para este cliente.</p>
                                    </div>
                                ) : (
                                    resources.map(resource => (
                                        <div key={resource.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-3 transition-all hover:bg-muted/50">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-base shrink-0">{resourceTypeIcons[resource.type] || '📎'}</span>
                                                <span className="text-sm font-medium truncate">{resource.name}</span>
                                            </div>
                                            {resource.url && (
                                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-primary hover:text-primary/80">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
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
