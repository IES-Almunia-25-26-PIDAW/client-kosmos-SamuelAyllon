import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Box } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cajas', href: '/boxes' },
];

export default function BoxesIndex({ boxes }: { boxes: Box[] }) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    function handleDelete(box: Box) {
        if (confirm(`¿Eliminar "${box.name}"? Se eliminarán también sus recursos.`)) {
            router.delete(`/boxes/${box.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cajas" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mis cajas</h1>
                        <p className="text-sm text-muted-foreground">{boxes.length} caja{boxes.length !== 1 ? 's' : ''} de conocimiento</p>
                    </div>
                    <Link href="/boxes/create">
                        <Button>Nueva caja</Button>
                    </Link>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Sin cajas */}
                {boxes.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                            <p className="text-muted-foreground">No tienes cajas todavía.</p>
                            <p className="text-sm text-muted-foreground">Las cajas te permiten organizar recursos como enlaces, documentos y videos.</p>
                            <Link href="/boxes/create">
                                <Button>Crear primera caja</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Cuadrícula */}
                {boxes.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {boxes.map(box => (
                            <Card key={box.id} className="flex flex-col">
                                <CardHeader className="pb-2">
                                    <CardTitle className="truncate text-base">{box.name}</CardTitle>
                                    {box.category && (
                                        <span className="text-xs text-muted-foreground">{box.category}</span>
                                    )}
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col gap-3">
                                    {box.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">{box.description}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground">{box.resources_count ?? 0}</span> recurso{(box.resources_count ?? 0) !== 1 ? 's' : ''}
                                    </p>
                                    <div className="mt-auto flex gap-2">
                                        <Link href={`/boxes/${box.id}`} className="flex-1">
                                            <Button size="sm" variant="outline" className="w-full">Ver</Button>
                                        </Link>
                                        <Link href={`/boxes/${box.id}/edit`}>
                                            <Button size="sm" variant="outline">Editar</Button>
                                        </Link>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(box)}>
                                            Eliminar
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