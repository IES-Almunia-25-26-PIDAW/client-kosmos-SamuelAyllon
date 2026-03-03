import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Table2, LayoutGrid, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Box, SimpleViewType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cajas', href: '/boxes' },
];

function deleteBox(box: Box) {
    if (confirm(`¿Eliminar "${box.name}"? Se eliminarán también sus recursos.`)) {
        router.delete(`/boxes/${box.id}`);
    }
}

// ── Vista tabla ─────────────────────────────────────────────────────────────

function TableView({ boxes }: { boxes: Box[] }) {
    if (boxes.length === 0) {
        return <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No hay cajas con el filtro actual.</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead className="bg-muted/40">
                    <tr>
                        <th className="p-3 text-left font-medium">Nombre</th>
                        <th className="hidden p-3 text-left font-medium sm:table-cell">Categoría</th>
                        <th className="hidden p-3 text-left font-medium md:table-cell">Descripción</th>
                        <th className="p-3 text-left font-medium">Recursos</th>
                        <th className="p-3 text-right font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {boxes.map(box => (
                        <tr key={box.id} className="transition-colors hover:bg-muted/30">
                            <td className="p-3 font-medium">{box.name}</td>
                            <td className="hidden p-3 text-muted-foreground sm:table-cell">
                                {box.category ?? '—'}
                            </td>
                            <td className="hidden p-3 text-muted-foreground md:table-cell">
                                <span className="line-clamp-1">{box.description ?? '—'}</span>
                            </td>
                            <td className="p-3 text-muted-foreground">
                                <span className="font-medium text-foreground">{box.resources_count ?? 0}</span>
                            </td>
                            <td className="p-3">
                                <div className="flex justify-end gap-1">
                                    <Link href={`/boxes/${box.id}`}>
                                        <Button size="sm" variant="ghost" title="Ver">Ver</Button>
                                    </Link>
                                    <Link href={`/boxes/${box.id}/edit`}>
                                        <Button size="sm" variant="ghost" title="Editar">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => deleteBox(box)}>
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

function GalleryView({ boxes }: { boxes: Box[] }) {
    if (boxes.length === 0) {
        return <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No hay cajas con el filtro actual.</div>;
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boxes.map(box => (
                <Card key={box.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 shrink-0 text-primary" />
                            <CardTitle className="truncate text-base">{box.name}</CardTitle>
                        </div>
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
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" title="Eliminar" onClick={() => deleteBox(box)}>
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

export default function BoxesIndex({ boxes }: { boxes: Box[] }) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const [view, setView] = useState<SimpleViewType>('gallery');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const categories = [...new Set(boxes.map(b => b.category).filter((c): c is string => c !== null && c !== ''))];
    const filtered = boxes.filter(b => categoryFilter === 'all' || b.category === categoryFilter);

    const viewButtons: Array<{ value: SimpleViewType; icon: React.ReactNode; title: string }> = [
        { value: 'table',   icon: <Table2 className="h-4 w-4" />,    title: 'Vista tabla' },
        { value: 'gallery', icon: <LayoutGrid className="h-4 w-4" />, title: 'Vista galería' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cajas" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Mis cajas</h1>
                        <p className="text-sm text-muted-foreground">{boxes.length} caja{boxes.length !== 1 ? 's' : ''} de conocimiento</p>
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
                        <Link href="/boxes/create"><Button>Nueva caja</Button></Link>
                    </div>
                </div>

                {/* Filtros por categoría */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        <Button size="sm" variant={categoryFilter === 'all' ? 'default' : 'outline'}
                            className="h-7 px-3 text-xs" onClick={() => setCategoryFilter('all')}>
                            Todas
                        </Button>
                        {categories.map(cat => (
                            <Button key={cat} size="sm" variant={categoryFilter === cat ? 'default' : 'outline'}
                                className="h-7 px-3 text-xs" onClick={() => setCategoryFilter(cat)}>
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
                            <Link href="/boxes/create"><Button>Crear primera caja</Button></Link>
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

                {/* Vistas */}
                {filtered.length > 0 && view === 'table'   && <TableView   boxes={filtered} />}
                {filtered.length > 0 && view === 'gallery' && <GalleryView boxes={filtered} />}
            </div>
        </AppLayout>
    );
}
