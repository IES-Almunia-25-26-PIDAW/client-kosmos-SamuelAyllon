import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, IdeasProps, Idea } from '@/types';

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

function IdeaCard({ idea }: { idea: Idea }) {
    function handleToggle() {
        if (idea.status === 'active') {
            router.patch(`/ideas/${idea.id}/resolve`);
        } else {
            router.patch(`/ideas/${idea.id}/reactivate`);
        }
    }

    function handleDelete() {
        if (confirm(`¿Eliminar "${idea.name}"?`)) {
            router.delete(`/ideas/${idea.id}`);
        }
    }

    return (
        <div className={`flex items-start gap-3 rounded-lg border p-4 ${idea.status === 'resolved' ? 'opacity-60' : ''}`}>

            {/* Checkbox */}
            <Checkbox
                className="mt-0.5 shrink-0"
                checked={idea.status === 'resolved'}
                onCheckedChange={handleToggle}
                title={idea.status === 'active' ? 'Marcar como resuelta' : 'Reactivar idea'}
            />

            {/* Contenido */}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className={`font-medium ${idea.status === 'resolved' ? 'line-through text-muted-foreground' : ''}`}>
                        {idea.name}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[idea.priority]}`}>
                        {priorityLabels[idea.priority]}
                    </span>
                </div>
                {idea.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(idea.created_at).toLocaleDateString('es-ES')}
                </p>
            </div>

            {/* Acciones */}
            <div className="flex shrink-0 gap-1">
                <Link href={`/ideas/${idea.id}/edit`}>
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

export default function IdeasIndex({ ideas }: IdeasProps) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const active = ideas.filter(i => i.status === 'active');
    const resolved = ideas.filter(i => i.status === 'resolved');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ideas" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mis ideas</h1>
                        <p className="text-sm text-muted-foreground">
                            {active.length} activa{active.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link href="/ideas/create">
                        <Button>Nueva idea</Button>
                    </Link>
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
                            <Link href="/ideas/create">
                                <Button>Crear primera idea</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Activas */}
                {active.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Activas ({active.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {active.map(idea => (
                                <IdeaCard key={idea.id} idea={idea} />
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Resueltas */}
                {resolved.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Resueltas ({resolved.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {resolved.map(idea => (
                                <IdeaCard key={idea.id} idea={idea} />
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
