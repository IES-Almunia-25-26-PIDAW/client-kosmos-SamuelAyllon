import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
        { title: 'Pacientes', href: '/clients' },
        { title: project.name, href: `/clients/${project.id}` },
        { title: 'Editar', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: project.name,
        description: project.description ?? '',
        status: project.status,
        color: project.color ?? '#3B82F6',
        brand_tone: project.brand_tone ?? '',
        service_scope: project.service_scope ?? '',
        client_notes: project.client_notes ?? '',
        next_deadline: project.next_deadline ? project.next_deadline.slice(0, 10) : '',
        key_links: (project.key_links ?? []) as { label: string; url: string }[],
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/clients/${project.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar — ${project.name}`} />

            <div className="flex flex-col gap-6 p-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editar paciente</h1>
                    <Link href={`/clients/${project.id}`}>
                        <Button variant="outline">← Volver</Button>
                    </Link>
                </div>

                <Card className="max-w-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Datos del paciente</CardTitle>
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
                                    placeholder="Nombre del paciente"
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
                                    <option value="inactive">Inactivo</option>
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

                            {/* Motivo de consulta */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="service_scope">Motivo de consulta</Label>
                                <Textarea
                                    id="service_scope"
                                    value={data.service_scope}
                                    onChange={e => setData('service_scope', e.target.value)}
                                    rows={2}
                                    placeholder="Describe la razón principal de consulta..."
                                    className="resize-none"
                                />
                                {errors.service_scope && <p className="text-xs text-red-600">{errors.service_scope}</p>}
                            </div>

                            {/* Enfoque terapéutico */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="brand_tone">Enfoque terapéutico</Label>
                                <Input
                                    id="brand_tone"
                                    value={data.brand_tone}
                                    onChange={e => setData('brand_tone', e.target.value)}
                                    placeholder="Orientación terapéutica o metodología de trabajo..."
                                />
                                {errors.brand_tone && <p className="text-xs text-red-600">{errors.brand_tone}</p>}
                            </div>

                            {/* Acuerdos terapéuticos */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="client_notes">Acuerdos terapéuticos</Label>
                                <Textarea
                                    id="client_notes"
                                    value={data.client_notes}
                                    onChange={e => setData('client_notes', e.target.value)}
                                    rows={3}
                                    placeholder="Acuerdos, disponibilidad, limitaciones y pautas clave..."
                                    className="resize-none"
                                />
                                {errors.client_notes && <p className="text-xs text-red-600">{errors.client_notes}</p>}
                            </div>

                            {/* Próxima fecha */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="next_deadline">Próxima fecha</Label>
                                <Input
                                    id="next_deadline"
                                    type="date"
                                    value={data.next_deadline}
                                    onChange={e => setData('next_deadline', e.target.value)}
                                />
                                {errors.next_deadline && <p className="text-xs text-red-600">{errors.next_deadline}</p>}
                            </div>

                            {/* Enlaces clave */}
                            <div className="flex flex-col gap-1.5">
                                <Label>Enlaces clave</Label>
                                {data.key_links.map((link, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={link.label}
                                            onChange={e => {
                                                const updated = [...data.key_links];
                                                updated[index] = { ...updated[index], label: e.target.value };
                                                setData('key_links', updated);
                                            }}
                                            placeholder="Nombre del enlace"
                                            className="flex-1"
                                        />
                                        <Input
                                            value={link.url}
                                            onChange={e => {
                                                const updated = [...data.key_links];
                                                updated[index] = { ...updated[index], url: e.target.value };
                                                setData('key_links', updated);
                                            }}
                                            placeholder="https://..."
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const updated = data.key_links.filter((_, i) => i !== index);
                                                setData('key_links', updated);
                                            }}
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setData('key_links', [...data.key_links, { label: '', url: '' }])}
                                    className="gap-1.5 w-fit"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Añadir enlace
                                </Button>
                                {errors.key_links && <p className="text-xs text-red-600">{errors.key_links}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                                <Link href={`/clients/${project.id}`}>
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
