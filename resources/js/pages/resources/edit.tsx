import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Resource } from '@/types';

interface Props {
    resource: Resource;
}

export default function ResourceEdit({ resource }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cajas', href: '/boxes' },
        ...(resource.box ? [{ title: resource.box.name, href: `/boxes/${resource.box_id}` }] : []),
        { title: 'Editar recurso', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: resource.name,
        description: resource.description ?? '',
        url: resource.url ?? '',
        type: resource.type,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/resources/${resource.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar recurso" />

            <div className="flex flex-col gap-6 p-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Editar recurso</h1>
                        {resource.box && (
                            <p className="text-sm text-muted-foreground">En la caja: <span className="font-medium">{resource.box.name}</span></p>
                        )}
                    </div>
                    <Link href={`/boxes/${resource.box_id}`}>
                        <Button variant="outline">← Volver</Button>
                    </Link>
                </div>

                <Card className="max-w-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Datos del recurso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            {/* Tipo */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="type">Tipo *</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value as typeof data.type)}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                >
                                    <option value="link">Enlace</option>
                                    <option value="document">Documento</option>
                                    <option value="video">Video</option>
                                    <option value="image">Imagen</option>
                                    <option value="other">Otro</option>
                                </select>
                                {errors.type && <p className="text-xs text-red-600">{errors.type}</p>}
                            </div>

                            {/* Nombre */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Nombre del recurso"
                                />
                                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                            </div>

                            {/* URL */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={data.url}
                                    onChange={e => setData('url', e.target.value)}
                                    placeholder="https://..."
                                />
                                {errors.url && <p className="text-xs text-red-600">{errors.url}</p>}
                            </div>

                            {/* Descripción */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="description">Descripción</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Descripción opcional..."
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                                <Link href={`/boxes/${resource.box_id}`}>
                                    <Button type="button" variant="outline">Cancelar</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
