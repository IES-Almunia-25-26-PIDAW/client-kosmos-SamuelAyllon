import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Lightbulb, FileText, Flag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ideas', href: '/ideas' },
    { title: 'Nueva idea', href: '#' },
];

export default function IdeaCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/ideas');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva idea" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                            <Lightbulb className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Nueva idea</h1>
                            <p className="text-sm text-muted-foreground">Captura tus ideas antes de que se escapen</p>
                        </div>
                    </div>
                    <Link href="/ideas">
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
                            <Sparkles className="h-4 w-4 text-yellow-600" />
                            <CardTitle className="text-base font-semibold">Datos de la idea</CardTitle>
                        </div>
                        <CardDescription>
                            Describe tu idea con todos los detalles que necesites
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
                                        placeholder="¿Qué idea tienes en mente?"
                                        className="flex-1"
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
                                    placeholder="Expande tu idea con más detalles..."
                                    className="resize-none"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

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
                                    <SelectTrigger id="priority" className="w-full sm:w-[240px]">
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

                            {/* Botones */}
                            <div className="flex items-center gap-3 border-t pt-6">
                                <Button type="submit" disabled={processing} className="min-w-[120px]">
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Creando...
                                        </span>
                                    ) : (
                                        'Crear idea'
                                    )}
                                </Button>
                                <Link href="/ideas">
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
