import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Table2, LayoutGrid, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VoiceRecorder from '@/components/voice-recorder';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, IdeasProps, Idea, SimpleViewType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ideas', href: '/ideas' },
];

const priorityColors: Record<string, string> = {
    high:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

const priorityLabels: Record<string, string> = {
    high: 'Alta', medium: 'Media', low: 'Baja',
};

const statusBadge: Record<string, string> = {
    active:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    resolved: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
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
        return <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No hay ideas con el filtro actual.</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead className="bg-muted/40">
                    <tr>
                        <th className="w-10 p-3" />
                        <th className="p-3 text-left font-medium">Nombre</th>
                        <th className="p-3 text-left font-medium">Prioridad</th>
                        <th className="hidden p-3 text-left font-medium sm:table-cell">Estado</th>
                        <th className="hidden p-3 text-left font-medium md:table-cell">Fecha</th>
                        <th className="p-3 text-right font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {ideas.map(idea => (
                        <tr key={idea.id} className={`transition-colors hover:bg-muted/30 ${idea.status === 'resolved' ? 'opacity-60' : ''}`}>
                            <td className="p-3">
                                <Checkbox
                                    checked={idea.status === 'resolved'}
                                    onCheckedChange={() => toggleIdea(idea)}
                                    title={idea.status === 'active' ? 'Marcar como resuelta' : 'Reactivar idea'}
                                />
                            </td>
                            <td className="p-3">
                                <span className={`font-medium ${idea.status === 'resolved' ? 'line-through text-muted-foreground' : ''}`}>
                                    {idea.name}
                                </span>
                                {idea.description && (
                                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{idea.description}</p>
                                )}
                            </td>
                            <td className="p-3">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[idea.priority]}`}>
                                    {priorityLabels[idea.priority]}
                                </span>
                            </td>
                            <td className="hidden p-3 sm:table-cell">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[idea.status]}`}>
                                    {idea.status === 'active' ? 'Activa' : 'Resuelta'}
                                </span>
                            </td>
                            <td className="hidden p-3 text-xs text-muted-foreground md:table-cell">
                                {new Date(idea.created_at).toLocaleDateString('es-ES')}
                            </td>
                            <td className="p-3">
                                <div className="flex justify-end gap-1">
                                    <Link href={`/ideas/${idea.id}/edit`}>
                                        <Button size="sm" variant="ghost" title="Editar">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => deleteIdea(idea)}>
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
        return <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No hay ideas con el filtro actual.</div>;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map(idea => (
                <Card key={idea.id} className={idea.status === 'resolved' ? 'opacity-60' : ''}>
                    <CardHeader className="pb-2">
                        <div className="flex items-start gap-2">
                            <Checkbox
                                className="mt-0.5 shrink-0"
                                checked={idea.status === 'resolved'}
                                onCheckedChange={() => toggleIdea(idea)}
                                title={idea.status === 'active' ? 'Marcar como resuelta' : 'Reactivar idea'}
                            />
                            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                            <CardTitle className={`text-sm font-medium leading-snug ${idea.status === 'resolved' ? 'line-through text-muted-foreground' : ''}`}>
                                {idea.name}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[idea.priority]}`}>
                                {priorityLabels[idea.priority]}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[idea.status]}`}>
                                {idea.status === 'active' ? 'Activa' : 'Resuelta'}
                            </span>
                        </div>
                        {idea.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{idea.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {new Date(idea.created_at).toLocaleDateString('es-ES')}
                        </p>
                        <div className="mt-auto flex justify-end gap-1 pt-1">
                            <Link href={`/ideas/${idea.id}/edit`}>
                                <Button size="sm" variant="ghost" title="Editar">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => deleteIdea(idea)}>
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
    const { props } = usePage<{ flash?: { success?: string }; auth: { is_premium: boolean } }>();
    const flash = props.flash;
    const isPremium = props.auth.is_premium;

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

                {/* Cabecera */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Mis ideas</h1>
                        <p className="text-sm text-muted-foreground">
                            {active.length} activa{active.length !== 1 ? 's' : ''}
                        </p>
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
                        {isPremium && (
                            <VoiceRecorder
                                onTranscription={(text) => router.post('/ideas', { name: text, priority: 'medium', source: 'voice' })}
                            />
                        )}
                        <Link href="/ideas/create"><Button>Nueva idea</Button></Link>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-1">
                    {priorities.map(({ value, label }) => (
                        <Button key={value} size="sm" variant={priorityFilter === value ? 'default' : 'outline'}
                            className="h-7 px-3 text-xs" onClick={() => setPriorityFilter(value)}>
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

                {/* Sin ideas */}
                {ideas.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                            <p className="text-muted-foreground">No tienes ideas todavía.</p>
                            <Link href="/ideas/create"><Button>Crear primera idea</Button></Link>
                        </CardContent>
                    </Card>
                )}

                {ideas.length > 0 && filtered.length === 0 && (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">No hay ideas con prioridad {priorityLabels[priorityFilter]}.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Vistas — Activas */}
                {active.length > 0 && view === 'table' && (
                    <div>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">Activas ({active.length})</p>
                        <TableView ideas={active} />
                    </div>
                )}
                {active.length > 0 && view === 'gallery' && (
                    <div>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">Activas ({active.length})</p>
                        <GalleryView ideas={active} />
                    </div>
                )}

                {/* Vistas — Resueltas */}
                {resolved.length > 0 && view === 'table' && (
                    <div>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">Resueltas ({resolved.length})</p>
                        <TableView ideas={resolved} />
                    </div>
                )}
                {resolved.length > 0 && view === 'gallery' && (
                    <div>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">Resueltas ({resolved.length})</p>
                        <GalleryView ideas={resolved} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
