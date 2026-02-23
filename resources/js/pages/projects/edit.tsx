import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project } from '@/types';

interface Props {
    project: Project;
}

const colorOptions = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444',
    '#F59E0B', '#10B981', '#14B8A6', '#6B7280',
];

export default function ProjectEdit({ project }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Proyectos', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Editar', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: project.name,
        description: project.description ?? '',
        status: project.status,
        color: project.color ?? '#3B82F6',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/projects/${project.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar — ${project.name}`} />

            <div className="flex flex-col gap-6 p-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editar proyecto</h1>
                    <Link href={`/projects/${project.id}`}>
                        <Button variant="outline">← Volver</Button>
                    </Link>
                </div>

                <Card className="max-w-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Datos del proyecto</CardTitle>
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
                                    placeholder="Nombre del proyecto"
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

                            {/* Estado */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="status">Estado *</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value as Project['status'])}
                                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                >
                                    <option value="created">Creado</option>
                                    <option value="active">Activo</option>
                                    <option value="completed">Completado</option>
                                </select>
                                {errors.status && <p className="text-xs text-red-600">{errors.status}</p>}
                            </div>

                            {/* Color */}
                            <div className="flex flex-col gap-1.5">
                                <Label>Color</Label>
                                <div className="flex flex-wrap gap-2">
                                    {colorOptions.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setData('color', color)}
                                            className={`h-8 w-8 rounded-full transition-all ${data.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <Input
                                        type="color"
                                        value={data.color}
                                        onChange={e => setData('color', e.target.value)}
                                        className="h-8 w-8 cursor-pointer rounded-full p-0.5"
                                        title="Color personalizado"
                                    />
                                </div>
                                {errors.color && <p className="text-xs text-red-600">{errors.color}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                                <Link href={`/projects/${project.id}`}>
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
