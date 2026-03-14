import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SubscriptionProps } from '@/types';
import { Crown, Check, Sparkles, Zap, Star, Calendar, Shield, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Suscripción', href: '/subscription' },
];

const planIcons: Record<string, typeof Crown> = {
    free: Zap,
    premium_monthly: Crown,
    premium_yearly: Star,
};

const planColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    free: {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        border: 'border-border',
        gradient: 'from-muted-foreground to-muted-foreground/80',
    },
    premium_monthly: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20',
        gradient: 'from-primary to-primary/80',
    },
    premium_yearly: {
        bg: 'bg-warning/10',
        text: 'text-warning dark:text-warning',
        border: 'border-warning/20',
        gradient: 'from-warning to-warning/80',
    },
};

const planLabels: Record<string, string> = {
    free: 'Gratuito', premium_monthly: 'Solo Mensual', premium_yearly: 'Solo Anual',
};

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
    active: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-500/10 border-green-500/20' },
    expired: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10 border-red-500/20' },
    cancelled: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10 border-amber-500/20' },
};

const statusLabels: Record<string, string> = {
    active: 'Activa', expired: 'Expirada', cancelled: 'Cancelada',
};

export default function SubscriptionIndex({ subscription, plans }: SubscriptionProps) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const isPremium = subscription && (subscription.plan === 'premium_monthly' || subscription.plan === 'premium_yearly') && subscription.status === 'active';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suscripción" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header con gradiente */}
                <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border-2 border-primary/20 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/25">
                                <Crown className="h-7 w-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Suscripción</h1>
                                <p className="text-sm text-muted-foreground">Gestiona tu plan y acceso a funcionalidades</p>
                            </div>
                        </div>
                        {isPremium && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                                <Sparkles className="h-4 w-4" />
                                <span className="font-semibold">Solo Activo</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border-2 border-green-500/20 px-4 py-3">
                        <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">{flash.success}</span>
                    </div>
                )}

                {/* Plan actual */}
                {subscription && (
                    <Card className="border-2 rounded-2xl overflow-hidden">
                        <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-muted/30">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl ${planColors[subscription.plan].bg} flex items-center justify-center`}>
                                    {(() => {
                                        const Icon = planIcons[subscription.plan];
                                        return <Icon className={`h-5 w-5 ${planColors[subscription.plan].text}`} />;
                                    })()}
                                </div>
                                <CardTitle className="text-lg">Tu plan actual</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-muted/30 border">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Plan</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-semibold ${planColors[subscription.plan].bg} ${planColors[subscription.plan].text} border ${planColors[subscription.plan].border}`}>
                                            {(() => {
                                                const Icon = planIcons[subscription.plan];
                                                return <Icon className="h-3.5 w-3.5" />;
                                            })()}
                                            {planLabels[subscription.plan]}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-muted/30 border">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Estado</span>
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const config = statusConfig[subscription.status];
                                            const Icon = config.icon;
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-semibold border ${config.bg}`}>
                                                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                                                    <span className={config.color}>{statusLabels[subscription.status]}</span>
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>
                                {subscription.expires_at && (
                                    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-muted/30 border">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Válido hasta</span>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-semibold">
                                                {new Date(subscription.expires_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!isPremium && (
                                <div className="mt-6 pt-4 border-t-2 border-dashed">
                                    <Link href="/checkout">
                                        <Button className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                                            <Sparkles className="h-5 w-5 mr-2" />
                                            Actualizar a Solo
                                            <ArrowRight className="h-5 w-5 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Planes disponibles */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">Planes disponibles</h2>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        {plans.map((plan) => {
                            const isCurrentPlan = isPremium && subscription?.plan === plan.key;
                            const isBestValue = plan.key === 'premium_yearly';
                            const PlanIcon = planIcons[plan.key] || Zap;
                            const colors = planColors[plan.key];
                            
                            return (
                                <Card 
                                    key={plan.key} 
                                    className={`relative border-2 rounded-2xl transition-all hover:shadow-lg ${
                                        isCurrentPlan 
                                            ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
                                            : isBestValue 
                                                ? 'ring-2 ring-warning shadow-lg shadow-warning/20'
                                                : 'hover:-translate-y-1'
                                    }`}
                                >
                                    {isBestValue && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-warning to-warning/80 text-warning-foreground text-xs font-bold shadow-lg">
                                            Mejor valor
                                        </div>
                                    )}
                                    {isCurrentPlan && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold shadow-lg">
                                            Plan actual
                                        </div>
                                    )}
                                    <CardHeader className="pb-2 pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg`}>
                                                <PlanIcon className="h-6 w-6" />
                                            </div>
                                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">
                                                {plan.price === 0 ? 'Gratis' : `${plan.price.toFixed(2)}€`}
                                            </span>
                                            {plan.price > 0 && (
                                                <span className="text-sm text-muted-foreground">
                                                    /{plan.key === 'premium_yearly' ? 'año' : 'mes'}
                                                </span>
                                            )}
                                        </div>
                                        {plan.key === 'premium_yearly' && (
                                            <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                                ¡Ahorra 2 meses!
                                            </div>
                                        )}
                                        <ul className="flex flex-col gap-2.5 pt-2">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-sm">
                                                    <div className="mt-0.5 h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                        <Check className="h-3 w-3 text-green-600" />
                                                    </div>
                                                    <span className="text-muted-foreground">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {!isPremium && plan.key !== 'free' && (
                                            <Link href="/checkout" className="mt-2">
                                                <Button 
                                                    className={`w-full h-11 font-semibold rounded-xl transition-all ${
                                                        isBestValue 
                                                        ? 'bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 shadow-lg shadow-warning/25'
                                                        : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25'
                                                    }`}
                                                >
                                                    Seleccionar
                                                    <ArrowRight className="h-4 w-4 ml-2" />
                                                </Button>
                                            </Link>
                                        )}
                                        {plan.key === 'free' && !isPremium && subscription?.plan === 'free' && (
                                            <div className="mt-2 py-2 text-center text-sm text-muted-foreground font-medium">
                                                Plan actual
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
