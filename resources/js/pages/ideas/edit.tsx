import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Idea } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ideas', href: '/ideas' },
    { title: 'Editar idea', href: '#' },
];

interface Props {
    idea: Idea;
}

export default function IdeaEdit({ idea }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: idea.name,
        description: idea.description ?? '',
        priority: idea.priority,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/ideas/${idea.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar idea" />

            <div className="flex flex-col gap-6 p-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editar idea</h1>
                    <Link href="/ideas">
                        <Button variant="outline">← Volver</Button>
                    </Link>
                </div>

                <Card className="max-w-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Datos de la idea</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            {/* Nombre */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Nombre de la idea"
                                />
                                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
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

                            {/* Prioridad */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="priority">Prioridad *</Label>
                                <select
                                    id="priority"
                                    value={data.priority}
                                    onChange={e => setData('priority', e.target.value as 'low' | 'medium' | 'high')}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                                {errors.priority && <p className="text-xs text-red-600">{errors.priority}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                                <Link href="/ideas">
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
