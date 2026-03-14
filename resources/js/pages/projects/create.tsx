import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, FolderKanban, FileText, Palette, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Clientes', href: '/clients' },
    { title: 'Nuevo cliente', href: '#' },
];

const colorOptions = [
    { color: '#3B82F6', name: 'Azul' },
    { color: '#8B5CF6', name: 'Violeta' },
    { color: '#EC4899', name: 'Rosa' },
    { color: '#EF4444', name: 'Rojo' },
    { color: '#F59E0B', name: 'Naranja' },
    { color: '#10B981', name: 'Verde' },
    { color: '#14B8A6', name: 'Turquesa' },
    { color: '#6B7280', name: 'Gris' },
];

export default function ProjectCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        color: '#3B82F6',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/clients');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo cliente" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <FolderKanban className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Nuevo cliente</h1>
                            <p className="text-sm text-muted-foreground">Crea un perfil para tu cliente</p>
                        </div>
                    </div>
                    <Link href="/clients">
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
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <CardTitle className="text-base font-semibold">Datos del cliente</CardTitle>
                        </div>
                        <CardDescription>
                            Define los detalles de tu nuevo cliente
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
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Nombre del cliente"
                                    autoFocus
                                />
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
                                    placeholder="Describe el tipo de servicio que ofreces..."
                                    className="resize-none"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Color */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Palette className="h-4 w-4 text-muted-foreground" />
                                    Color del proyecto
                                </Label>
                                <div className="flex flex-wrap gap-3">
                                    {colorOptions.map(({ color, name }) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setData('color', color)}
                                            title={name}
                                            className={`
                                                group relative h-10 w-10 rounded-full transition-all duration-200
                                                ${data.color === color 
                                                    ? 'ring-2 ring-offset-2 ring-primary scale-110 shadow-lg' 
                                                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                                                }
                                            `}
                                            style={{ backgroundColor: color }}
                                        >
                                            {data.color === color && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <span className="h-3 w-3 rounded-full bg-white/90 shadow" />
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                    <div className="relative">
                                        <Input
                                            type="color"
                                            value={data.color}
                                            onChange={e => setData('color', e.target.value)}
                                            className="h-10 w-10 cursor-pointer rounded-full border-2 border-dashed border-muted-foreground/30 p-1 hover:border-muted-foreground/50"
                                            title="Color personalizado"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Elige un color para identificar fácilmente tu cliente
                                </p>
                                {errors.color && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.color}
                                    </p>
                                )}
                            </div>

                            {/* Preview */}
                            <div className="rounded-lg border bg-muted/20 p-4">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Vista previa</p>
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="h-8 w-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: data.color }}
                                    >
                                        <FolderKanban className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="font-medium">
                                        {data.name || 'Nombre del cliente'}
                                    </span>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex items-center gap-3 border-t pt-6">
                                <Button type="submit" disabled={processing} className="min-w-[120px]">
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Creando...
                                        </span>
                                    ) : (
                                    'Crear cliente'
                                )}
                                </Button>
                                <Link href="/clients">
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
