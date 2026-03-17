import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LinkIcon, FileText, Image, Video, File, HelpCircle, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project } from '@/types';

interface Props {
    project: Project;
}

const resourceTypeIcons = {
    link: LinkIcon,
    document: FileText,
    video: Video,
    image: Image,
    other: File,
};

const resourceTypeLabels = {
    link: 'Enlace',
    document: 'Documento',
    video: 'Video',
    image: 'Imagen',
    other: 'Otro',
};

export default function ResourceCreate({ project }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Clientes', href: '/clients' },
        { title: project.name, href: `/clients/${project.id}` },
        { title: 'Nuevo recurso', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        url: '',
        type: 'link' as 'link' | 'document' | 'video' | 'image' | 'other',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(`/clients/${project.id}/resources`);
    }

    const TypeIcon = resourceTypeIcons[data.type];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo recurso" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10">
                            <LinkIcon className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Nuevo recurso</h1>
                            <p className="text-sm text-muted-foreground">
                                Añadir a: <span className="font-medium text-foreground">{project.name}</span>
                            </p>
                        </div>
                    </div>
                    <Link href={`/clients/${project.id}`}>
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
                            <Sparkles className="h-4 w-4 text-teal-600" />
                            <CardTitle className="text-base font-semibold">Datos del recurso</CardTitle>
                        </div>
                        <CardDescription>
                            Añade un enlace, documento, video o cualquier recurso útil
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Tipo */}
                            <div className="space-y-2">
                                <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium">
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    Tipo de recurso <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value as typeof data.type)}
                                >
                                    <SelectTrigger id="type" className="w-full sm:w-[240px]">
                                        <SelectValue placeholder="Selecciona tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="link">
                                            <div className="flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4 text-blue-500" />
                                                Enlace
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="document">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-orange-500" />
                                                Documento
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="video">
                                            <div className="flex items-center gap-2">
                                                <Video className="h-4 w-4 text-red-500" />
                                                Video
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="image">
                                            <div className="flex items-center gap-2">
                                                <Image className="h-4 w-4 text-green-500" />
                                                Imagen
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="other">
                                            <div className="flex items-center gap-2">
                                                <File className="h-4 w-4 text-gray-500" />
                                                Otro
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.type}
                                    </p>
                                )}
                            </div>

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
                                    placeholder="Nombre descriptivo del recurso"
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* URL */}
                            <div className="space-y-2">
                                <Label htmlFor="url" className="flex items-center gap-2 text-sm font-medium">
                                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    URL
                                </Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={data.url}
                                    onChange={e => setData('url', e.target.value)}
                                    placeholder="https://ejemplo.com/recurso"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enlace al recurso externo o ubicación del archivo
                                </p>
                                {errors.url && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.url}
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
                                    placeholder="Describe de qué trata este recurso..."
                                    className="resize-none"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Preview */}
                            <div className="rounded-lg border bg-muted/20 p-4">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Vista previa</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <TypeIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">
                                            {data.name || 'Nombre del recurso'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {resourceTypeLabels[data.type]}
                                            {data.url && ' • ' + (data.url.length > 30 ? data.url.substring(0, 30) + '...' : data.url)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex items-center gap-3 border-t pt-6">
                                <Button type="submit" disabled={processing} className="min-w-[140px]">
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Añadiendo...
                                        </span>
                                    ) : (
                                        'Añadir recurso'
                                    )}
                                </Button>
                                <Link href={`/clients/${project.id}`}>
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
