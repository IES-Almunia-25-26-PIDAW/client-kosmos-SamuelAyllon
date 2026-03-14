import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Table2, LayoutGrid, Lightbulb, Plus, CheckCircle2, Sparkles, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, IdeasProps, Idea, SimpleViewType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ideas', href: '/ideas' },
];

const priorityColors: Record<string, string> = {
    high:   'bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:    'bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-900/30 dark:text-blue-400',
};

const priorityLabels: Record<string, string> = {
    high: 'Alta', medium: 'Media', low: 'Baja',
};

const statusBadge: Record<string, string> = {
    active:   'bg-green-500/10 text-green-600 border border-green-500/20 dark:bg-green-900/30 dark:text-green-400',
    resolved: 'bg-muted text-muted-foreground',
};

function toggleIdea(idea: Idea) {
    if (idea.status === 'active') router.patch(`/ideas/${idea.id}/resolve`);
    else router.patch(`/ideas/${idea.id}/reactivate`);
}

function deleteIdea(idea: Idea) {
    if (confirm(`¿Eliminar "${idea.name}"?`)) router.delete(`/ideas/${idea.id}`);
}

// ── Vista tabla ─────────────────────────────────────────────────────────────

function TableView({ ideas }: { ideas: Idea[] }) {
    if (ideas.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Lightbulb className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No hay ideas con el filtro actual.</p>
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
                        <th className="hidden p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground sm:table-cell">Estado</th>
                        <th className="hidden p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground md:table-cell">Fecha</th>
                        <th className="p-4 text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {ideas.map(idea => (
                        <tr key={idea.id} className={`group transition-all hover:bg-primary/5 ${idea.status === 'resolved' ? 'opacity-60 bg-muted/20' : ''}`}>
                            <td className="p-4">
                                <Checkbox
                                    checked={idea.status === 'resolved'}
                                    onCheckedChange={() => toggleIdea(idea)}
                                    title={idea.status === 'active' ? 'Marcar como resuelta' : 'Reactivar idea'}
                                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                            </td>
                            <td className="p-4">
                                <span className={`font-medium ${idea.status === 'resolved' ? 'line-through text-muted-foreground' : ''}`}>
                                    {idea.name}
                                </span>
                                {idea.description && (
                                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{idea.description}</p>
                                )}
                            </td>
                            <td className="p-4">
                                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${priorityColors[idea.priority]}`}>
                                    {priorityLabels[idea.priority]}
                                </span>
                            </td>
                            <td className="hidden p-4 sm:table-cell">
                                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusBadge[idea.status]}`}>
                                    {idea.status === 'active' ? 'Activa' : 'Resuelta'}
                                </span>
                            </td>
                            <td className="hidden p-4 md:table-cell">
                                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {new Date(idea.created_at).toLocaleDateString('es-ES')}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/ideas/${idea.id}/edit`}>
                                        <Button size="sm" variant="ghost" title="Editar" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" title="Eliminar" onClick={() => deleteIdea(idea)}>
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

// ── Vista galería ───────────────────────────────────────────────────────────

function GalleryView({ ideas }: { ideas: Idea[] }) {
    if (ideas.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Lightbulb className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No hay ideas con el filtro actual.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map(idea => (
                <Card key={idea.id} className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20 ${idea.status === 'resolved' ? 'opacity-60' : ''}`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${idea.priority === 'high' ? 'bg-red-500' : idea.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                    <CardHeader className="pb-2 pl-5">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                className="mt-1 shrink-0 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                checked={idea.status === 'resolved'}
                                onCheckedChange={() => toggleIdea(idea)}
                                title={idea.status === 'active' ? 'Marcar como resuelta' : 'Reactivar idea'}
                            />
                            <CardTitle className={`text-sm font-semibold leading-snug ${idea.status === 'resolved' ? 'line-through text-muted-foreground' : ''}`}>
                                {idea.name}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 pl-5">
                        <div className="flex flex-wrap gap-1.5">
                            <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${priorityColors[idea.priority]}`}>
                                {priorityLabels[idea.priority]}
                            </span>
                            <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${statusBadge[idea.status]}`}>
                                {idea.status === 'active' ? 'Activa' : 'Resuelta'}
                            </span>
                        </div>
                        {idea.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{idea.description}</p>
                        )}
                        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(idea.created_at).toLocaleDateString('es-ES')}
                        </p>
                        <div className="mt-auto flex justify-end gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/ideas/${idea.id}/edit`}>
                                <Button size="sm" variant="ghost" title="Editar" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" title="Eliminar" onClick={() => deleteIdea(idea)}>
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

export default function IdeasIndex({ ideas }: IdeasProps) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const [view, setView] = useState<SimpleViewType>('table');
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

    const filtered = ideas.filter(i => priorityFilter === 'all' || i.priority === priorityFilter);
    const active = filtered.filter(i => i.status === 'active');
    const resolved = filtered.filter(i => i.status === 'resolved');

    const priorities: Array<{ value: 'all' | 'high' | 'medium' | 'low'; label: string }> = [
        { value: 'all', label: 'Todas' },
        { value: 'high', label: 'Alta' },
        { value: 'medium', label: 'Media' },
        { value: 'low', label: 'Baja' },
    ];

    const viewButtons: Array<{ value: SimpleViewType; icon: React.ReactNode; title: string }> = [
        { value: 'table',   icon: <Table2 className="h-4 w-4" />,    title: 'Vista tabla' },
        { value: 'gallery', icon: <LayoutGrid className="h-4 w-4" />, title: 'Vista galería' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ideas" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera mejorada */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border-2 p-6">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                                <Lightbulb className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Mis ideas</h1>
                                <p className="text-sm text-muted-foreground">
                                    {active.length} activa{active.length !== 1 ? 's' : ''}
                                </p>
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
                            <Link href="/ideas/create">
                                <Button className="gap-2 shadow-lg shadow-primary/25">
                                    <Plus className="h-4 w-4" />
                                    Nueva idea
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filtros mejorados */}
                <div className="flex flex-wrap gap-2">
                    {priorities.map(({ value, label }) => (
                        <Button key={value} size="sm" variant={priorityFilter === value ? 'default' : 'outline'}
                            className={`h-8 px-4 text-xs rounded-lg font-semibold border-2 transition-all ${priorityFilter === value ? 'shadow-sm' : ''}`} onClick={() => setPriorityFilter(value)}>
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

                {/* Sin ideas */}
                {ideas.length === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Lightbulb className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">Las notas rápidas van aquí</p>
                                <p className="text-sm text-muted-foreground">Vincula cada una a un cliente para no perder contexto.</p>
                            </div>
                            <Link href="/ideas/create">
                                <Button className="gap-2 shadow-lg shadow-primary/25">
                                    <Plus className="h-4 w-4" />
                                    Crear primera idea
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {ideas.length > 0 && filtered.length === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                                <Lightbulb className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-center">No hay ideas con prioridad {priorityLabels[priorityFilter]}.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Vistas — Activas */}
                {active.length > 0 && view === 'table' && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-6 w-6 rounded-md bg-yellow-500/10 flex items-center justify-center">
                                <Sparkles className="h-3.5 w-3.5 text-yellow-600" />
                            </div>
                            <p className="text-sm font-semibold">Activas ({active.length})</p>
                        </div>
                        <TableView ideas={active} />
                    </div>
                )}
                {active.length > 0 && view === 'gallery' && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-6 w-6 rounded-md bg-yellow-500/10 flex items-center justify-center">
                                <Sparkles className="h-3.5 w-3.5 text-yellow-600" />
                            </div>
                            <p className="text-sm font-semibold">Activas ({active.length})</p>
                        </div>
                        <GalleryView ideas={active} />
                    </div>
                )}

                {/* Vistas — Resueltas */}
                {resolved.length > 0 && view === 'table' && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-6 w-6 rounded-md bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                            </div>
                            <p className="text-sm font-semibold">Resueltas ({resolved.length})</p>
                        </div>
                        <TableView ideas={resolved} />
                    </div>
                )}
                {resolved.length > 0 && view === 'gallery' && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-6 w-6 rounded-md bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                            </div>
                            <p className="text-sm font-semibold">Resueltas ({resolved.length})</p>
                        </div>
                        <GalleryView ideas={resolved} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
