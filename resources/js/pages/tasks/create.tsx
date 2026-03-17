import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, CheckSquare, FileText, Calendar, Flag, FolderKanban, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tareas', href: '/tasks' },
    { title: 'Nueva tarea', href: '#' },
];

interface Props {
    projects: { id: number; name: string }[];
    defaultProjectId?: string | null;
}

export default function TaskCreate({ projects, defaultProjectId }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
        due_date: '',
        project_id: defaultProjectId ?? '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/tasks');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva tarea" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <CheckSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Nueva tarea</h1>
                            <p className="text-sm text-muted-foreground">Crea una nueva tarea para organizar tu trabajo</p>
                        </div>
                    </div>
                    <Link href="/tasks">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Button>
                    </Link>
                </div>

                {/* Form Card */}
                <Card className="max-w-2xl shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <CardTitle className="text-base font-semibold">Datos de la tarea</CardTitle>
                        </div>
                        <CardDescription>
                            Completa la información para crear tu nueva tarea
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Nombre <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="¿Qué necesitas hacer?"
                                        className="flex-1"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Descripción
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={4}
                                    placeholder="Añade detalles adicionales sobre la tarea..."
                                    className="resize-none"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Grid: Prioridad y Fecha */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Prioridad */}
                                <div className="space-y-2">
                                    <Label htmlFor="priority" className="flex items-center gap-2 text-sm font-medium">
                                        <Flag className="h-4 w-4 text-muted-foreground" />
                                        Prioridad <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(value) => setData('priority', value as 'low' | 'medium' | 'high')}
                                    >
                                        <SelectTrigger id="priority" className="w-full">
                                            <SelectValue placeholder="Selecciona prioridad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                                    Baja
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                                                    Media
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="high">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-red-500" />
                                                    Alta
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.priority && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                            {errors.priority}
                                        </p>
                                    )}
                                </div>

                                {/* Fecha de vencimiento */}
                                <div className="space-y-2">
                                    <Label htmlFor="due_date" className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Fecha de vencimiento <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        required
                                        value={data.due_date}
                                        onChange={e => setData('due_date', e.target.value)}
                                        className="w-full"
                                    />
                                    {errors.due_date && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                            {errors.due_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Proyecto (solo si hay proyectos) */}
                            {projects.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="project_id" className="flex items-center gap-2 text-sm font-medium">
                                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                                        Proyecto
                                    </Label>
                                    <Select
                                        value={data.project_id}
                                        onValueChange={(value) => setData('project_id', value)}
                                    >
                                        <SelectTrigger id="project_id" className="w-full">
                                            <SelectValue placeholder="Sin proyecto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Sin proyecto</SelectItem>
                                            {projects.map(p => (
                                                <SelectItem key={p.id} value={String(p.id)}>
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.project_id && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                            {errors.project_id}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex items-center gap-3 border-t pt-6">
                                <Button type="submit" disabled={processing} className="min-w-[120px]">
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Creando...
                                        </span>
                                    ) : (
                                        'Crear tarea'
                                    )}
                                </Button>
                                <Link href="/tasks">
                                    <Button type="button" variant="ghost">
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
