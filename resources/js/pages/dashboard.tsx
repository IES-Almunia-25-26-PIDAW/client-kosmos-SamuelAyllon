import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    CheckCircle2, 
    ArrowRight, 
    Sparkles,
    Target,
    Zap,
    Crown,
    AlertTriangle,
    CalendarClock,
    FolderKanban,
    Loader2,
    X,
    Copy,
    Check,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
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
    free: 'Gratuito', premium_monthly: 'Solo', premium_yearly: 'Solo Anual',
};

export default function Dashboard({ todayTasks, activeProjects, atRiskProjects, subscription }: DashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const isPremium = subscription?.plan === 'premium_monthly'
                   || subscription?.plan === 'premium_yearly';

    const [planLoading, setPlanLoading] = useState(false);
    const [planResult, setPlanResult] = useState<string | null>(null);
    const [planCopied, setPlanCopied] = useState(false);

    const handlePlanDay = () => {
        setPlanLoading(true);
        setPlanResult(null);
        fetch('/ai/plan-day', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': decodeURIComponent(
                    document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''
                ),
            },
        })
            .then(res => res.json())
            .then(data => setPlanResult(data.output ?? 'Sin respuesta.'))
            .catch(() => setPlanResult('Error al conectar con la IA. Inténtalo más tarde.'))
            .finally(() => setPlanLoading(false));
    };

    const copyPlan = () => {
        if (planResult) {
            navigator.clipboard.writeText(planResult);
            setPlanCopied(true);
            setTimeout(() => setPlanCopied(false), 2000);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hoy" />

            <div className="flex flex-col gap-8 p-6">

                {/* Cabecera */}
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
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            {isPremium && (
                                <Button
                                    variant="outline"
                                    className="gap-2 border-2"
                                    disabled={planLoading}
                                    onClick={handlePlanDay}
                                >
                                    {planLoading
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : <Sparkles className="h-4 w-4" />
                                    }
                                    Planifica mi día
                                </Button>
                            )}
                            <Badge className={`gap-1.5 px-3 py-1.5 text-sm ${isPremium
                                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg shadow-primary/25'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                                {isPremium && <Crown className="h-3.5 w-3.5" />}
                                {planLabels[subscription?.plan ?? 'free']}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Resultado de Planifica mi día */}
                {planResult && (
                    <Card className="overflow-hidden border-l-4 border-l-primary bg-ai-surface glass">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-base">Tu plan para hoy</CardTitle>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={copyPlan} className="h-8 w-8 p-0">
                                    {planCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setPlanResult(null)} className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-line text-sm">
                                {planResult}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tareas críticas del día, agrupadas por cliente */}
                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-base">Tareas prioritarias</CardTitle>
                        </div>
                        <Link href="/tasks" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group/link">
                            Ver todas 
                            <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                        </Link>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 pt-4">
                        {todayTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                                    <Sparkles className="h-6 w-6 text-green-600" />
                                </div>
                                <p className="text-sm font-medium">Día limpio</p>
                                <p className="text-xs text-muted-foreground">Buen momento para revisar notas o descansar.</p>
                            </div>
                        ) : (
                            (() => {
                                // Agrupar tareas por cliente
                                const grouped = new Map<string, typeof todayTasks>();
                                todayTasks.forEach(task => {
                                    const key = task.project ? `${task.project.id}` : '__none__';
                                    if (!grouped.has(key)) grouped.set(key, []);
                                    grouped.get(key)!.push(task);
                                });
                                return Array.from(grouped.entries()).map(([key, tasks]) => {
                                    const project = tasks[0].project;
                                    return (
                                        <div key={key} className="mb-2 last:mb-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                {project ? (
                                                    <>
                                                        <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: project.color || '#3B82F6' }} />
                                                        <Link href={`/clients/${project.id}`} className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                                                            {project.name}
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <span className="text-xs font-semibold text-muted-foreground">Sin cliente</span>
                                                )}
                                            </div>
                                            {tasks.map(task => {
                                                const isOverdue = task.due_date && new Date(task.due_date) < new Date(new Date().toDateString());
                                                return (
                                                    <div key={task.id} className="flex items-center justify-between rounded-xl border-2 border-transparent bg-muted/30 p-3 transition-all hover:border-primary/20 hover:bg-muted/50 mb-1.5">
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${priorityColors[task.priority]}`}>
                                                                {priorityLabels[task.priority]}
                                                            </span>
                                                            <span className="truncate text-sm font-medium">{task.name}</span>
                                                            {isOverdue && (
                                                                <Badge variant="destructive" className="text-xs shrink-0">Atrasada</Badge>
                                                            )}
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
                                                );
                                            })}
                                        </div>
                                    );
                                });
                            })()
                        )}
                    </CardContent>
                </Card>

                {/* Clientes en riesgo */}
                {atRiskProjects.length > 0 && (
                    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg border-orange-500/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-orange-500/5 to-transparent">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                </div>
                                <CardTitle className="text-base">Clientes en riesgo</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 pt-4">
                            {atRiskProjects.map(project => (
                                <Link key={project.id} href={`/clients/${project.id}`} className="block">
                                    <div className="flex items-center justify-between rounded-xl border-2 border-transparent bg-muted/30 p-3 transition-all hover:border-orange-500/20 hover:bg-muted/50">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: project.color || '#3B82F6' }} />
                                            <span className="text-sm font-medium truncate">{project.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {project.overdue_tasks_count > 0 && (
                                                <Badge variant="destructive" className="text-xs">
                                                    {project.overdue_tasks_count} atrasada{project.overdue_tasks_count !== 1 ? 's' : ''}
                                                </Badge>
                                            )}
                                            {project.next_deadline && new Date(project.next_deadline) <= new Date(Date.now() + 7 * 86400000) && (
                                                <Badge className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/20">
                                                    <CalendarClock className="h-3 w-3 mr-1" />
                                                    {new Date(project.next_deadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                </Badge>
                                            )}
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Mis clientes activos */}
                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FolderKanban className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-base">Mis clientes</CardTitle>
                        </div>
                        <Link href="/clients" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group/link">
                            Ver todos
                            <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                        </Link>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 pt-4">
                        {activeProjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                    <FolderKanban className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-sm font-medium">Aquí vivirán tus clientes</p>
                                <p className="text-xs text-muted-foreground">Añade el primero y Flowly recordará todo por ti.</p>
                                <Link href="/clients/create" className="mt-3">
                                    <Button size="sm" className="gap-2">Nuevo cliente</Button>
                                </Link>
                            </div>
                        ) : (
                            activeProjects.map(project => (
                                <Link key={project.id} href={`/clients/${project.id}`} className="block">
                                    <div className="flex items-center justify-between rounded-xl border-2 border-transparent bg-muted/30 p-3 transition-all hover:border-primary/20 hover:bg-muted/50">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: project.color || '#3B82F6' }} />
                                            <span className="text-sm font-medium truncate">{project.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {project.pending_tasks_count > 0 && (
                                                <span className="text-xs text-muted-foreground">{project.pending_tasks_count} pendiente{project.pending_tasks_count !== 1 ? 's' : ''}</span>
                                            )}
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </CardContent>
                </Card>

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
                                    <p className="text-sm text-muted-foreground">Clientes ilimitados, IA contextual y recursos con Solo</p>
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
