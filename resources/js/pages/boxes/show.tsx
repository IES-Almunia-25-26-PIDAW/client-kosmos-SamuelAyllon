import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Box, Resource } from '@/types';

interface Props {
    box: Box;
}

const typeColors: Record<string, string> = {
    link:     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    document: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    video:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    image:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    other:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

const typeLabels: Record<string, string> = {
    link: 'Enlace', document: 'Documento', video: 'Video', image: 'Imagen', other: 'Otro',
};

export default function BoxShow({ box }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cajas', href: '/boxes' },
        { title: box.name, href: `/boxes/${box.id}` },
    ];

    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const resources = box.resources ?? [];

    function handleDeleteResource(resource: Resource) {
        if (confirm(`¿Eliminar "${resource.name}"?`)) {
            router.delete(`/resources/${resource.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={box.name} />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="truncate text-2xl font-bold">{box.name}</h1>
                        <div className="flex items-center gap-2">
                            {box.category && (
                                <span className="text-sm text-muted-foreground">{box.category}</span>
                            )}
                            {box.description && (
                                <p className="text-sm text-muted-foreground">{box.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Link href={`/boxes/${box.id}/resources/create`}>
                            <Button>+ Añadir recurso</Button>
                        </Link>
                        <Link href={`/boxes/${box.id}/edit`}>
                            <Button variant="outline">Editar</Button>
                        </Link>
                        <Link href="/boxes">
                            <Button variant="outline">← Volver</Button>
                        </Link>
                    </div>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Sin recursos */}
                {resources.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                            <p className="text-muted-foreground">Esta caja está vacía.</p>
                            <Link href={`/boxes/${box.id}/resources/create`}>
                                <Button>Añadir primer recurso</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Recursos */}
                {resources.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Recursos ({resources.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {resources.map((resource: Resource) => (
                                <div key={resource.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4">

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-medium">{resource.name}</p>
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[resource.type]}`}>
                                                {typeLabels[resource.type]}
                                            </span>
                                        </div>
                                        {resource.description && (
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                                        )}
                                        {resource.url && (
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 block truncate text-xs text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {resource.url}
                                            </a>
                                        )}
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex shrink-0 gap-2">
                                        <Link href={`/resources/${resource.id}/edit`}>
                                            <Button size="sm" variant="outline">Editar</Button>
                                        </Link>
                                        <Button size="sm" variant="destructive" onClick={() => handleDeleteResource(resource)}>
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
