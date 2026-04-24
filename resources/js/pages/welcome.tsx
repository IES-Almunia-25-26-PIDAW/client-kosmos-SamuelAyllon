import { Box, Flex, Heading, Icon, Stack, Text, chakra } from '@chakra-ui/react';
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
import logo from '@/assets/logo.svg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { login, register } from '@/routes';
import { dashboard } from '@/routes';
import type { Auth } from '@/types';

const NAV_ITEMS = [
    { href: '#features', label: 'Funcionalidades' },
    { href: '#how-it-works', label: 'Cómo funciona' },
    { href: '#testimonials', label: 'Testimonios' },
    { href: '#pricing', label: 'Precios' },
];

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="ClientKosmos — Gestión de consulta para profesionales de servicios" />

            <Box minH="100vh" bg="bg" color="fg" overflowX="hidden">
                {/* Navbar */}
                <chakra.header position="sticky" top="0" zIndex="50" borderBottomWidth="1px" bg="bg/60" backdropFilter="blur(12px)">
                    <Flex mx="auto" h="16" maxW="6xl" alignItems="center" justifyContent="space-between" px="6">
                        <Flex alignItems="center" gap="2" cursor="pointer" role="group">
                            <chakra.img
                                src={logo}
                                alt="ClientKosmos"
                                h="8"
                                w="auto"
                                objectFit="contain"
                                transition="transform 0.5s"
                                _groupHover={{ transform: 'scale(1.1) rotate(6deg)' }}
                            />
                            <Text as="span" fontSize="xl" fontWeight="bold" letterSpacing="tight" className="gradient-text-animated">
                                ClientKosmos
                            </Text>
                        </Flex>

                        <chakra.nav display={{ base: 'none', md: 'flex' }} alignItems="center" gap="8" fontSize="sm" fontWeight="medium">
                            {NAV_ITEMS.map((item) => (
                                <chakra.a
                                    key={item.href}
                                    href={item.href}
                                    position="relative"
                                    color="fg.muted"
                                    transition="colors"
                                    _hover={{ color: 'fg' }}
                                >
                                    {item.label}
                                </chakra.a>
                            ))}
                        </chakra.nav>

                        <Flex alignItems="center" gap="3">
                            {auth.user ? (
                                <Button asChild className="glow-primary">
                                    <Link href={dashboard()}>
                                        <Flex alignItems="center" gap="2">
                                            Ir al dashboard
                                            <Icon as={ArrowRight} boxSize="4" />
                                        </Flex>
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild display={{ base: 'none', sm: 'inline-flex' }}>
                                        <Link href={login()}>Iniciar sesión</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild className="glow-primary" display={{ base: 'none', sm: 'inline-flex' }}>
                                            <Link href={register()}>
                                                <Flex alignItems="center" gap="2">
                                                    <span>Empezar ya</span>
                                                    <Icon as={Sparkles} boxSize="4" />
                                                </Flex>
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                display={{ base: 'inline-flex', md: 'none' }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Abrir menú"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </Button>
                        </Flex>
                    </Flex>

                    {isMobileMenuOpen && (
                        <Box display={{ md: 'none' }} borderTopWidth="1px" bg="bg/95" backdropFilter="blur(12px)">
                            <Stack as="nav" px="6" py="4" gap="1">
                                {NAV_ITEMS.map((item) => (
                                    <chakra.a
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        borderRadius="lg"
                                        px="4"
                                        py="3"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="fg.muted"
                                        transition="colors"
                                        _hover={{ bg: 'brand.muted', color: 'fg' }}
                                    >
                                        {item.label}
                                    </chakra.a>
                                ))}
                                {!auth.user && (
                                    <Stack mt="3" gap="2" borderTopWidth="1px" pt="4">
                                        <Button variant="outline" asChild w="full">
                                            <Link href={login()}>Iniciar sesión</Link>
                                        </Button>
                                        {canRegister && (
                                            <Button asChild w="full">
                                                <Link href={register()}>Empezar gratis</Link>
                                            </Button>
                                        )}
                                    </Stack>
                                )}
                            </Stack>
                        </Box>
                    )}
                </chakra.header>

                {/* Hero */}
                <chakra.section position="relative" mx="auto" maxW="6xl" px="6" py={{ base: '16', lg: '28' }} overflow="hidden">
                    <Box position="absolute" inset="0" zIndex="-1" overflow="hidden">
                        <Box position="absolute" top="20" right="1/4" h="96" w="96" borderRadius="full" bg="brand.muted" filter="blur(60px)" className="animate-orb-1" />
                        <Box position="absolute" bottom="20" left="1/4" h="80" w="80" borderRadius="full" bg="brand.muted" filter="blur(60px)" className="animate-orb-2" />
                    </Box>

                    <Box display="grid" gap={{ base: '12', lg: '16' }} gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} alignItems="center">
                        <Box textAlign={{ base: 'center', lg: 'left' }} className="animate-fade-in-left">
                            <Flex
                                display="inline-flex"
                                alignItems="center"
                                gap="2"
                                borderRadius="full"
                                borderWidth="1px"
                                borderColor="brand.muted"
                                bg="brand.muted"
                                px="4"
                                py="2"
                                fontSize="sm"
                                fontWeight="medium"
                                color="brand.solid"
                                mb="8"
                                backdropFilter="blur(8px)"
                            >
                                <Flex position="relative" h="2" w="2">
                                    <Box as="span" position="absolute" h="full" w="full" borderRadius="full" bg="brand.solid" opacity={0.75} animation="ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" />
                                    <Box as="span" position="relative" h="2" w="2" borderRadius="full" bg="brand.solid" />
                                </Flex>
                                Para psicólogos, coaches y terapeutas
                            </Flex>

                            <Heading
                                as="h1"
                                mb="6"
                                fontSize={{ base: '4xl', sm: '5xl', lg: '6xl', xl: '7xl' }}
                                fontWeight="extrabold"
                                letterSpacing="tight"
                                lineHeight="1.08"
                            >
                                <Box as="span" display="block">Tu consulta organizada,</Box>
                                <Box as="span" position="relative" display="inline-block">
                                    <Text as="span" className="gradient-text-animated">cada paciente atendido</Text>
                                </Box>
                            </Heading>

                            <Text mb="10" maxW="xl" fontSize={{ base: 'lg', lg: 'xl' }} color="fg.muted" lineHeight="relaxed">
                                ClientKosmos centraliza fichas de pacientes, sesiones, pagos y cumplimiento RGPD en un solo lugar.
                                Con <Text as="span" color="brand.solid" fontWeight="semibold">Kosmo IA</Text> y un <Text as="span" color="brand.solid" fontWeight="semibold">panel diario</Text>, entras a cada sesión con el contexto listo.
                            </Text>

                            <Flex direction={{ base: 'column', sm: 'row' }} alignItems="center" justifyContent={{ base: 'center', lg: 'flex-start' }} gap="4">
                                {canRegister && (
                                    <Button size="lg" asChild className="glow-primary" w={{ base: 'full', sm: 'auto' }}>
                                        <Link href={register()}>
                                            <Flex alignItems="center" gap="3">
                                                <span>Comenzar gratis</span>
                                                <Icon as={ArrowRight} boxSize="5" />
                                            </Flex>
                                        </Link>
                                    </Button>
                                )}
                                <Button size="lg" variant="outline" asChild w={{ base: 'full', sm: 'auto' }}>
                                    <Link href="#how-it-works">
                                        <Flex alignItems="center" gap="3">
                                            <Icon as={Play} boxSize="4" color="brand.solid" />
                                            Ver cómo funciona
                                        </Flex>
                                    </Link>
                                </Button>
                            </Flex>

                            <Flex mt="10" flexWrap="wrap" alignItems="center" justifyContent={{ base: 'center', lg: 'flex-start' }} gap="6" fontSize="sm" color="fg.muted">
                                {[
                                    { icon: CheckCircle2, text: 'Sin tarjeta de crédito' },
                                    { icon: Lock, text: 'RGPD integrado' },
                                    { icon: Shield, text: 'Datos protegidos' },
                                ].map((item, i) => (
                                    <Flex key={i} as="span" alignItems="center" gap="2" bg="bg.muted" borderRadius="full" px="4" py="2">
                                        <Icon as={item.icon} boxSize="4" color="brand.solid" />
                                        {item.text}
                                    </Flex>
                                ))}
                            </Flex>
                        </Box>

                        {/* Hero visual */}
                        <Box position="relative" className="animate-fade-in-right">
                            <Box position="relative" mx="auto" maxW={{ base: 'md', lg: 'none' }}>
                                <Box position="relative">
                                    <Card borderWidth="2px" borderColor="brand.muted" boxShadow="2xl">
                                        <CardHeader>
                                            <Flex alignItems="center" justifyContent="space-between">
                                                <Flex alignItems="center" gap="3">
                                                    <Flex h="12" w="12" borderRadius="xl" bg="brand.solid" alignItems="center" justifyContent="center" boxShadow="lg">
                                                        <Icon as={LayoutDashboard} boxSize="6" color="brand.contrast" />
                                                    </Flex>
                                                    <Box>
                                                        <Text fontSize="md" fontWeight="semibold">Panel de hoy</Text>
                                                        <Text fontSize="xs" color="fg.muted">3 pacientes · 2 sesiones hoy</Text>
                                                    </Box>
                                                </Flex>
                                                <Badge>
                                                    <Flex alignItems="center" gap="1">
                                                        <Zap size={12} />
                                                        Al día
                                                    </Flex>
                                                </Badge>
                                            </Flex>
                                            <Box mt="4" h="2" bg="bg.muted" borderRadius="full" overflow="hidden">
                                                <Box h="full" w="75%" bg="brand.solid" borderRadius="full" />
                                            </Box>
                                        </CardHeader>
                                        <CardContent>
                                            <Stack gap="3">
                                                <SessionPreviewItem status="done" text="Ana García — Sesión TCC · 10:00" />
                                                <SessionPreviewItem status="done" text="Carlos R. — Pago recibido · 70 €" />
                                                <SessionPreviewItem status="pending" text="Laura M. — Sesión · 17:00" animate />
                                                <Flex pt="3" alignItems="center" gap="3" p="3" borderRadius="xl" bg="brand.muted" borderWidth="1px" borderColor="brand.muted">
                                                    <Flex h="8" w="8" borderRadius="lg" bg="brand.muted" alignItems="center" justifyContent="center" flexShrink={0}>
                                                        <Icon as={Brain} boxSize="4" color="brand.solid" />
                                                    </Flex>
                                                    <Text fontSize="sm" color="fg.muted" flex="1">
                                                        <Text as="span" color="brand.solid" fontWeight="medium">Kosmo:</Text> "Laura M. tiene el consentimiento RGPD pendiente de firma"
                                                    </Text>
                                                </Flex>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </chakra.section>

                {/* Features Bento */}
                <chakra.section id="features" position="relative" py="28" overflow="hidden">
                    <Box mx="auto" maxW="6xl" px="6">
                        <Box mb="20" textAlign="center">
                            <Badge variant="outline" mb="6" px="4" py="1.5" fontSize="sm">
                                <Flex alignItems="center" gap="1.5">
                                    <Sparkles size={14} color="var(--ck-colors-brand-solid)" />
                                    Funcionalidades
                                </Flex>
                            </Badge>
                            <Heading as="h2" mb="5" fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }} fontWeight="extrabold" letterSpacing="tight">
                                Todo lo que necesita tu consulta,{' '}
                                <Text as="span" className="gradient-text-animated">en un solo lugar</Text>
                            </Heading>
                            <Text mx="auto" maxW="2xl" fontSize="lg" color="fg.muted" lineHeight="relaxed">
                                Diseñado para profesionales autónomos de servicios: psicólogos, coaches, terapeutas y asesores.
                            </Text>
                        </Box>

                        <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={{ base: '5', lg: '6' }}>
                            <BentoCard
                                colSpan={{ md: 2, lg: 2 }}
                                icon={<Users size={32} />}
                                title="Fichas de pacientes"
                                description="Cada paciente tiene su propio expediente: notas de sesión, documentos, acuerdos, pagos y consentimientos. Retoma el contexto exacto de la última sesión."
                                badge="Core"
                                featured
                                delay={0}
                            >
                                <Flex mt="5" flexWrap="wrap" gap="2">
                                    {[
                                        { label: 'Ana García · TCC', palette: 'purple' },
                                        { label: 'Carlos R. · Coaching', palette: 'green' },
                                        { label: 'Laura M. · Terapia', palette: 'yellow' },
                                    ].map((p, i) => (
                                        <Badge key={i} borderRadius="full" px="3" py="1.5" fontSize="xs" fontWeight="semibold">
                                            {p.label}
                                        </Badge>
                                    ))}
                                </Flex>
                            </BentoCard>

                            <BentoCard
                                icon={<CalendarClock size={28} />}
                                title="Pre y post sesión"
                                description="Revisa el contexto del paciente antes de entrar y registra notas justo al terminar, con el flujo integrado en la ficha."
                                badge="Gratis"
                                delay={1}
                            />

                            <BentoCard
                                icon={<NotebookPen size={28} />}
                                title="Notas de sesión"
                                description="Registra observaciones clínicas y apuntes vinculados al paciente. Historial ordenado y siempre accesible."
                                badge="Gratis"
                                delay={2}
                            />

                            <BentoCard
                                colSpan={{ md: 2, lg: 1 }}
                                rowSpan={{ lg: 2 }}
                                icon={<Brain size={32} />}
                                title="Kosmo IA"
                                description="Tu asistente inteligente con briefings diarios automáticos y chat contextual (Llama 3.3 70B). Entra a cada sesión informado, sin revisar notas manualmente."
                                badge="Solo"
                                isPremium
                                featured
                                delay={3}
                            >
                                <Stack mt="5" gap="3">
                                    <Flex gap="2.5" alignItems="flex-start">
                                        <Flex h="7" w="7" borderRadius="full" bg="brand.muted" alignItems="center" justifyContent="center" flexShrink={0}>
                                            <Icon as={Brain} boxSize="3.5" color="brand.solid" />
                                        </Flex>
                                        <Box bg="bg.muted" borderRadius="2xl" borderTopLeftRadius="sm" px="3.5" py="2.5" flex="1">
                                            <Text fontSize="xs" lineHeight="relaxed">
                                                "Ana lleva 3 sesiones trabajando ansiedad. Última nota: progreso notable en técnicas de respiración."
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Flex gap="2.5" alignItems="flex-start" justifyContent="flex-end">
                                        <Box bg="brand.muted" borderRadius="2xl" borderTopRightRadius="sm" px="3.5" py="2.5">
                                            <Text fontSize="xs" lineHeight="relaxed">"¿Qué trabajar hoy con Carlos?"</Text>
                                        </Box>
                                    </Flex>
                                    <Flex gap="2.5" alignItems="flex-start">
                                        <Flex h="7" w="7" borderRadius="full" bg="brand.muted" alignItems="center" justifyContent="center" flexShrink={0}>
                                            <Icon as={Brain} boxSize="3.5" color="brand.solid" />
                                        </Flex>
                                        <Box bg="bg.muted" borderRadius="2xl" borderTopLeftRadius="sm" px="3.5" py="2.5" flex="1">
                                            <Text fontSize="xs" lineHeight="relaxed">
                                                "Tiene pendiente revisar el acuerdo de sesiones. Sugiero abordar los objetivos del mes."
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Stack>
                            </BentoCard>

                            <BentoCard
                                icon={<CreditCard size={28} />}
                                title="Pagos y facturación"
                                description="Registra cobros por paciente (pendiente, pagado, vencido) y consulta el resumen de ingresos con filtros por período."
                                badge="Gratis"
                                delay={4}
                            />

                            <BentoCard
                                icon={<FileText size={28} />}
                                title="Documentos y RGPD"
                                description="Adjunta archivos por paciente y gestiona consentimientos informados digitales con tu plantilla RGPD personalizable."
                                badge="Solo"
                                isPremium
                                delay={5}
                            />
                        </Box>
                    </Box>
                </chakra.section>

                {/* How it works */}
                <chakra.section id="how-it-works" position="relative" borderTopWidth="1px" borderBottomWidth="1px" overflow="hidden">
                    <Box position="relative" mx="auto" maxW="6xl" px="6" py="28">
                        <Box mb="20" textAlign="center">
                            <Badge variant="outline" mb="6" px="4" py="1.5" fontSize="sm">
                                <Flex alignItems="center" gap="1.5">
                                    <Rocket size={14} color="var(--ck-colors-brand-solid)" />
                                    Cómo funciona
                                </Flex>
                            </Badge>
                            <Heading as="h2" mb="5" fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }} fontWeight="extrabold" letterSpacing="tight">
                                Tu consulta lista en{' '}
                                <Text as="span" className="gradient-text-animated">3 pasos</Text>
                            </Heading>
                            <Text mx="auto" maxW="2xl" fontSize="lg" color="fg.muted" lineHeight="relaxed">
                                Empezar con ClientKosmos es tan sencillo que estarás operativo hoy mismo.
                            </Text>
                        </Box>

                        <Box display="grid" gap="8" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}>
                            <StepCard number={1} title="Configura tu consulta" description="Regístrate gratis, añade el nombre de tu consulta, especialidad y configura tu plantilla RGPD en minutos." icon={<Users size={24} />} />
                            <StepCard number={2} title="Añade tus pacientes" description="Crea fichas con historial, notas de sesión, documentos, acuerdos y pagos. Todo en el expediente de cada paciente." icon={<NotebookPen size={24} />} />
                            <StepCard number={3} title="Gestiona con Kosmo IA" description="Cada mañana Kosmo te prepara un briefing de tus pacientes. Entra a cada sesión con el contexto listo, sin buscar notas." icon={<Brain size={24} />} />
                        </Box>
                    </Box>
                </chakra.section>

                {/* Testimonials */}
                <chakra.section id="testimonials" position="relative" py="28" overflow="hidden">
                    <Box mx="auto" maxW="6xl" px="6">
                        <Box mb="16" textAlign="center">
                            <Badge variant="outline" mb="6" px="4" py="1.5" fontSize="sm">
                                <Flex alignItems="center" gap="1.5">
                                    <Quote size={14} color="var(--ck-colors-brand-solid)" />
                                    Testimonios
                                </Flex>
                            </Badge>
                            <Heading as="h2" mb="5" fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }} fontWeight="extrabold" letterSpacing="tight">
                                Lo que dicen{' '}
                                <Text as="span" className="gradient-text-animated">nuestros usuarios</Text>
                            </Heading>
                            <Text mx="auto" maxW="2xl" fontSize="lg" color="fg.muted" lineHeight="relaxed">
                                Profesionales de servicios que ya gestionan su consulta sin perder contexto.
                            </Text>
                        </Box>

                        <Box display="grid" gap="6" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}>
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
                        </Box>
                    </Box>
                </chakra.section>

                {/* Pricing */}
                <chakra.section id="pricing" position="relative" borderTopWidth="1px" borderBottomWidth="1px">
                    <Box position="relative" mx="auto" maxW="6xl" px="6" py="28">
                        <Box mb="20" textAlign="center">
                            <Badge variant="outline" mb="6" px="4" py="1.5" fontSize="sm">
                                <Flex alignItems="center" gap="1.5">
                                    <Star size={14} color="var(--ck-colors-brand-solid)" />
                                    Precios
                                </Flex>
                            </Badge>
                            <Heading as="h2" mb="5" fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }} fontWeight="extrabold" letterSpacing="tight">
                                Elige tu{' '}
                                <Text as="span" className="gradient-text-animated">plan ideal</Text>
                            </Heading>
                            <Text mx="auto" maxW="2xl" fontSize="lg" color="fg.muted" lineHeight="relaxed">
                                Empieza gratis con un paciente y escala cuando tu consulta crezca.
                            </Text>
                        </Box>

                        <Box display="grid" gap="8" gridTemplateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} alignItems="flex-start">
                            {/* Free */}
                            <Card display="flex" flexDirection="column" overflow="hidden" transition="all 0.5s" _hover={{ transform: 'translateY(-12px)', boxShadow: '2xl' }}>
                                <CardHeader>
                                    <Flex mb="4" h="14" w="14" borderRadius="2xl" bg="bg.muted" alignItems="center" justifyContent="center">
                                        <Icon as={LayoutDashboard} boxSize="7" color="fg.muted" />
                                    </Flex>
                                    <CardTitle>Gratis</CardTitle>
                                    <CardDescription>Para empezar a conocer la herramienta</CardDescription>
                                    <Box pt="6" pb="2">
                                        <Text as="span" fontSize="6xl" fontWeight="bold">0 €</Text>
                                        <Text as="span" color="fg.muted" ml="2" fontSize="lg">/ mes</Text>
                                    </Box>
                                    <Text fontSize="sm" color="fg.muted">Para siempre, sin límites de tiempo</Text>
                                </CardHeader>
                                <CardContent>
                                    <Stack gap="8" flex="1" justifyContent="space-between">
                                        <Stack as="ul" gap="4" fontSize="sm">
                                            <PricingFeature text="1 paciente activo" />
                                            <PricingFeature text="Notas de sesión ilimitadas" />
                                            <PricingFeature text="Control de pagos básico" />
                                            <PricingFeature text="Panel diario" />
                                        </Stack>
                                        {canRegister && (
                                            <Button variant="outline" size="lg" w="full" asChild>
                                                <Link href={register()}>
                                                    <Flex alignItems="center" gap="2" justifyContent="center">
                                                        Empezar gratis
                                                        <Icon as={ArrowRight} boxSize="4" />
                                                    </Flex>
                                                </Link>
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Premium Mensual - Featured */}
                            <Card borderWidth="2px" borderColor="brand.solid" boxShadow="2xl" transform={{ lg: 'scale(1.05)' }} position="relative" zIndex="10">
                                <CardHeader>
                                    <Flex mb="4" h="14" w="14" borderRadius="2xl" bg="brand.solid" alignItems="center" justifyContent="center" boxShadow="xl">
                                        <Icon as={Star} boxSize="7" color="brand.contrast" />
                                    </Flex>
                                    <CardTitle>Solo Mensual</CardTitle>
                                    <CardDescription>Consulta completa, sin ataduras</CardDescription>
                                    <Box pt="6" pb="2">
                                        <Text as="span" fontSize="6xl" fontWeight="bold">11,99 €</Text>
                                        <Text as="span" color="fg.muted" ml="2" fontSize="lg">/ mes</Text>
                                    </Box>
                                    <Text fontSize="sm" color="brand.solid" fontWeight="medium">Cancela cuando quieras</Text>
                                </CardHeader>
                                <CardContent>
                                    <Stack gap="8" flex="1" justifyContent="space-between">
                                        <Stack as="ul" gap="4" fontSize="sm">
                                            <PricingFeature text="Pacientes ilimitados" highlight />
                                            <PricingFeature text="Sesiones pre y post ilimitadas" highlight />
                                            <PricingFeature text="Notas y acuerdos ilimitados" />
                                            <PricingFeature text="Documentos por paciente" />
                                            <PricingFeature text="Consentimientos RGPD digitales" highlight />
                                            <PricingFeature text="Kosmo IA — briefings y chat" highlight />
                                            <PricingFeature text="Facturación consolidada" />
                                        </Stack>
                                        {canRegister && (
                                            <Button size="lg" w="full" asChild className="glow-primary">
                                                <Link href={register()}>
                                                    <Flex alignItems="center" gap="2" justifyContent="center">
                                                        Empezar ahora
                                                        <Icon as={Sparkles} boxSize="5" />
                                                    </Flex>
                                                </Link>
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Premium Anual */}
                            <Card display="flex" flexDirection="column" overflow="hidden" transition="all 0.5s" _hover={{ transform: 'translateY(-12px)', boxShadow: '2xl' }} position="relative">
                                <CardHeader>
                                    <Badge variant="secondary" position="absolute" right="4" top="4" gap="1" py="1">
                                        <Flex alignItems="center" gap="1">
                                            <Zap size={14} />
                                            Ahorra 17%
                                        </Flex>
                                    </Badge>
                                    <Flex mb="4" h="14" w="14" borderRadius="2xl" bg="bg.muted" alignItems="center" justifyContent="center">
                                        <Icon as={Shield} boxSize="7" color="fg.muted" />
                                    </Flex>
                                    <CardTitle>Solo Anual</CardTitle>
                                    <CardDescription>La opción más inteligente</CardDescription>
                                    <Box pt="6" pb="2">
                                        <Text as="span" fontSize="6xl" fontWeight="bold">119 €</Text>
                                        <Text as="span" color="fg.muted" ml="2" fontSize="lg">/ año</Text>
                                    </Box>
                                    <Text fontSize="sm" color="brand.solid" fontWeight="semibold">
                                        ≈ 9,92 €/mes — Ahorro de 24,88 €
                                    </Text>
                                </CardHeader>
                                <CardContent>
                                    <Stack gap="8" flex="1" justifyContent="space-between">
                                        <Stack as="ul" gap="4" fontSize="sm">
                                            <PricingFeature text="Todo lo de Solo Mensual" highlight />
                                            <PricingFeature text="Facturación anual con descuento" />
                                            <PricingFeature text="Soporte prioritario" highlight />
                                            <PricingFeature text="Acceso anticipado a novedades" />
                                        </Stack>
                                        {canRegister && (
                                            <Button variant="outline" size="lg" w="full" asChild>
                                                <Link href={register()}>
                                                    <Flex alignItems="center" gap="2" justifyContent="center">
                                                        Empezar ahora
                                                        <Icon as={ArrowRight} boxSize="4" />
                                                    </Flex>
                                                </Link>
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Box>

                        <Text mt="12" textAlign="center" fontSize="sm" color="fg.muted">
                            Todos los planes incluyen soporte por email y actualizaciones gratuitas.{' '}
                            <Text as="span" color="brand.solid" fontWeight="medium">Sin sorpresas.</Text>
                        </Text>
                    </Box>
                </chakra.section>

                {/* Final CTA */}
                <chakra.section position="relative" overflow="hidden">
                    <Box position="relative" mx="auto" maxW="4xl" px="6" py="32" textAlign="center">
                        <Flex
                            display="inline-flex"
                            alignItems="center"
                            gap="2"
                            borderRadius="full"
                            borderWidth="1px"
                            borderColor="brand.muted"
                            bg="brand.muted"
                            px="5"
                            py="2"
                            fontSize="sm"
                            fontWeight="medium"
                            color="brand.solid"
                            mb="8"
                        >
                            <Leaf size={14} />
                            ¿Listo para organizar tu consulta?
                        </Flex>
                        <Heading as="h2" mb="6" fontSize={{ base: '4xl', sm: '5xl', lg: '6xl' }} fontWeight="extrabold" letterSpacing="tight">
                            Gestiona tu consulta{' '}
                            <Box as="br" display={{ base: 'none', sm: 'block' }} />
                            <Text as="span" className="gradient-text-animated">como un profesional</Text>
                        </Heading>
                        <Text mx="auto" mb="12" maxW="xl" fontSize="lg" color="fg.muted" lineHeight="relaxed">
                            Únete a profesionales que ya centralizan su consulta en ClientKosmos.
                            El plan gratuito es para siempre y no requiere tarjeta.
                        </Text>
                        <Flex direction={{ base: 'column', sm: 'row' }} alignItems="center" justifyContent="center" gap="4">
                            {canRegister && (
                                <Button size="lg" asChild className="glow-primary">
                                    <Link href={register()}>
                                        <Flex alignItems="center" gap="3">
                                            <span>Crear cuenta gratuita</span>
                                            <Icon as={ArrowRight} boxSize="5" />
                                        </Flex>
                                    </Link>
                                </Button>
                            )}
                            <Button size="lg" variant="outline" asChild>
                                <Link href={login()}>Ya tengo cuenta</Link>
                            </Button>
                        </Flex>

                        <Flex mt="12" flexWrap="wrap" alignItems="center" justifyContent="center" gap="6" fontSize="sm" color="fg.muted">
                            <Flex as="span" alignItems="center" gap="2" bg="bg.muted" borderRadius="full" px="4" py="2">
                                <Icon as={CheckCircle2} boxSize="4" color="brand.solid" />
                                Sin tarjeta de crédito
                            </Flex>
                            <Flex as="span" alignItems="center" gap="2" bg="bg.muted" borderRadius="full" px="4" py="2">
                                <Icon as={Lock} boxSize="4" color="brand.solid" />
                                RGPD integrado
                            </Flex>
                            <Flex as="span" alignItems="center" gap="2" bg="bg.muted" borderRadius="full" px="4" py="2">
                                <Icon as={Zap} boxSize="4" color="brand.solid" />
                                Activo en minutos
                            </Flex>
                        </Flex>
                    </Box>
                </chakra.section>

                {/* Footer */}
                <chakra.footer borderTopWidth="1px">
                    <Box mx="auto" maxW="6xl" px="6" py="16">
                        <Box display="grid" gap="10" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} mb="12">
                            <Box gridColumn={{ lg: 'span 2' }}>
                                <Flex alignItems="center" gap="3" mb="4">
                                    <chakra.img src={logo} alt="ClientKosmos" h="10" w="auto" objectFit="contain" />
                                    <Text fontSize="2xl" fontWeight="bold" className="gradient-text-animated">
                                        ClientKosmos
                                    </Text>
                                </Flex>
                                <Text fontSize="sm" color="fg.muted" maxW="xs" lineHeight="relaxed">
                                    Plataforma de gestión de consulta para profesionales autónomos.
                                    Fichas de pacientes, sesiones, pagos, RGPD y Kosmo IA en un solo lugar.
                                </Text>
                            </Box>

                            <Box>
                                <Heading as="h4" fontSize="md" fontWeight="semibold" mb="4">Producto</Heading>
                                <Stack as="ul" gap="3" fontSize="sm" color="fg.muted">
                                    <li><chakra.a href="#features" transition="colors" _hover={{ color: 'brand.solid' }}>Funcionalidades</chakra.a></li>
                                    <li><chakra.a href="#how-it-works" transition="colors" _hover={{ color: 'brand.solid' }}>Cómo funciona</chakra.a></li>
                                    <li><chakra.a href="#pricing" transition="colors" _hover={{ color: 'brand.solid' }}>Precios</chakra.a></li>
                                    <li><chakra.a href="#testimonials" transition="colors" _hover={{ color: 'brand.solid' }}>Testimonios</chakra.a></li>
                                </Stack>
                            </Box>

                            <Box>
                                <Heading as="h4" fontSize="md" fontWeight="semibold" mb="4">Empezar</Heading>
                                <Stack as="ul" gap="3" fontSize="sm" color="fg.muted">
                                    <li><chakra.span _hover={{ color: 'brand.solid' }} transition="colors"><Link href={register()}>Crear cuenta</Link></chakra.span></li>
                                    <li><chakra.span _hover={{ color: 'brand.solid' }} transition="colors"><Link href={login()}>Iniciar sesión</Link></chakra.span></li>
                                </Stack>
                            </Box>
                        </Box>

                        <Separator mb="8" />

                        <Flex direction={{ base: 'column', sm: 'row' }} alignItems="center" justifyContent={{ sm: 'space-between' }} gap="4" fontSize="sm" color="fg.muted">
                            <Text>© {new Date().getFullYear()} ClientKosmos · Proyecto Intermodular 2º DAM</Text>
                            <Flex alignItems="center" gap="1.5">
                                Hecho con <Text as="span" color="red.500">❤</Text> para profesionales organizados
                            </Flex>
                        </Flex>
                    </Box>
                </chakra.footer>
            </Box>
        </>
    );
}

/* Subcomponentes locales */

function BentoCard({
    icon,
    title,
    description,
    badge,
    colSpan,
    rowSpan,
    featured = false,
    isPremium = false,
    delay = 0,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge: string;
    colSpan?: { md?: number; lg?: number };
    rowSpan?: { lg?: number };
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
        <Box
            ref={cardRef}
            gridColumn={colSpan ? { md: colSpan.md ? `span ${colSpan.md}` : undefined, lg: colSpan.lg ? `span ${colSpan.lg}` : undefined } : undefined}
            gridRow={rowSpan ? { lg: rowSpan.lg ? `span ${rowSpan.lg}` : undefined } : undefined}
            transition="all 0.7s ease-out"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0)' : 'translateY(32px)'}
            style={{ transitionDelay: `${delay * 100}ms` }}
        >
            <Card
                position="relative"
                overflow="hidden"
                transition="all 0.5s"
                h="full"
                borderWidth={featured ? '2px' : '1px'}
                borderColor={featured ? 'brand.muted' : 'border'}
                _hover={{
                    transform: 'translateY(-8px)',
                    boxShadow: '2xl',
                    borderColor: 'brand.solid',
                }}
            >
                <CardContent style={{ padding: featured ? '2rem' : '1.5rem', height: '100%' }}>
                    <Flex alignItems="flex-start" justifyContent="space-between" mb="5">
                        <Box
                            borderRadius="2xl"
                            bg="brand.muted"
                            p="3.5"
                            color="brand.solid"
                            transition="all 0.5s"
                        >
                            {icon}
                        </Box>
                        <Badge
                            variant={isPremium ? 'default' : 'secondary'}
                            colorScheme={isPremium ? 'brand' : 'gray'}
                            textTransform="uppercase"
                            fontSize="11px"
                            letterSpacing="wide"
                            fontWeight="semibold"
                        >
                            {isPremium && (
                                <Flex alignItems="center" gap="1">
                                    <Star size={12} />
                                    {badge}
                                </Flex>
                            )}
                            {!isPremium && badge}
                        </Badge>
                    </Flex>
                    <Heading as="h3" fontWeight="bold" mb="2.5" fontSize={featured ? 'xl' : 'lg'} transition="colors" _groupHover={{ color: 'brand.solid' }}>
                        {title}
                    </Heading>
                    <Text fontSize="sm" color="fg.muted" lineHeight="relaxed">{description}</Text>
                    {children}
                </CardContent>
            </Card>
        </Box>
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
        <Card
            position="relative"
            overflow="hidden"
            transition="all 0.5s"
            borderWidth={featured ? '2px' : '1px'}
            borderColor={featured ? 'brand.muted' : 'border'}
            transform={featured ? { md: 'scale(1.05)' } : undefined}
            zIndex={featured ? 10 : undefined}
            _hover={{ transform: 'translateY(-8px)', boxShadow: 'xl' }}
        >
            <CardContent style={{ padding: '1.5rem' }}>
                <Flex gap="1" mb="4">
                    {Array.from({ length: rating }).map((_, i) => (
                        <Icon key={i} as={Star} boxSize="4" color="yellow.500" fill="yellow.500" />
                    ))}
                </Flex>
                <Icon as={Quote} boxSize="8" color="brand.muted" mb="2" />
                <Text fontSize="sm" lineHeight="relaxed" mb="6" color="fg.muted">
                    "{quote}"
                </Text>
                <Flex alignItems="center" gap="3">
                    <Flex h="10" w="10" borderRadius="full" bg="brand.solid" alignItems="center" justifyContent="center" fontSize="sm" fontWeight="bold" color="brand.contrast" boxShadow="lg">
                        {avatar}
                    </Flex>
                    <Box>
                        <Text fontWeight="semibold" fontSize="sm">{author}</Text>
                        <Text fontSize="xs" color="fg.muted">{role}</Text>
                    </Box>
                </Flex>
            </CardContent>
        </Card>
    );
}

function PricingFeature({ text, highlight = false }: { text: string; highlight?: boolean }) {
    return (
        <Flex as="li" alignItems="center" gap="3">
            <Box flexShrink={0} borderRadius="full" p="0.5" bg={highlight ? 'brand.muted' : 'transparent'}>
                <Icon as={CheckCircle2} boxSize="4" color={highlight ? 'brand.solid' : 'brand.solid/70'} />
            </Box>
            <Text as="span" fontWeight={highlight ? 'medium' : 'normal'}>{text}</Text>
        </Flex>
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
        <Box position="relative">
            <Card
                position="relative"
                overflow="hidden"
                transition="all 0.5s"
                borderWidth="2px"
                borderColor="transparent"
                _hover={{ transform: 'translateY(-8px)', boxShadow: '2xl', borderColor: 'brand.muted' }}
            >
                <CardContent style={{ paddingTop: '2rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    <Flex mb="6" alignItems="center" gap="4">
                        <Flex
                            h="14"
                            w="14"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius="full"
                            bg="brand.solid"
                            color="brand.contrast"
                            fontWeight="bold"
                            fontSize="xl"
                            boxShadow="xl"
                        >
                            {number}
                        </Flex>
                        <Box borderRadius="xl" bg="brand.muted" p="3" color="brand.solid">
                            {icon}
                        </Box>
                    </Flex>
                    <Heading as="h3" mb="3" fontSize="xl" fontWeight="bold">
                        {title}
                    </Heading>
                    <Text fontSize="sm" color="fg.muted" lineHeight="relaxed">
                        {description}
                    </Text>
                </CardContent>
            </Card>
        </Box>
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
    const cfg = {
        done: {
            dotBg: 'green.500',
            wrapperBg: 'bg.muted',
            wrapperBorder: 'border',
            icon: <Icon as={CheckCircle2} boxSize="4" color="green.500" />,
            strikethrough: true,
        },
        pending: {
            dotBg: 'brand.solid',
            wrapperBg: 'brand.muted',
            wrapperBorder: 'brand.muted',
            icon: <Icon as={ArrowRight} boxSize="4" color="brand.solid" />,
            strikethrough: false,
        },
        alert: {
            dotBg: 'yellow.500',
            wrapperBg: 'yellow.subtle',
            wrapperBorder: 'yellow.muted',
            icon: <Icon as={AlertCircle} boxSize="4" color="yellow.500" />,
            strikethrough: false,
        },
    }[status];

    return (
        <Flex alignItems="center" gap="3" borderRadius="xl" borderWidth="2px" borderColor={cfg.wrapperBorder} bg={cfg.wrapperBg} p="3" transition="all 0.3s">
            <Box h="2.5" w="2.5" borderRadius="full" flexShrink={0} bg={cfg.dotBg} animation={animate ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : undefined} />
            <Text as="span" flex="1" fontSize="sm" textDecoration={cfg.strikethrough ? 'line-through' : undefined} color={cfg.strikethrough ? 'fg.muted' : undefined}>
                {text}
            </Text>
            {cfg.icon}
        </Flex>
    );
}
