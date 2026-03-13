import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    CheckCircle2, 
    Lightbulb, 
    FolderKanban, 
    ArrowRight, 
    Sparkles,
    Target,
    TrendingUp,
    Zap,
    Crown,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import TutorialChatbot from '@/components/tutorial-chatbot';
import type { Auth, BreadcrumbItem } from '@/types';
import { DashboardProps } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

const priorityColors: Record<string, string> = {
    high:   'bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 dark:bg-yellow-900/30 dark:text-yellow-400',
    low:    'bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-900/30 dark:text-blue-400',
};

const priorityLabels: Record<string, string> = {
    high: 'Alta', medium: 'Media', low: 'Baja',
};

const planLabels: Record<string, string> = {
    free: 'Gratuito', premium_monthly: 'Premium', premium_yearly: 'Premium Anual',
};

export default function Dashboard({ pendingTasks, activeIdeas, activeProjects, subscription }: DashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const isPremium = subscription?.plan === 'premium_monthly'
                   || subscription?.plan === 'premium_yearly';

    // Tutorial: mostrar si el usuario no lo ha completado
    const [showTutorial, setShowTutorial] = useState(!auth.user.tutorial_completed_at);

    // Calcular estadísticas
    const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high').length;
    const completionRate = pendingTasks.length > 0 ? Math.round((pendingTasks.filter(t => t.status === 'completed').length / pendingTasks.length) * 100) : 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* Tutorial chatbot para nuevos usuarios */}
            <TutorialChatbot 
                show={showTutorial} 
                onComplete={() => setShowTutorial(false)}
                isPremium={isPremium}
                userName={auth.user.name}
            />

            <div className="flex flex-col gap-8 p-6">

                {/* Cabecera mejorada */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-6 lg:p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                                    <Target className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Hola, {auth.user.name}</h1>
                                    <p className="text-sm text-muted-foreground">Esto es lo que tienes hoy</p>
                                </div>
                            </div>
                        </div>
                        <Badge className={`self-start sm:self-auto gap-1.5 px-3 py-1.5 text-sm ${isPremium
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg shadow-purple-500/25'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                            {isPremium && <Crown className="h-3.5 w-3.5" />}
                            {planLabels[subscription?.plan ?? 'free']}
                        </Badge>
                    </div>
                </div>

                {/* Estadísticas mejoradas */}
                <div className={`grid gap-4 ${isPremium ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
                    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="relative pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                </div>
                                {highPriorityTasks > 0 && (
                                    <Badge variant="destructive" className="text-xs">{highPriorityTasks} urgentes</Badge>
                                )}
                            </div>
                            <p className="text-3xl font-bold">{pendingTasks.length}</p>
                            <p className="text-sm text-muted-foreground">Tareas pendientes</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="relative pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold">{activeIdeas.length}</p>
                            <p className="text-sm text-muted-foreground">Ideas activas</p>
                        </CardContent>
                    </Card>
                    
                    {isPremium && (
                        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="relative pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FolderKanban className="h-5 w-5 text-purple-600" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold">{activeProjects.length}</p>
                                <p className="text-sm text-muted-foreground">Proyectos activos</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="relative pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold">{completionRate}%</p>
                            <p className="text-sm text-muted-foreground">Productividad</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Secciones de contenido mejoradas */}
                <div className={`grid gap-6 ${isPremium ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>

                    {/* Tareas pendientes */}
                    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-blue-500/5 to-transparent">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                </div>
                                <CardTitle className="text-base">Tareas pendientes</CardTitle>
                            </div>
                            <Link href="/tasks" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group/link">
                                Ver todas 
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                            </Link>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 pt-4">
                            {pendingTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                                        <Sparkles className="h-6 w-6 text-green-600" />
                                    </div>
                                    <p className="text-sm font-medium">¡Todo listo!</p>
                                    <p className="text-xs text-muted-foreground">No tienes tareas pendientes</p>
                                </div>
                            ) : (
                                pendingTasks.slice(0, 5).map(task => (
                                    <div key={task.id} className="flex items-center justify-between rounded-xl border-2 border-transparent bg-muted/30 p-3 transition-all hover:border-primary/20 hover:bg-muted/50">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${priorityColors[task.priority]}`}>
                                                {priorityLabels[task.priority]}
                                            </span>
                                            <span className="truncate text-sm font-medium">{task.name}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => router.patch(`/tasks/${task.id}/complete`)}
                                            className="shrink-0 h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-500/10 rounded-lg"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Ideas activas */}
                    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-yellow-500/5 to-transparent">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                                </div>
                                <CardTitle className="text-base">Ideas activas</CardTitle>
                            </div>
                            <Link href="/ideas" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group/link">
                                Ver todas
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                            </Link>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 pt-4">
                            {activeIdeas.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-3">
                                        <Lightbulb className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <p className="text-sm font-medium">Sin ideas todavía</p>
                                    <p className="text-xs text-muted-foreground">Captura tu próxima gran idea</p>
                                </div>
                            ) : (
                                activeIdeas.slice(0, 5).map(idea => (
                                    <div key={idea.id} className="rounded-xl border-2 border-transparent bg-muted/30 p-3 transition-all hover:border-primary/20 hover:bg-muted/50">
                                        <p className="text-sm font-medium truncate">{idea.name}</p>
                                        {idea.description && (
                                            <p className="mt-1 truncate text-xs text-muted-foreground">{idea.description}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Proyectos activos — solo premium */}
                    {isPremium && (
                        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-purple-500/5 to-transparent">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <FolderKanban className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <CardTitle className="text-base">Proyectos activos</CardTitle>
                                </div>
                                <Link href="/projects" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group/link">
                                    Ver todos
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                                </Link>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 pt-4">
                                {activeProjects.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                                            <FolderKanban className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <p className="text-sm font-medium">Sin proyectos</p>
                                        <p className="text-xs text-muted-foreground">Crea tu primer proyecto</p>
                                    </div>
                                ) : (
                                    activeProjects.slice(0, 5).map(project => (
                                        <div key={project.id} className="flex items-center gap-3 rounded-xl border-2 border-transparent bg-muted/30 p-3 transition-all hover:border-primary/20 hover:bg-muted/50">
                                            <div
                                                className="h-4 w-4 shrink-0 rounded-full shadow-sm"
                                                style={{ backgroundColor: project.color }}
                                            />
                                            <span className="truncate text-sm font-medium">{project.name}</span>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* CTA para usuarios free */}
                {!isPremium && (
                    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                        <CardContent className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                                    <Zap className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Desbloquea todo el potencial</h3>
                                    <p className="text-sm text-muted-foreground">Proyectos, voz IA, y mucho más con Premium</p>
                                </div>
                            </div>
                            <Button asChild className="gap-2 shadow-lg shadow-primary/25">
                                <Link href="/subscription">
                                    <Crown className="h-4 w-4" />
                                    Ver planes
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
