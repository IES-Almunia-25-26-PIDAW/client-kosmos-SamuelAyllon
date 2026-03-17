import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Task } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tareas', href: '/tasks' },
    { title: 'Editar tarea', href: '#' },
];

interface Props {
    task: Task;
    projects: { id: number; name: string }[];
}

export default function TaskEdit({ task, projects }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: task.name,
        description: task.description ?? '',
        priority: task.priority,
        due_date: task.due_date ? task.due_date.substring(0, 10) : '',
        project_id: task.project?.id?.toString() ?? '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/tasks/${task.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar tarea" />

            <div className="flex flex-col gap-6 p-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editar tarea</h1>
                    <Link href="/tasks">
                        <Button variant="outline">← Volver</Button>
                    </Link>
                </div>

                <Card className="max-w-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Datos de la tarea</CardTitle>
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
                                    placeholder="Nombre de la tarea"
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

                            {/* Fecha de vencimiento */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="due_date">Fecha de vencimiento</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                />
                                {errors.due_date && <p className="text-xs text-red-600">{errors.due_date}</p>}
                            </div>

                            {/* Proyecto (solo si hay proyectos) */}
                            {projects.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="project_id">Proyecto</Label>
                                    <select
                                        id="project_id"
                                        value={data.project_id}
                                        onChange={e => setData('project_id', e.target.value)}
                                        className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                    >
                                        <option value="">Sin proyecto</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {errors.project_id && <p className="text-xs text-red-600">{errors.project_id}</p>}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                                <Link href="/tasks">
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
