import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle2,
    Lightbulb,
    FolderKanban,
    LayoutDashboard,
    BookMarked,
    Mic,
    Bot,
    Shield,
    Star,
} from 'lucide-react';
import logo from '@/assets/logo.png';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props as { auth: { user: unknown } };

    return (
        <>
            <Head title="Flowly — Tu productividad, organizada" />

            <div className="min-h-screen bg-background text-foreground">

                {/* ── Navbar ── */}
                <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="Flowly" className="h-8 w-auto object-contain" />
                            <span className="text-xl font-bold tracking-tight">Flowly</span>
                        </div>

                        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
                            <a href="#features" className="transition-colors hover:text-foreground">
                                Funcionalidades
                            </a>
                            <a href="#pricing" className="transition-colors hover:text-foreground">
                                Precios
                            </a>
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={dashboard()}>Ir al dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={login()}>Iniciar sesión</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild>
                                            <Link href={register()}>Registrarse</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Hero ── */}
                <section className="mx-auto max-w-6xl px-6 py-24 text-center">
                    <Badge variant="secondary" className="mb-4">
                        Productividad personal freemium
                    </Badge>
                    <h1 className="mb-6 text-5xl font-bold tracking-tight leading-tight lg:text-6xl">
                        Tu productividad,
                        <br />
                        <span className="text-primary">finalmente organizada</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                        Flowly te ayuda a gestionar tareas, capturar ideas y organizar proyectos
                        desde un solo lugar. Empieza gratis y escala cuando lo necesites.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {canRegister && (
                            <Button size="lg" asChild>
                                <Link href={register()}>Empezar gratis</Link>
                            </Button>
                        )}
                        <Button size="lg" variant="outline" asChild>
                            <Link href={login()}>Ya tengo cuenta</Link>
                        </Button>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Sin tarjeta de crédito · Plan gratuito para siempre
                    </p>
                </section>

                <Separator />

                {/* ── Features ── */}
                <section id="features" className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-bold tracking-tight">
                            Todo lo que necesitas en un solo lugar
                        </h2>
                        <p className="text-muted-foreground">
                            Desde gestionar tareas del día a día hasta organizar proyectos complejos.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
                            title="Gestión de tareas"
                            description="Crea, prioriza y organiza tus tareas con niveles de prioridad (alta, media, baja), fechas de vencimiento y seguimiento de completado."
                            badge="Gratis"
                        />
                        <FeatureCard
                            icon={<Lightbulb className="h-6 w-6 text-primary" />}
                            title="Captura de ideas"
                            description="Nunca pierdas una buena idea. Guárdalas al instante, márcalas como resueltas y vuelve a ellas cuando las necesites."
                            badge="Gratis"
                        />
                        <FeatureCard
                            icon={<FolderKanban className="h-6 w-6 text-primary" />}
                            title="Proyectos"
                            description="Agrupa tareas en proyectos con seguimiento de progreso, estado personalizable y una vista clara de todo lo que está en marcha."
                            badge="Premium"
                            badgeVariant="default"
                        />
                        <FeatureCard
                            icon={<BookMarked className="h-6 w-6 text-primary" />}
                            title="Cajas de recursos"
                            description="Organiza enlaces, documentos, vídeos e imágenes en cajas temáticas para tener siempre a mano lo que necesitas."
                            badge="Premium"
                            badgeVariant="default"
                        />
                        <FeatureCard
                            icon={<Mic className="h-6 w-6 text-primary" />}
                            title="Notas de voz"
                            description="Graba ideas o tareas con tu voz en segundos. Tus grabaciones se transcriben y almacenan automáticamente."
                            badge="Premium"
                            badgeVariant="default"
                        />
                        <FeatureCard
                            icon={<Bot className="h-6 w-6 text-primary" />}
                            title="Asistente IA"
                            description="Chatea con un asistente de inteligencia artificial para obtener sugerencias, organizar tus ideas o priorizar tu jornada."
                            badge="Premium"
                            badgeVariant="default"
                        />
                    </div>
                </section>

                <Separator />

                {/* ── Pricing ── */}
                <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-bold tracking-tight">
                            Planes para todos
                        </h2>
                        <p className="text-muted-foreground">
                            Empieza sin coste alguno. Actualiza cuando tu productividad lo exija.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Free */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LayoutDashboard className="h-5 w-5" />
                                    Gratis
                                </CardTitle>
                                <CardDescription>Para empezar sin compromisos</CardDescription>
                                <div className="pt-2">
                                    <span className="text-4xl font-bold">0 €</span>
                                    <span className="text-muted-foreground"> / mes</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-between gap-6">
                                <ul className="space-y-2 text-sm">
                                    <PricingFeature text="Hasta 5 tareas activas" />
                                    <PricingFeature text="Ideas ilimitadas" />
                                    <PricingFeature text="Dashboard personal" />
                                    <PricingFeature text="Autenticación con 2FA" />
                                </ul>
                                {canRegister && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={register()}>Empezar gratis</Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Premium Mensual */}
                        <Card className="flex flex-col border-primary shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-primary" />
                                        Premium Mensual
                                    </CardTitle>
                                    <Badge>Popular</Badge>
                                </div>
                                <CardDescription>Acceso completo, sin ataduras</CardDescription>
                                <div className="pt-2">
                                    <span className="text-4xl font-bold">9,99 €</span>
                                    <span className="text-muted-foreground"> / mes</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-between gap-6">
                                <ul className="space-y-2 text-sm">
                                    <PricingFeature text="Tareas ilimitadas" />
                                    <PricingFeature text="Ideas ilimitadas" />
                                    <PricingFeature text="Proyectos y seguimiento" />
                                    <PricingFeature text="Cajas de recursos" />
                                    <PricingFeature text="Grabaciones de voz" />
                                    <PricingFeature text="Asistente IA" />
                                </ul>
                                {canRegister && (
                                    <Button className="w-full" asChild>
                                        <Link href={register()}>Empezar ahora</Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Premium Anual */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Premium Anual
                                    </CardTitle>
                                    <Badge variant="secondary">Ahorra 2 meses</Badge>
                                </div>
                                <CardDescription>La opción más económica a largo plazo</CardDescription>
                                <div className="pt-2">
                                    <span className="text-4xl font-bold">99,99 €</span>
                                    <span className="text-muted-foreground"> / año</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-between gap-6">
                                <ul className="space-y-2 text-sm">
                                    <PricingFeature text="Todo lo de Premium Mensual" />
                                    <PricingFeature text="Facturado anualmente" />
                                    <PricingFeature text="Equivale a 8,33 € / mes" />
                                    <PricingFeature text="Ahorro de 19,89 € al año" />
                                </ul>
                                {canRegister && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={register()}>Empezar ahora</Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <Separator />

                {/* ── Footer ── */}
                <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-muted-foreground">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <img src={logo} alt="Flowly" className="h-6 w-auto object-contain" />
                        <span className="font-semibold text-foreground">Flowly</span>
                    </div>
                    <p>© {new Date().getFullYear()} Flowly · Proyecto Intermodular 2º DAM</p>
                </footer>
            </div>
        </>
    );
}

/* ── Subcomponentes locales ── */

function FeatureCard({
    icon,
    title,
    description,
    badge,
    badgeVariant = 'secondary',
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
    badgeVariant?: 'default' | 'secondary' | 'outline';
}) {
    return (
        <Card className="flex flex-col gap-3 p-6">
            <div className="flex items-start justify-between">
                <div className="rounded-lg bg-primary/10 p-2">{icon}</div>
                <Badge variant={badgeVariant}>{badge}</Badge>
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </Card>
    );
}

function PricingFeature({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            <span>{text}</span>
        </li>
    );
}
