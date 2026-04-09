import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    LayoutDashboard,
    Shield,
    Star,
    ArrowRight,
    Sparkles,
    Zap,
    Users,
    Brain,
    Rocket,
    Quote,
    Play,
    Menu,
    X,
    Leaf,
    FileText,
    CreditCard,
    CalendarClock,
    Lock,
    NotebookPen,
    AlertCircle,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import logo from '@/assets/logo.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard, login, register } from '@/routes';


export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props as { auth: { user: unknown } };
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="ClientKosmos — Gestión de consulta para profesionales de servicios" />

            <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

                {/* ── Navbar ── */}
                <header className="sticky top-0 z-50 border-b bg-background/60 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <img 
                                src={logo} 
                                alt="ClientKosmos"
                                className="h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                            />
                            <span className="text-xl font-bold tracking-tight gradient-text-animated">
                                ClientKosmos
                            </span>
                        </div>

                        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
                            {[
                                { href: '#features', label: 'Funcionalidades' },
                                { href: '#how-it-works', label: 'Cómo funciona' },
                                { href: '#testimonials', label: 'Testimonios' },
                                { href: '#pricing', label: 'Precios' },
                            ].map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild className="group glow-primary">
                                    <Link href={dashboard()} className="flex items-center gap-2">
                                        Ir al dashboard
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                        <Link href={login()}>Iniciar sesión</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild className="group glow-primary relative overflow-hidden hidden sm:inline-flex">
                                            <Link href={register()} className="flex items-center gap-2">
                                                <span className="relative z-10">Empezar gratis</span>
                                                <Sparkles className="h-4 w-4 relative z-10 transition-transform group-hover:rotate-12 group-hover:scale-125" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                            {/* Mobile hamburger */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Abrir menú"
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl animate-fade-in">
                            <nav className="flex flex-col px-6 py-4 gap-1">
                                {[
                                    { href: '#features', label: 'Funcionalidades' },
                                    { href: '#how-it-works', label: 'Cómo funciona' },
                                    { href: '#testimonials', label: 'Testimonios' },
                                    { href: '#pricing', label: 'Precios' },
                                ].map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                                {!auth.user && (
                                    <div className="mt-3 flex flex-col gap-2 border-t pt-4">
                                        <Button variant="outline" asChild className="w-full">
                                            <Link href={login()}>Iniciar sesión</Link>
                                        </Button>
                                        {canRegister && (
                                            <Button asChild className="w-full">
                                                <Link href={register()}>Empezar gratis</Link>
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </nav>
                        </div>
                    )}
                </header>

                {/* ── Hero ── */}
                <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-28 overflow-hidden">
                    {/* Animated background orbs */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-3xl animate-orb-1" />
                        <div className="absolute bottom-20 left-1/4 h-80 w-80 rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-3xl animate-orb-2" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl animate-glow-pulse" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,124,131,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,124,131,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
                    </div>

                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="text-center lg:text-left animate-fade-in-left">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-8 animate-shimmer backdrop-blur-sm">
                                <div className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                                </div>
                                Para psicólogos, coaches y terapeutas
                            </div>
                            
                            <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-[1.08] sm:text-5xl lg:text-6xl xl:text-7xl">
                                <span className="animate-fade-in-up-delay-1">Tu consulta organizada,</span>
                                <br />
                                <span className="relative inline-block animate-fade-in-up-delay-2">
                                    <span className="gradient-text-animated">
                                        cada paciente atendido
                                    </span>
                                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                        <path 
                                            d="M2 8c50-6 100-6 196 0" 
                                            stroke="currentColor" 
                                            strokeWidth="3" 
                                            strokeLinecap="round" 
                                            className="text-primary/40"
                                            strokeDasharray="200"
                                            strokeDashoffset="200"
                                            style={{ animation: 'draw-line 1s ease-out 0.8s forwards' }}
                                        />
                                    </svg>
                                </span>
                            </h1>
                            
                            <p className="mb-10 max-w-xl text-lg text-muted-foreground lg:text-xl animate-fade-in-up-delay-3 leading-relaxed">
                                ClientKosmos centraliza fichas de pacientes, sesiones, pagos y cumplimiento RGPD en un solo lugar.
                                Con <span className="text-primary font-semibold">Kosmo IA</span> y un <span className="text-primary font-semibold">panel diario</span>, entras a cada sesión con el contexto listo.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up-delay-3">
                                {canRegister && (
                                    <Button size="lg" asChild className="w-full sm:w-auto group glow-primary-lg hover:scale-105 transition-all duration-300 text-base px-8 py-6">
                                        <Link href={register()} className="flex items-center gap-3">
                                            <span>Comenzar gratis</span>
                                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                                        </Link>
                                    </Button>
                                )}
                                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto group hover:bg-primary/5 transition-all duration-300 text-base px-8 py-6 border-2">
                                    <Link href="#how-it-works" className="flex items-center gap-3">
                                        <Play className="h-4 w-4 text-primary" />
                                        Ver cómo funciona
                                    </Link>
                                </Button>
                            </div>
                            
                            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                                {[
                                    { icon: CheckCircle2, text: 'Sin tarjeta de crédito' },
                                    { icon: Lock, text: 'RGPD integrado' },
                                    { icon: Shield, text: 'Datos protegidos' },
                                ].map((item, i) => (
                                    <span key={i} className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 backdrop-blur-sm">
                                        <item.icon className="h-4 w-4 text-primary" />
                                        {item.text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Hero visual */}
                        <div className="relative animate-fade-in-right">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl rotate-12 animate-float blur-sm" />
                                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-primary/15 to-transparent rounded-3xl -rotate-12 animate-float-delayed blur-sm" />
                                
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 rounded-2xl blur-lg animate-glow-pulse" />
                                    <Card className="relative overflow-hidden border-2 border-primary/30 shadow-2xl backdrop-blur-sm bg-card/95">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                                        <CardHeader className="pb-4 relative">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30">
                                                        <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-semibold">Panel de hoy</p>
                                                        <p className="text-xs text-muted-foreground">3 pacientes · 2 sesiones hoy</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground border-0 shadow-lg shadow-primary/20">
                                                    <Zap className="h-3 w-3 mr-1" />
                                                    Al día
                                                </Badge>
                                            </div>
                                            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3 relative">
                                            <SessionPreviewItem status="done" text="Ana García — Sesión TCC · 10:00" />
                                            <SessionPreviewItem status="done" text="Carlos R. — Pago recibido · 70 €" />
                                            <SessionPreviewItem status="pending" text="Laura M. — Sesión · 17:00" animate />
                                            <div className="pt-3 flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                                                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                    <Brain className="h-4 w-4 text-primary" />
                                                </div>
                                                <p className="text-sm text-muted-foreground flex-1">
                                                    <span className="text-primary font-medium">Kosmo:</span> "Laura M. tiene el consentimiento RGPD pendiente de firma"
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="hidden lg:block absolute -right-4 top-1/4 bg-card border-2 border-primary/30 rounded-2xl p-4 shadow-xl animate-bounce-subtle backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold">Multi‑paciente</p>
                                            <p className="text-xs text-muted-foreground">Cada consulta separada</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden lg:block absolute -left-4 bottom-1/4 bg-card border-2 border-primary/30 rounded-2xl p-4 shadow-xl animate-float backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 flex items-center justify-center">
                                            <Brain className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold">Kosmo IA</p>
                                            <p className="text-xs text-muted-foreground">Briefings y chat contextual</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* ── Features - Bento Grid ── */}
                <section id="features" className="relative py-28 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,124,131,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,124,131,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
                    </div>

                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-20 text-center">
                            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/5 px-4 py-1.5 text-sm">
                                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                Funcionalidades
                            </Badge>
                            <h2 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                                Todo lo que necesita tu consulta,{' '}
                                <span className="gradient-text-animated">
                                    en un solo lugar
                                </span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                                Diseñado para profesionales autónomos de servicios: psicólogos, coaches, terapeutas y asesores.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                            {/* Fichas de pacientes - grande */}
                            <BentoCard
                                className="md:col-span-2 lg:col-span-2"
                                icon={<Users className="h-8 w-8" />}
                                title="Fichas de pacientes"
                                description="Cada paciente tiene su propio expediente: notas de sesión, documentos, acuerdos, pagos y consentimientos. Retoma el contexto exacto de la última sesión."
                                badge="Core"
                                gradient="from-blue-500/20 via-cyan-500/10 to-transparent"
                                featured
                                delay={0}
                            >
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {[
                                        { label: 'Ana García · TCC', color: 'bg-violet-500/15 text-violet-600 ring-1 ring-violet-500/20' },
                                        { label: 'Carlos R. · Coaching', color: 'bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20' },
                                        { label: 'Laura M. · Terapia', color: 'bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/20' },
                                    ].map((p, i) => (
                                        <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${p.color}`}>
                                            {p.label}
                                        </span>
                                    ))}
                                </div>
                            </BentoCard>

                            {/* Sesiones pre/post */}
                            <BentoCard
                                icon={<CalendarClock className="h-7 w-7" />}
                                title="Pre y post sesión"
                                description="Revisa el contexto del paciente antes de entrar y registra notas justo al terminar, con el flujo integrado en la ficha."
                                badge="Gratis"
                                gradient="from-green-500/20 via-emerald-500/10 to-transparent"
                                delay={1}
                            />

                            {/* Notas de sesión */}
                            <BentoCard
                                icon={<NotebookPen className="h-7 w-7" />}
                                title="Notas de sesión"
                                description="Registra observaciones clínicas y apuntes vinculados al paciente. Historial ordenado y siempre accesible."
                                badge="Gratis"
                                gradient="from-yellow-500/20 via-amber-500/10 to-transparent"
                                delay={2}
                            />

                            {/* Kosmo IA - grande */}
                            <BentoCard
                                className="md:col-span-2 lg:col-span-1 lg:row-span-2"
                                icon={<Brain className="h-8 w-8" />}
                                title="Kosmo IA"
                                description="Tu asistente inteligente con briefings diarios automáticos y chat contextual (Llama 3.3 70B). Entra a cada sesión informado, sin revisar notas manualmente."
                                badge="Solo"
                                gradient="from-indigo-500/20 via-purple-500/10 to-transparent"
                                isPremium
                                featured
                                delay={3}
                            >
                                <div className="mt-5 space-y-3">
                                    <div className="flex gap-2.5 items-start">
                                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/20">
                                            <Brain className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex-1 ring-1 ring-border/50">
                                            <p className="text-xs leading-relaxed">
                                                "Ana lleva 3 sesiones trabajando ansiedad. Última nota: progreso notable en técnicas de respiración."
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2.5 items-start justify-end">
                                        <div className="bg-primary/10 rounded-2xl rounded-tr-sm px-3.5 py-2.5 ring-1 ring-primary/20">
                                            <p className="text-xs leading-relaxed">
                                                "¿Qué trabajar hoy con Carlos?"
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2.5 items-start">
                                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/20">
                                            <Brain className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex-1 ring-1 ring-border/50">
                                            <p className="text-xs leading-relaxed">
                                                "Tiene pendiente revisar el acuerdo de sesiones. Sugiero abordar los objetivos del mes."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </BentoCard>

                            {/* Pagos y facturación */}
                            <BentoCard
                                icon={<CreditCard className="h-7 w-7" />}
                                title="Pagos y facturación"
                                description="Registra cobros por paciente (pendiente, pagado, vencido) y consulta el resumen de ingresos con filtros por período."
                                badge="Gratis"
                                gradient="from-teal-500/20 via-emerald-500/10 to-transparent"
                                delay={4}
                            />

                            {/* Documentos y RGPD */}
                            <BentoCard
                                icon={<FileText className="h-7 w-7" />}
                                title="Documentos y RGPD"
                                description="Adjunta archivos por paciente y gestiona consentimientos informados digitales con tu plantilla RGPD personalizable."
                                badge="Solo"
                                gradient="from-purple-500/20 via-violet-500/10 to-transparent"
                                isPremium
                                delay={5}
                            />
                        </div>
                    </div>
                </section>

                {/* ── How it works ── */}
                <section id="how-it-works" className="relative border-y overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(14,124,131,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,124,131,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

                    <div className="relative mx-auto max-w-6xl px-6 py-28">
                        <div className="mb-20 text-center">
                            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/5 px-4 py-1.5 text-sm">
                                <Rocket className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                Cómo funciona
                            </Badge>
                            <h2 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                                Tu consulta lista en{' '}
                                <span className="gradient-text-animated">
                                    3 pasos
                                </span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                                Empezar con ClientKosmos es tan sencillo que estarás operativo hoy mismo.
                            </p>
                        </div>

                        <div className="relative grid gap-8 md:grid-cols-3">
                            <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                            
                            <StepCard 
                                number={1}
                                title="Configura tu consulta"
                                description="Regístrate gratis, añade el nombre de tu consulta, especialidad y configura tu plantilla RGPD en minutos."
                                icon={<Users className="h-6 w-6" />}
                            />
                            <StepCard 
                                number={2}
                                title="Añade tus pacientes"
                                description="Crea fichas con historial, notas de sesión, documentos, acuerdos y pagos. Todo en el expediente de cada paciente."
                                icon={<NotebookPen className="h-6 w-6" />}
                            />
                            <StepCard 
                                number={3}
                                title="Gestiona con Kosmo IA"
                                description="Cada mañana Kosmo te prepara un briefing de tus pacientes. Entra a cada sesión con el contexto listo, sin buscar notas."
                                icon={<Brain className="h-6 w-6" />}
                            />
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ── */}
                <section id="testimonials" className="relative py-28 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
                    </div>

                    <div className="mx-auto max-w-6xl px-6">
                        <div className="mb-16 text-center">
                            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/5 px-4 py-1.5 text-sm">
                                <Quote className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                Testimonios
                            </Badge>
                            <h2 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                                Lo que dicen{' '}
                                <span className="gradient-text-animated">
                                    nuestros usuarios
                                </span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                                Profesionales de servicios que ya gestionan su consulta sin perder contexto.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <TestimonialCard
                                quote="Antes mezclaba cuadernos, hojas de Excel y carpetas de email. Con ClientKosmos tengo el expediente completo de cada paciente en segundos, incluyendo los consentimientos RGPD."
                                author="María García"
                                role="Psicóloga clínica autónoma"
                                avatar="M"
                                rating={5}
                            />
                            <TestimonialCard
                                quote="Kosmo IA me da un briefing cada mañana con el estado de mis pacientes. Entro a cada sesión sabiendo exactamente dónde lo dejamos, sin revisar notas a mano."
                                author="Carlos López"
                                role="Coach de vida certificado"
                                avatar="C"
                                rating={5}
                                featured
                            />
                            <TestimonialCard
                                quote="El control de pagos por paciente me ha eliminado las facturas pendientes. El aviso de pago vencido me hace un recordatorio automático sin necesidad de revisar nada."
                                author="Ana Martínez"
                                role="Terapeuta y nutricionista"
                                avatar="A"
                                rating={5}
                            />
                        </div>
                    </div>
                </section>

                {/* ── Pricing ── */}
                <section id="pricing" className="relative border-y bg-gradient-to-b from-background via-muted/20 to-background">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(14,124,131,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(14,124,131,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

                    <div className="relative mx-auto max-w-6xl px-6 py-28">
                        <div className="mb-20 text-center">
                            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/5 px-4 py-1.5 text-sm">
                                <Star className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                Precios
                            </Badge>
                            <h2 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                                Elige tu{' '}
                                <span className="gradient-text-animated">
                                    plan ideal
                                </span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                                Empieza gratis con un paciente y escala cuando tu consulta crezca.
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3 items-start">
                            {/* Free */}
                            <Card className="group relative flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-2 border-transparent hover:border-muted">
                                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardHeader className="relative pb-2">
                                    <div className="mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                                        <LayoutDashboard className="h-7 w-7 text-muted-foreground" />
                                    </div>
                                    <CardTitle className="text-2xl">Gratis</CardTitle>
                                    <CardDescription className="text-base">Para empezar a conocer la herramienta</CardDescription>
                                    <div className="pt-6 pb-2">
                                        <span className="text-6xl font-bold">0 €</span>
                                        <span className="text-muted-foreground ml-2 text-lg">/ mes</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Para siempre, sin límites de tiempo</p>
                                </CardHeader>
                                <CardContent className="relative flex flex-1 flex-col justify-between gap-8 pt-4">
                                    <ul className="space-y-4 text-sm">
                                        <PricingFeature text="1 paciente activo" />
                                        <PricingFeature text="Notas de sesión ilimitadas" />
                                        <PricingFeature text="Control de pagos básico" />
                                        <PricingFeature text="Panel diario" />
                                    </ul>
                                    {canRegister && (
                                        <Button variant="outline" size="lg" className="w-full group/btn border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300" asChild>
                                            <Link href={register()} className="flex items-center justify-center gap-2">
                                                Empezar gratis
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                                            </Link>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Premium Mensual - Featured */}
                            <Card className="group relative flex flex-col overflow-hidden border-2 border-primary shadow-2xl shadow-primary/20 lg:scale-105 transition-all duration-500 hover:-translate-y-3 z-10">
                                <div className="absolute -right-12 top-8 rotate-45 bg-gradient-to-r from-primary to-primary/80 px-14 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
                                    Popular
                                </div>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative bg-card rounded-xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                                    <CardHeader className="relative pb-2">
                                        <div className="mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl shadow-primary/30 transition-all duration-500 group-hover:scale-110">
                                            <Star className="h-7 w-7 text-primary-foreground" />
                                        </div>
                                        <CardTitle className="text-2xl">Solo Mensual</CardTitle>
                                        <CardDescription className="text-base">Consulta completa, sin ataduras</CardDescription>
                                        <div className="pt-6 pb-2">
                                            <span className="text-6xl font-bold">11,99 €</span>
                                            <span className="text-muted-foreground ml-2 text-lg">/ mes</span>
                                        </div>
                                        <p className="text-sm text-primary font-medium">Cancela cuando quieras</p>
                                    </CardHeader>
                                    <CardContent className="relative flex flex-1 flex-col justify-between gap-8 pt-4">
                                        <ul className="space-y-4 text-sm">
                                            <PricingFeature text="Pacientes ilimitados" highlight />
                                            <PricingFeature text="Sesiones pre y post ilimitadas" highlight />
                                            <PricingFeature text="Notas y acuerdos ilimitados" />
                                            <PricingFeature text="Documentos por paciente" />
                                            <PricingFeature text="Consentimientos RGPD digitales" highlight />
                                            <PricingFeature text="Kosmo IA — briefings y chat" highlight />
                                            <PricingFeature text="Facturación consolidada" />
                                        </ul>
                                        {canRegister && (
                                            <Button size="lg" className="w-full group/btn glow-primary text-base transition-all duration-300 hover:scale-[1.02]" asChild>
                                                <Link href={register()} className="flex items-center justify-center gap-2">
                                                    Empezar ahora
                                                    <Sparkles className="h-5 w-5 transition-transform group-hover/btn:rotate-12 group-hover/btn:scale-110" />
                                                </Link>
                                            </Button>
                                        )}
                                    </CardContent>
                                </div>
                            </Card>

                            {/* Premium Anual */}
                            <Card className="group relative flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-2 border-transparent hover:border-muted">
                                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardHeader className="relative pb-2">
                                    <Badge variant="secondary" className="absolute right-4 top-4 gap-1 py-1">
                                        <Zap className="h-3.5 w-3.5" />
                                        Ahorra 17%
                                    </Badge>
                                    <div className="mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                                        <Shield className="h-7 w-7 text-muted-foreground" />
                                    </div>
                                    <CardTitle className="text-2xl">Solo Anual</CardTitle>
                                    <CardDescription className="text-base">La opción más inteligente</CardDescription>
                                    <div className="pt-6 pb-2">
                                        <span className="text-6xl font-bold">119 €</span>
                                        <span className="text-muted-foreground ml-2 text-lg">/ año</span>
                                    </div>
                                    <p className="text-sm text-primary font-semibold">
                                        ≈ 9,92 €/mes — Ahorro de 24,88 €
                                    </p>
                                </CardHeader>
                                <CardContent className="relative flex flex-1 flex-col justify-between gap-8 pt-4">
                                    <ul className="space-y-4 text-sm">
                                        <PricingFeature text="Todo lo de Solo Mensual" highlight />
                                        <PricingFeature text="Facturación anual con descuento" />
                                        <PricingFeature text="Soporte prioritario" highlight />
                                        <PricingFeature text="Acceso anticipado a novedades" />
                                    </ul>
                                    {canRegister && (
                                        <Button variant="outline" size="lg" className="w-full group/btn border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300" asChild>
                                            <Link href={register()} className="flex items-center justify-center gap-2">
                                                Empezar ahora
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                                            </Link>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <p className="mt-12 text-center text-sm text-muted-foreground">
                            Todos los planes incluyen soporte por email y actualizaciones gratuitas.{' '}
                            <span className="text-primary font-medium">Sin sorpresas.</span>
                        </p>
                    </div>
                </section>

                {/* ── Final CTA ── */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.06] to-background" />
                    {/* Subtle orbs */}
                    <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-orb-1" />
                    <div className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-primary/8 blur-3xl animate-orb-2" />

                    <div className="relative mx-auto max-w-4xl px-6 py-32 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
                            <Leaf className="h-3.5 w-3.5" />
                            ¿Listo para organizar tu consulta?
                        </div>
                        <h2 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Gestiona tu consulta{' '}
                            <br className="hidden sm:block" />
                            <span className="gradient-text-animated">
                                como un profesional
                            </span>
                        </h2>
                        <p className="mx-auto mb-12 max-w-xl text-lg text-muted-foreground leading-relaxed">
                            Únete a profesionales que ya centralizan su consulta en ClientKosmos.
                            El plan gratuito es para siempre y no requiere tarjeta.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {canRegister && (
                                <Button size="lg" asChild className="group glow-primary-lg hover:scale-105 transition-all duration-300 text-base px-10 py-6">
                                    <Link href={register()} className="flex items-center gap-3">
                                        <span>Crear cuenta gratuita</span>
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                                    </Link>
                                </Button>
                            )}
                            <Button size="lg" variant="outline" asChild className="text-base px-10 py-6 border-2 hover:bg-primary/5">
                                <Link href={login()}>Ya tengo cuenta</Link>
                            </Button>
                        </div>
                        
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                Sin tarjeta de crédito
                            </span>
                            <span className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
                                <Lock className="h-4 w-4 text-primary" />
                                RGPD integrado
                            </span>
                            <span className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
                                <Zap className="h-4 w-4 text-primary" />
                                Activo en minutos
                            </span>
                        </div>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t bg-gradient-to-b from-muted/20 to-background">
                    <div className="mx-auto max-w-6xl px-6 py-16">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 mb-12">
                            {/* Brand */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src={logo}
                                        alt="ClientKosmos"
                                        className="h-10 w-auto object-contain"
                                    />
                                    <span className="text-2xl font-bold gradient-text-animated">
                                        ClientKosmos
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                                    Plataforma de gestión de consulta para profesionales autónomos.
                                    Fichas de pacientes, sesiones, pagos, RGPD y Kosmo IA en un solo lugar.
                                </p>
                            </div>
                            
                            {/* Links */}
                            <div>
                                <h4 className="font-semibold mb-4">Producto</h4>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li><a href="#features" className="transition-colors hover:text-primary">Funcionalidades</a></li>
                                    <li><a href="#how-it-works" className="transition-colors hover:text-primary">Cómo funciona</a></li>
                                    <li><a href="#pricing" className="transition-colors hover:text-primary">Precios</a></li>
                                    <li><a href="#testimonials" className="transition-colors hover:text-primary">Testimonios</a></li>
                                </ul>
                            </div>
                            
                            {/* CTA mini */}
                            <div>
                                <h4 className="font-semibold mb-4">Empezar</h4>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li><Link href={register()} className="transition-colors hover:text-primary">Crear cuenta</Link></li>
                                    <li><Link href={login()} className="transition-colors hover:text-primary">Iniciar sesión</Link></li>
                                </ul>
                            </div>
                        </div>
                        
                        <Separator className="mb-8" />
                        
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between text-sm text-muted-foreground">
                            <p>© {new Date().getFullYear()} ClientKosmos · Proyecto Intermodular 2º DAM</p>
                            <p className="flex items-center gap-1.5">
                                Hecho con <span className="text-red-500 animate-pulse">❤</span> para profesionales organizados
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

/* ── Subcomponentes locales ── */

function BentoCard({
    icon,
    title,
    description,
    badge,
    gradient = 'from-primary/20 to-transparent',
    className = '',
    featured = false,
    isPremium = false,
    delay = 0,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
    gradient?: string;
    className?: string;
    featured?: boolean;
    isPremium?: boolean;
    delay?: number;
    children?: React.ReactNode;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!cardRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.15 }
        );
        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${delay * 100}ms` }}
        >
            <Card className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-full ${className} ${featured ? 'border-2 border-primary/20 hover:border-primary/40' : 'border border-border/60 hover:border-primary/30'}`}>
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 group-hover:opacity-80 transition-opacity duration-500`} />

                {/* Featured glow */}
                {featured && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
                )}

                {/* Shine sweep on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none" />

                <CardContent className={`relative ${featured ? 'p-8' : 'p-6'} h-full`}>
                    <div className="flex items-start justify-between mb-5">
                        <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-3.5 text-primary ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/15 group-hover:ring-primary/25`}>
                            {icon}
                        </div>
                        <Badge
                            variant={isPremium ? 'default' : 'secondary'}
                            className={`transition-all duration-300 text-[11px] tracking-wide uppercase font-semibold ${isPremium ? 'bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/20' : 'bg-secondary/80'}`}
                        >
                            {isPremium && <Star className="h-3 w-3 mr-1 fill-current" />}
                            {badge}
                        </Badge>
                    </div>
                    <h3 className={`font-bold mb-2.5 transition-colors duration-300 group-hover:text-primary ${featured ? 'text-xl' : 'text-lg'}`}>
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}


function TestimonialCard({
    quote,
    author,
    role,
    avatar,
    rating,
    featured = false,
}: {
    quote: string;
    author: string;
    role: string;
    avatar: string;
    rating: number;
    featured?: boolean;
}) {
    return (
        <Card className={`group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${featured ? 'border-2 border-primary/30 md:scale-105 z-10' : ''}`}>
            {featured && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-xl blur" />
            )}
            <CardContent className="relative p-6">
                <div className="flex gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                </div>
                <Quote className="h-8 w-8 text-primary/20 mb-2" />
                <p className="text-sm leading-relaxed mb-6 text-muted-foreground">
                    "{quote}"
                </p>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                        {avatar}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{author}</p>
                        <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function PricingFeature({ text, highlight = false }: { text: string; highlight?: boolean }) {
    return (
        <li className="flex items-center gap-3">
            <div className={`flex-shrink-0 rounded-full p-0.5 ${highlight ? 'bg-primary/20' : ''}`}>
                <CheckCircle2 className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-primary/70'}`} />
            </div>
            <span className={highlight ? 'font-medium' : ''}>{text}</span>
        </li>
    );
}

function StepCard({
    number,
    title,
    description,
    icon,
}: {
    number: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="group relative">
            <Card className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="relative pt-8 pb-6 px-6">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition-colors" />
                            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-xl shadow-xl shadow-primary/30">
                                {number}
                            </div>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-3 text-primary transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                            {icon}
                        </div>
                    </div>
                    <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

function SessionPreviewItem({
    status,
    text,
    animate = false,
}: {
    status: 'done' | 'pending' | 'alert';
    text: string;
    animate?: boolean;
}) {
    const statusConfig = {
        done: {
            dot: 'bg-emerald-500 shadow-emerald-500/50',
            wrapper: 'bg-muted/50 border-muted opacity-70',
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
            textClass: 'line-through text-muted-foreground',
        },
        pending: {
            dot: 'bg-primary shadow-primary/50',
            wrapper: 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/10',
            icon: <ArrowRight className="h-4 w-4 text-primary animate-pulse" />,
            textClass: '',
        },
        alert: {
            dot: 'bg-amber-500 shadow-amber-500/50',
            wrapper: 'bg-amber-500/5 border-amber-500/30',
            icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
            textClass: '',
        },
    };

    const cfg = statusConfig[status];

    return (
        <div className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-all duration-300 ${cfg.wrapper}`}>
            <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${cfg.dot} shadow-sm ${animate ? 'animate-pulse' : ''}`} />
            <span className={`flex-1 text-sm ${cfg.textClass}`}>{text}</span>
            {cfg.icon}
        </div>
    );
}

