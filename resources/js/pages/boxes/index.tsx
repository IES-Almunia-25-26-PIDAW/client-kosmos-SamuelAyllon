import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
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

    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Categorías únicas existentes en las cajas del usuario
    const categories = [...new Set(boxes.map(b => b.category).filter((c): c is string => c !== null && c !== ''))];

    const filtered = boxes.filter(b => categoryFilter === 'all' || b.category === categoryFilter);

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

                {/* Filtros por categoría */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        <Button
                            size="sm"
                            variant={categoryFilter === 'all' ? 'default' : 'outline'}
                            className="h-7 px-3 text-xs"
                            onClick={() => setCategoryFilter('all')}
                        >
                            Todas
                        </Button>
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                size="sm"
                                variant={categoryFilter === cat ? 'default' : 'outline'}
                                className="h-7 px-3 text-xs"
                                onClick={() => setCategoryFilter(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                )}

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

                {boxes.length > 0 && filtered.length === 0 && (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">No hay cajas en la categoría "{categoryFilter}".</p>
                        </CardContent>
                    </Card>
                )}

                {/* Cuadrícula */}
                {filtered.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map(box => (
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
                                            <Button size="sm" variant="ghost" title="Editar">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => handleDelete(box)}>
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
