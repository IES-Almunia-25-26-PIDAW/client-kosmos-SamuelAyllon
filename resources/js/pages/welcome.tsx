import {
    Avatar,
    Box,
    Flex,
    Heading,
    HStack,
    Icon,
    SimpleGrid,
    Stack,
    Stat,
    Text,
    Timeline,
    chakra,
    type BoxProps,
    type TextProps,
} from '@chakra-ui/react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Brain,
    CalendarClock,
    CheckCircle2,
    CreditCard,
    FileText,
    LayoutDashboard,
    Leaf,
    Lock,
    Menu,
    NotebookPen,
    Play,
    Quote,
    Rocket,
    Shield,
    Sparkles,
    Star,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import logo from '@/assets/logo.svg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import { login, register } from '@/routes';
import type { Auth } from '@/types';

const NAV_ITEMS = [
    { href: '#features', label: 'Funcionalidades' },
    { href: '#how-it-works', label: 'Cómo funciona' },
    { href: '#testimonials', label: 'Testimonios' },
    { href: '#pricing', label: 'Precios' },
];

const GLOW_PRIMARY_SHADOW = '0 0 40px -10px var(--color-primary)';

function GradientText(props: TextProps) {
    return (
        <Text
            as="span"
            bgGradient="linear(90deg, var(--color-primary) 0%, var(--primary-muted) 25%, var(--color-primary) 50%, var(--primary-muted) 75%, var(--color-primary) 100%)"
            bgSize="200% auto"
            bgClip="text"
            color="transparent"
            animation="gradient-shift 3s linear infinite"
            {...props}
        />
    );
}

/** Centered page section container — maxW 6xl with responsive horizontal padding */
function PageCtn(props: BoxProps) {
    return <Box mx="auto" maxW="6xl" px={{ base: '4', md: '6' }} {...props} />;
}

/** Shared badge + heading + description block used in every section */
function SectionHeader({
    badge,
    badgeIcon,
    heading,
    description,
    mb = '20',
}: {
    badge: string;
    badgeIcon: ReactNode;
    heading: ReactNode;
    description: string;
    mb?: string;
}) {
    return (
        <Box mb={mb} textAlign="center">
            <Badge variant="outline" mb="6" px="4" py="1.5" fontSize="sm">
                <HStack gap="1.5">
                    {badgeIcon}
                    {badge}
                </HStack>
            </Badge>
            <Heading
                as="h2"
                mb="5"
                fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
                fontWeight="extrabold"
                letterSpacing="tight"
            >
                {heading}
            </Heading>
            <Text mx="auto" maxW="2xl" fontSize="lg" color="fg.muted" lineHeight="relaxed">
                {description}
            </Text>
        </Box>
    );
}

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="ClientKosmos — Gestión de consulta para profesionales de servicios" />

            <Box minH="100vh" bg="bg" color="fg" overflowX="hidden">
                {/* Navbar */}
                <chakra.header
                    position="sticky"
                    top="0"
                    zIndex="50"
                    borderBottomWidth="1px"
                    bg="bg/60"
                    backdropFilter="blur(12px)"
                >
                    <Flex
                        mx="auto"
                        h="16"
                        maxW="6xl"
                        alignItems="center"
                        justifyContent="space-between"
                        px={{ base: '4', md: '6' }}
                    >
                        <HStack gap="2" cursor="pointer" role="group">
                            <chakra.img
                                src={logo}
                                alt="ClientKosmos"
                                h="8"
                                w="auto"
                                objectFit="contain"
                                transition="transform 0.5s"
                                _groupHover={{ transform: 'scale(1.1) rotate(6deg)' }}
                            />
                            <GradientText fontSize="xl" fontWeight="bold" letterSpacing="tight">
                                ClientKosmos
                            </GradientText>
                        </HStack>

                        <chakra.nav
                            display={{ base: 'none', md: 'flex' }}
                            alignItems="center"
                            gap="8"
                            fontSize="sm"
                            fontWeight="medium"
                        >
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

                        <HStack gap="3">
                            {auth.user ? (
                                <Button asChild boxShadow={GLOW_PRIMARY_SHADOW}>
                                    <Link href={dashboard()}>
                                        <HStack gap="2">
                                            Ir al dashboard
                                            <Icon as={ArrowRight} boxSize="4" />
                                        </HStack>
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        asChild
                                        display={{ base: 'none', sm: 'inline-flex' }}
                                    >
                                        <Link href={login()}>Iniciar sesión</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button
                                            asChild
                                            boxShadow={GLOW_PRIMARY_SHADOW}
                                            display={{ base: 'none', sm: 'inline-flex' }}
                                        >
                                            <Link href={register()}>
                                                <HStack gap="2">
                                                    <span>Empezar ya</span>
                                                    <Icon as={Sparkles} boxSize="4" />
                                                </HStack>
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
                        </HStack>
                    </Flex>

                    {isMobileMenuOpen && (
                        <Box
                            display={{ md: 'none' }}
                            borderTopWidth="1px"
                            bg="bg/95"
                            backdropFilter="blur(12px)"
                        >
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
                <chakra.section
                    position="relative"
                    mx="auto"
                    maxW="6xl"
                    px={{ base: '4', md: '6' }}
                    py={{ base: '16', lg: '28' }}
                    overflow="hidden"
                >
                    <Box position="absolute" inset="0" zIndex="-1" overflow="hidden">
                        <Box
                            position="absolute"
                            top="20"
                            right="1/4"
                            h="96"
                            w="96"
                            borderRadius="full"
                            bg="brand.muted"
                            filter="blur(60px)"
                            animation="orb-float-1 12s ease-in-out infinite"
                        />
                        <Box
                            position="absolute"
                            bottom="20"
                            left="1/4"
                            h="80"
                            w="80"
                            borderRadius="full"
                            bg="brand.muted"
                            filter="blur(60px)"
                            animation="orb-float-2 15s ease-in-out infinite"
                        />
                    </Box>

                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: '12', lg: '16' }} alignItems="center">
                        <Box
                            textAlign={{ base: 'center', lg: 'left' }}
                            animation="fade-in-left 300ms ease-out forwards"
                        >
                            <HStack
                                display="inline-flex"
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
                                gap="2"
                            >
                                <Box position="relative" h="2" w="2">
                                    <Box
                                        as="span"
                                        position="absolute"
                                        h="full"
                                        w="full"
                                        borderRadius="full"
                                        bg="brand.solid"
                                        opacity={0.75}
                                        animation="ping-slow 1s cubic-bezier(0, 0, 0.2, 1) infinite"
                                    />
                                    <Box
                                        as="span"
                                        position="relative"
                                        h="2"
                                        w="2"
                                        borderRadius="full"
                                        bg="brand.solid"
                                    />
                                </Box>
                                Para psicólogos, coaches y terapeutas
                            </HStack>

                            <Heading
                                as="h1"
                                mb="6"
                                fontSize={{ base: '4xl', sm: '5xl', lg: '6xl', xl: '7xl' }}
                                fontWeight="extrabold"
                                letterSpacing="tight"
                                lineHeight="1.08"
                            >
                                <Box as="span" display="block">
                                    Tu consulta organizada,
                                </Box>
                                <Box as="span" position="relative" display="inline-block">
                                    <GradientText>cada paciente atendido</GradientText>
                                </Box>
                            </Heading>

                            <Text
                                mb="10"
                                maxW="xl"
                                fontSize={{ base: 'lg', lg: 'xl' }}
                                color="fg.muted"
                                lineHeight="relaxed"
                            >
                                ClientKosmos centraliza fichas de pacientes, sesiones, pagos y cumplimiento RGPD en un
                                solo lugar. Con{' '}
                                <Text as="span" color="brand.solid" fontWeight="semibold">
                                    Kosmo IA
                                </Text>{' '}
                                y un{' '}
                                <Text as="span" color="brand.solid" fontWeight="semibold">
                                    panel diario
                                </Text>
                                , entras a cada sesión con el contexto listo.
                            </Text>

                            <Flex
                                direction={{ base: 'column', sm: 'row' }}
                                alignItems="center"
                                justifyContent={{ base: 'center', lg: 'flex-start' }}
                                gap="4"
                            >
                                {canRegister && (
                                    <Button
                                        size="lg"
                                        asChild
                                        boxShadow={GLOW_PRIMARY_SHADOW}
                                        w={{ base: 'full', sm: 'auto' }}
                                    >
                                        <Link href={register()}>
                                            <HStack gap="3">
                                                <span>Comenzar gratis</span>
                                                <Icon as={ArrowRight} boxSize="5" />
                                            </HStack>
                                        </Link>
                                    </Button>
                                )}
                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    w={{ base: 'full', sm: 'auto' }}
                                >
                                    <Link href="#how-it-works">
                                        <HStack gap="3">
                                            <Icon as={Play} boxSize="4" color="brand.solid" />
                                            Ver cómo funciona
                                        </HStack>
                                    </Link>
                                </Button>
                            </Flex>

                            <Flex
                                mt="10"
                                flexWrap="wrap"
                                alignItems="center"
                                justifyContent={{ base: 'center', lg: 'flex-start' }}
                                gap="6"
                                fontSize="sm"
                                color="fg.muted"
                            >
                                {[
                                    { icon: CheckCircle2, text: 'Sin tarjeta de crédito' },
                                    { icon: Lock, text: 'RGPD integrado' },
                                    { icon: Shield, text: 'Datos protegidos' },
                                ].map((item, i) => (
                                    <HStack
                                        key={i}
                                        as="span"
                                        bg="bg.muted"
                                        borderRadius="full"
                                        px="4"
                                        py="2"
                                        gap="2"
                                    >
                                        <Icon as={item.icon} boxSize="4" color="brand.solid" />
                                        {item.text}
                                    </HStack>
                                ))}
                            </Flex>
                        </Box>

                        {/* Hero visual */}
                        <Box
                            position="relative"
                            opacity={0}
                            animation="fade-in-right 300ms ease-out 300ms forwards"
                        >
                            <Box position="relative" mx="auto" maxW={{ base: 'md', lg: 'none' }}>
                                <Card borderWidth="2px" borderColor="brand.muted" boxShadow="2xl">
                                    <CardHeader>
                                        <Flex alignItems="center" justifyContent="space-between">
                                            <HStack gap="3">
                                                <Flex
                                                    h="12"
                                                    w="12"
                                                    borderRadius="xl"
                                                    bg="brand.solid"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    boxShadow="lg"
                                                >
                                                    <Icon
                                                        as={LayoutDashboard}
                                                        boxSize="6"
                                                        color="brand.contrast"
                                                    />
                                                </Flex>
                                                <Box>
                                                    <Text fontSize="md" fontWeight="semibold">
                                                        Panel de hoy
                                                    </Text>
                                                    <Text fontSize="xs" color="fg.muted">
                                                        3 pacientes · 2 sesiones hoy
                                                    </Text>
                                                </Box>
                                            </HStack>
                                            <Badge>
                                                <HStack gap="1">
                                                    <Zap size={12} />
                                                    Al día
                                                </HStack>
                                            </Badge>
                                        </Flex>
                                        <Box mt="4" h="2" bg="bg.muted" borderRadius="full" overflow="hidden">
                                            <Box h="full" w="75%" bg="brand.solid" borderRadius="full" />
                                        </Box>
                                    </CardHeader>
                                    <CardContent>
                                        <Stack gap="3">
                                            <SessionPreviewItem status="done" text="Ana García — Sesión TCC · 10:00" />
                                            <SessionPreviewItem
                                                status="done"
                                                text="Carlos R. — Pago recibido · 70 €"
                                            />
                                            <SessionPreviewItem
                                                status="pending"
                                                text="Laura M. — Sesión · 17:00"
                                                animate
                                            />
                                            <HStack
                                                p="3"
                                                borderRadius="xl"
                                                bg="brand.muted"
                                                borderWidth="1px"
                                                borderColor="brand.muted"
                                                gap="3"
                                                alignItems="flex-start"
                                            >
                                                <Flex
                                                    h="8"
                                                    w="8"
                                                    borderRadius="lg"
                                                    bg="brand.muted"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexShrink={0}
                                                >
                                                    <Icon as={Brain} boxSize="4" color="brand.solid" />
                                                </Flex>
                                                <Text fontSize="sm" color="fg.muted" flex="1">
                                                    <Text as="span" color="brand.solid" fontWeight="medium">
                                                        Kosmo:
                                                    </Text>{' '}
                                                    "Laura M. tiene el consentimiento RGPD pendiente de firma"
                                                </Text>
                                            </HStack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    </SimpleGrid>
                </chakra.section>

                {/* Trust strip */}
                <chakra.section
                    position="relative"
                    borderTopWidth="1px"
                    borderBottomWidth="1px"
                    borderColor="border.subtle"
                    bg="bg.subtle"
                    py={{ base: '10', md: '12' }}
                >
                    <PageCtn>
                        <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: '8', md: '6' }} alignItems="center">
                            <TrustStat icon={Users} value="200+" label="Profesionales activos" />
                            <TrustStat icon={CalendarClock} value="15k+" label="Sesiones gestionadas" />
                            <TrustStat icon={Shield} value="100%" label="RGPD por diseño" />
                            <TrustStat icon={Brain} value="24/7" label="Asistente Kosmo IA" />
                        </SimpleGrid>
                    </PageCtn>
                </chakra.section>

                {/* Features Bento */}
                <chakra.section id="features" position="relative" py="28" overflow="hidden">
                    <PageCtn>
                        <SectionHeader
                            badge="Funcionalidades"
                            badgeIcon={<Sparkles size={14} color="var(--ck-colors-brand-solid)" />}
                            heading={
                                <>
                                    Todo lo que necesita tu consulta,{' '}
                                    <GradientText>en un solo lugar</GradientText>
                                </>
                            }
                            description="Diseñado para profesionales autónomos de servicios: psicólogos, coaches, terapeutas y asesores."
                        />

                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: '5', lg: '6' }}>
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
                                        { label: 'Ana García · TCC' },
                                        { label: 'Carlos R. · Coaching' },
                                        { label: 'Laura M. · Terapia' },
                                    ].map((p, i) => (
                                        <Badge
                                            key={i}
                                            borderRadius="full"
                                            px="3"
                                            py="1.5"
                                            fontSize="xs"
                                            fontWeight="semibold"
                                        >
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
                                    <HStack gap="2.5" alignItems="flex-start">
                                        <Flex
                                            h="7"
                                            w="7"
                                            borderRadius="full"
                                            bg="brand.muted"
                                            alignItems="center"
                                            justifyContent="center"
                                            flexShrink={0}
                                        >
                                            <Icon as={Brain} boxSize="3.5" color="brand.solid" />
                                        </Flex>
                                        <Box
                                            bg="bg.muted"
                                            borderRadius="2xl"
                                            borderTopLeftRadius="sm"
                                            px="3.5"
                                            py="2.5"
                                            flex="1"
                                        >
                                            <Text fontSize="xs" lineHeight="relaxed">
                                                "Ana lleva 3 sesiones trabajando ansiedad. Última nota: progreso
                                                notable en técnicas de respiración."
                                            </Text>
                                        </Box>
                                    </HStack>
                                    <Flex gap="2.5" alignItems="flex-start" justifyContent="flex-end">
                                        <Box
                                            bg="brand.muted"
                                            borderRadius="2xl"
                                            borderTopRightRadius="sm"
                                            px="3.5"
                                            py="2.5"
                                        >
                                            <Text fontSize="xs" lineHeight="relaxed">
                                                "¿Qué trabajar hoy con Carlos?"
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <HStack gap="2.5" alignItems="flex-start">
                                        <Flex
                                            h="7"
                                            w="7"
                                            borderRadius="full"
                                            bg="brand.muted"
                                            alignItems="center"
                                            justifyContent="center"
                                            flexShrink={0}
                                        >
                                            <Icon as={Brain} boxSize="3.5" color="brand.solid" />
                                        </Flex>
                                        <Box
                                            bg="bg.muted"
                                            borderRadius="2xl"
                                            borderTopLeftRadius="sm"
                                            px="3.5"
                                            py="2.5"
                                            flex="1"
                                        >
                                            <Text fontSize="xs" lineHeight="relaxed">
                                                "Tiene pendiente revisar el acuerdo de sesiones. Sugiero abordar los
                                                objetivos del mes."
                                            </Text>
                                        </Box>
                                    </HStack>
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
                        </SimpleGrid>
                    </PageCtn>
                </chakra.section>

                {/* How it works */}
                <chakra.section
                    id="how-it-works"
                    position="relative"
                    borderTopWidth="1px"
                    borderBottomWidth="1px"
                    overflow="hidden"
                >
                    <PageCtn py="28" position="relative">
                        <SectionHeader
                            badge="Cómo funciona"
                            badgeIcon={<Rocket size={14} color="var(--ck-colors-brand-solid)" />}
                            heading={
                                <>
                                    Tu consulta lista en <GradientText>3 pasos</GradientText>
                                </>
                            }
                            description="Empezar con ClientKosmos es tan sencillo que estarás operativo hoy mismo."
                        />

                        <Box mx="auto" maxW="3xl">
                            <Timeline.Root size="lg" variant="subtle" colorPalette="brand">
                                <Timeline.Item>
                                    <Timeline.Connector>
                                        <Timeline.Separator />
                                        <Timeline.Indicator bg="brand.solid" color="brand.contrast">
                                            <Icon as={Users} boxSize="4" />
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content pb="8">
                                        <Timeline.Title fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                                            01 · Configura tu consulta
                                        </Timeline.Title>
                                        <Timeline.Description
                                            fontSize="sm"
                                            color="fg.muted"
                                            lineHeight="relaxed"
                                            mt="2"
                                        >
                                            Regístrate gratis, añade el nombre de tu consulta, especialidad y configura
                                            tu plantilla RGPD en minutos. Sin tarjeta de crédito.
                                        </Timeline.Description>
                                    </Timeline.Content>
                                </Timeline.Item>

                                <Timeline.Item>
                                    <Timeline.Connector>
                                        <Timeline.Separator />
                                        <Timeline.Indicator bg="brand.solid" color="brand.contrast">
                                            <Icon as={NotebookPen} boxSize="4" />
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content pb="8">
                                        <Timeline.Title fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                                            02 · Añade tus pacientes
                                        </Timeline.Title>
                                        <Timeline.Description
                                            fontSize="sm"
                                            color="fg.muted"
                                            lineHeight="relaxed"
                                            mt="2"
                                        >
                                            Crea fichas con historial, notas de sesión, documentos, acuerdos y pagos.
                                            Todo en el expediente de cada paciente, accesible al instante.
                                        </Timeline.Description>
                                    </Timeline.Content>
                                </Timeline.Item>

                                <Timeline.Item>
                                    <Timeline.Connector>
                                        <Timeline.Separator />
                                        <Timeline.Indicator bg="brand.solid" color="brand.contrast">
                                            <Icon as={Brain} boxSize="4" />
                                        </Timeline.Indicator>
                                    </Timeline.Connector>
                                    <Timeline.Content>
                                        <Timeline.Title fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                                            03 · Gestiona con Kosmo IA
                                        </Timeline.Title>
                                        <Timeline.Description
                                            fontSize="sm"
                                            color="fg.muted"
                                            lineHeight="relaxed"
                                            mt="2"
                                        >
                                            Cada mañana Kosmo te prepara un briefing personalizado. Entra a cada sesión
                                            con el contexto listo, sin revisar notas a mano.
                                        </Timeline.Description>
                                    </Timeline.Content>
                                </Timeline.Item>
                            </Timeline.Root>
                        </Box>
                    </PageCtn>
                </chakra.section>

                {/* Testimonials */}
                <chakra.section id="testimonials" position="relative" py="28" overflow="hidden">
                    <PageCtn>
                        <SectionHeader
                            badge="Testimonios"
                            badgeIcon={<Quote size={14} color="var(--ck-colors-brand-solid)" />}
                            heading={
                                <>
                                    Lo que dicen <GradientText>nuestros usuarios</GradientText>
                                </>
                            }
                            description="Profesionales de servicios que ya gestionan su consulta sin perder contexto."
                            mb="16"
                        />

                        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                            <TestimonialCard
                                quote="Antes mezclaba cuadernos, hojas de Excel y carpetas de email. Con ClientKosmos tengo el expediente completo de cada paciente en segundos, incluyendo los consentimientos RGPD."
                                author="María García"
                                role="Psicóloga clínica autónoma"
                                rating={5}
                            />
                            <TestimonialCard
                                quote="Kosmo IA me da un briefing cada mañana con el estado de mis pacientes. Entro a cada sesión sabiendo exactamente dónde lo dejamos, sin revisar notas a mano."
                                author="Carlos López"
                                role="Coach de vida certificado"
                                rating={5}
                                featured
                            />
                            <TestimonialCard
                                quote="El control de pagos por paciente me ha eliminado las facturas pendientes. El aviso de pago vencido me hace un recordatorio automático sin necesidad de revisar nada."
                                author="Ana Martínez"
                                role="Terapeuta y nutricionista"
                                rating={5}
                            />
                        </SimpleGrid>
                    </PageCtn>
                </chakra.section>

                {/* Pricing */}
                <chakra.section
                    id="pricing"
                    position="relative"
                    borderTopWidth="1px"
                    borderBottomWidth="1px"
                >
                    <PageCtn py="28">
                        <SectionHeader
                            badge="Precios"
                            badgeIcon={<Star size={14} color="var(--ck-colors-brand-solid)" />}
                            heading={
                                <>
                                    Elige tu <GradientText>plan ideal</GradientText>
                                </>
                            }
                            description="Empieza gratis con un paciente y escala cuando tu consulta crezca."
                        />

                        <SimpleGrid columns={{ base: 1, lg: 3 }} gap="8" alignItems="flex-start">
                            {/* Free */}
                            <Card
                                display="flex"
                                flexDirection="column"
                                overflow="hidden"
                                transition="all 0.5s"
                                _hover={{ transform: 'translateY(-12px)', boxShadow: '2xl' }}
                            >
                                <CardHeader>
                                    <Flex
                                        mb="4"
                                        h="14"
                                        w="14"
                                        borderRadius="2xl"
                                        bg="bg.muted"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Icon as={LayoutDashboard} boxSize="7" color="fg.muted" />
                                    </Flex>
                                    <CardTitle>Gratis</CardTitle>
                                    <CardDescription>Para empezar a conocer la herramienta</CardDescription>
                                    <Box pt="6" pb="2">
                                        <Text as="span" fontSize="6xl" fontWeight="bold">
                                            0 €
                                        </Text>
                                        <Text as="span" color="fg.muted" ml="2" fontSize="lg">
                                            / mes
                                        </Text>
                                    </Box>
                                    <Text fontSize="sm" color="fg.muted">
                                        Para siempre, sin límites de tiempo
                                    </Text>
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
                                                    <HStack gap="2" justifyContent="center">
                                                        Empezar gratis
                                                        <Icon as={ArrowRight} boxSize="4" />
                                                    </HStack>
                                                </Link>
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Premium Mensual — Featured */}
                            <Card
                                borderWidth="2px"
                                borderColor="brand.solid"
                                boxShadow="2xl"
                                transform={{ lg: 'scale(1.05)' }}
                                position="relative"
                                zIndex="10"
                                overflow="visible"
                            >
                                <Box
                                    position="absolute"
                                    top="-3"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    bg="brand.solid"
                                    color="brand.contrast"
                                    px="4"
                                    py="1"
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    letterSpacing="widest"
                                    textTransform="uppercase"
                                    boxShadow="md"
                                    zIndex={1}
                                    whiteSpace="nowrap"
                                >
                                    <HStack gap="1.5">
                                        <Sparkles size={12} />
                                        Más popular
                                    </HStack>
                                </Box>
                                <CardHeader>
                                    <Flex
                                        mb="4"
                                        h="14"
                                        w="14"
                                        borderRadius="2xl"
                                        bg="brand.solid"
                                        alignItems="center"
                                        justifyContent="center"
                                        boxShadow="xl"
                                    >
                                        <Icon as={Star} boxSize="7" color="brand.contrast" />
                                    </Flex>
                                    <CardTitle>Solo Mensual</CardTitle>
                                    <CardDescription>Consulta completa, sin ataduras</CardDescription>
                                    <Box pt="6" pb="2">
                                        <Text as="span" fontSize="6xl" fontWeight="bold">
                                            11,99 €
                                        </Text>
                                        <Text as="span" color="fg.muted" ml="2" fontSize="lg">
                                            / mes
                                        </Text>
                                    </Box>
                                    <Text fontSize="sm" color="brand.solid" fontWeight="medium">
                                        Cancela cuando quieras
                                    </Text>
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
                                            <Button size="lg" w="full" asChild boxShadow={GLOW_PRIMARY_SHADOW}>
                                                <Link href={register()}>
                                                    <HStack gap="2" justifyContent="center">
                                                        Empezar ahora
                                                        <Icon as={Sparkles} boxSize="5" />
                                                    </HStack>
                                                </Link>
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Premium Anual */}
                            <Card
                                display="flex"
                                flexDirection="column"
                                overflow="hidden"
                                transition="all 0.5s"
                                _hover={{ transform: 'translateY(-12px)', boxShadow: '2xl' }}
                                position="relative"
                            >
                                <CardHeader>
                                    <Badge
                                        variant="secondary"
                                        position="absolute"
                                        right="4"
                                        top="4"
                                        py="1"
                                    >
                                        <HStack gap="1">
                                            <Zap size={14} />
                                            Ahorra 17%
                                        </HStack>
                                    </Badge>
                                    <Flex
                                        mb="4"
                                        h="14"
                                        w="14"
                                        borderRadius="2xl"
                                        bg="bg.muted"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Icon as={Shield} boxSize="7" color="fg.muted" />
                                    </Flex>
                                    <CardTitle>Solo Anual</CardTitle>
                                    <CardDescription>La opción más inteligente</CardDescription>
                                    <Box pt="6" pb="2">
                                        <Text as="span" fontSize="6xl" fontWeight="bold">
                                            119 €
                                        </Text>
                                        <Text as="span" color="fg.muted" ml="2" fontSize="lg">
                                            / año
                                        </Text>
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
                                                    <HStack gap="2" justifyContent="center">
                                                        Empezar ahora
                                                        <Icon as={ArrowRight} boxSize="4" />
                                                    </HStack>
                                                </Link>
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </SimpleGrid>

                        <Text mt="12" textAlign="center" fontSize="sm" color="fg.muted">
                            Todos los planes incluyen soporte por email y actualizaciones gratuitas.{' '}
                            <Text as="span" color="brand.solid" fontWeight="medium">
                                Sin sorpresas.
                            </Text>
                        </Text>
                    </PageCtn>
                </chakra.section>

                {/* Final CTA */}
                <chakra.section position="relative" overflow="hidden">
                    <Box mx="auto" maxW="4xl" px={{ base: '4', md: '6' }} py="32" textAlign="center">
                        <HStack
                            display="inline-flex"
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
                            gap="2"
                        >
                            <Leaf size={14} />
                            ¿Listo para organizar tu consulta?
                        </HStack>
                        <Heading
                            as="h2"
                            mb="6"
                            fontSize={{ base: '4xl', sm: '5xl', lg: '6xl' }}
                            fontWeight="extrabold"
                            letterSpacing="tight"
                        >
                            Gestiona tu consulta{' '}
                            <Box as="br" display={{ base: 'none', sm: 'block' }} />
                            <GradientText>como un profesional</GradientText>
                        </Heading>
                        <Text mx="auto" mb="12" maxW="xl" fontSize="lg" color="fg.muted" lineHeight="relaxed">
                            Únete a profesionales que ya centralizan su consulta en ClientKosmos. El plan gratuito es
                            para siempre y no requiere tarjeta.
                        </Text>
                        <Flex
                            direction={{ base: 'column', sm: 'row' }}
                            alignItems="center"
                            justifyContent="center"
                            gap="4"
                        >
                            {canRegister && (
                                <Button size="lg" asChild boxShadow={GLOW_PRIMARY_SHADOW}>
                                    <Link href={register()}>
                                        <HStack gap="3">
                                            <span>Crear cuenta gratuita</span>
                                            <Icon as={ArrowRight} boxSize="5" />
                                        </HStack>
                                    </Link>
                                </Button>
                            )}
                            <Button size="lg" variant="outline" asChild>
                                <Link href={login()}>Ya tengo cuenta</Link>
                            </Button>
                        </Flex>

                        <Flex
                            mt="12"
                            flexWrap="wrap"
                            alignItems="center"
                            justifyContent="center"
                            gap="6"
                            fontSize="sm"
                            color="fg.muted"
                        >
                            <HStack as="span" bg="bg.muted" borderRadius="full" px="4" py="2" gap="2">
                                <Icon as={CheckCircle2} boxSize="4" color="brand.solid" />
                                Sin tarjeta de crédito
                            </HStack>
                            <HStack as="span" bg="bg.muted" borderRadius="full" px="4" py="2" gap="2">
                                <Icon as={Lock} boxSize="4" color="brand.solid" />
                                RGPD integrado
                            </HStack>
                            <HStack as="span" bg="bg.muted" borderRadius="full" px="4" py="2" gap="2">
                                <Icon as={Zap} boxSize="4" color="brand.solid" />
                                Activo en minutos
                            </HStack>
                        </Flex>
                    </Box>
                </chakra.section>

                {/* Footer */}
                <chakra.footer borderTopWidth="1px">
                    <PageCtn py="16">
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="10" mb="12">
                            <Box gridColumn={{ lg: 'span 2' }}>
                                <HStack gap="3" mb="4">
                                    <chakra.img src={logo} alt="ClientKosmos" h="10" w="auto" objectFit="contain" />
                                    <GradientText fontSize="2xl" fontWeight="bold">
                                        ClientKosmos
                                    </GradientText>
                                </HStack>
                                <Text fontSize="sm" color="fg.muted" maxW="xs" lineHeight="relaxed">
                                    Plataforma de gestión de consulta para profesionales autónomos. Fichas de
                                    pacientes, sesiones, pagos, RGPD y Kosmo IA en un solo lugar.
                                </Text>
                            </Box>

                            <Box>
                                <Heading as="h4" fontSize="md" fontWeight="semibold" mb="4">
                                    Producto
                                </Heading>
                                <Stack as="ul" gap="3" fontSize="sm" color="fg.muted">
                                    <li>
                                        <chakra.a
                                            href="#features"
                                            transition="colors"
                                            _hover={{ color: 'brand.solid' }}
                                        >
                                            Funcionalidades
                                        </chakra.a>
                                    </li>
                                    <li>
                                        <chakra.a
                                            href="#how-it-works"
                                            transition="colors"
                                            _hover={{ color: 'brand.solid' }}
                                        >
                                            Cómo funciona
                                        </chakra.a>
                                    </li>
                                    <li>
                                        <chakra.a
                                            href="#pricing"
                                            transition="colors"
                                            _hover={{ color: 'brand.solid' }}
                                        >
                                            Precios
                                        </chakra.a>
                                    </li>
                                    <li>
                                        <chakra.a
                                            href="#testimonials"
                                            transition="colors"
                                            _hover={{ color: 'brand.solid' }}
                                        >
                                            Testimonios
                                        </chakra.a>
                                    </li>
                                </Stack>
                            </Box>

                            <Box>
                                <Heading as="h4" fontSize="md" fontWeight="semibold" mb="4">
                                    Empezar
                                </Heading>
                                <Stack as="ul" gap="3" fontSize="sm" color="fg.muted">
                                    <li>
                                        <chakra.span _hover={{ color: 'brand.solid' }} transition="colors">
                                            <Link href={register()}>Crear cuenta</Link>
                                        </chakra.span>
                                    </li>
                                    <li>
                                        <chakra.span _hover={{ color: 'brand.solid' }} transition="colors">
                                            <Link href={login()}>Iniciar sesión</Link>
                                        </chakra.span>
                                    </li>
                                </Stack>
                            </Box>
                        </SimpleGrid>

                        <Separator mb="8" />

                        <Flex
                            direction={{ base: 'column', sm: 'row' }}
                            alignItems="center"
                            justifyContent={{ sm: 'space-between' }}
                            gap="4"
                            fontSize="sm"
                            color="fg.muted"
                        >
                            <Text>© {new Date().getFullYear()} ClientKosmos · Proyecto Intermodular 2º DAM</Text>
                            <HStack gap="1.5">
                                Hecho con{' '}
                                <Text as="span" color="danger.fg">
                                    ❤
                                </Text>{' '}
                                para profesionales organizados
                            </HStack>
                        </Flex>
                    </PageCtn>
                </chakra.footer>
            </Box>
        </>
    );
}

/* — Subcomponents — */

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
    icon: ReactNode;
    title: string;
    description: string;
    badge: string;
    colSpan?: { md?: number; lg?: number };
    rowSpan?: { lg?: number };
    featured?: boolean;
    isPremium?: boolean;
    delay?: number;
    children?: ReactNode;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!cardRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.15 },
        );
        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Box
            ref={cardRef}
            gridColumn={
                colSpan
                    ? {
                          md: colSpan.md ? `span ${colSpan.md}` : undefined,
                          lg: colSpan.lg ? `span ${colSpan.lg}` : undefined,
                      }
                    : undefined
            }
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
                <CardContent p={featured ? '8' : '6'} h="full">
                    <Flex alignItems="flex-start" justifyContent="space-between" mb="5">
                        <Box borderRadius="2xl" bg="brand.muted" p="3.5" color="brand.solid" transition="all 0.5s">
                            {icon}
                        </Box>
                        <Badge
                            variant={isPremium ? 'default' : 'secondary'}
                            textTransform="uppercase"
                            fontSize="11px"
                            letterSpacing="wide"
                            fontWeight="semibold"
                        >
                            {isPremium ? (
                                <HStack gap="1">
                                    <Star size={12} />
                                    {badge}
                                </HStack>
                            ) : (
                                badge
                            )}
                        </Badge>
                    </Flex>
                    <Heading as="h3" fontWeight="bold" mb="2.5" fontSize={featured ? 'xl' : 'lg'} transition="colors">
                        {title}
                    </Heading>
                    <Text fontSize="sm" color="fg.muted" lineHeight="relaxed">
                        {description}
                    </Text>
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
    rating,
    featured = false,
}: {
    quote: string;
    author: string;
    role: string;
    rating: number;
    featured?: boolean;
}) {
    return (
        <Card
            position="relative"
            overflow="hidden"
            transition="all 0.5s"
            borderWidth={featured ? '2px' : '1px'}
            borderColor={featured ? 'brand.solid' : 'border'}
            boxShadow={featured ? 'lg' : 'sm'}
            transform={featured ? { md: 'scale(1.05)' } : undefined}
            zIndex={featured ? 10 : undefined}
            bg={featured ? 'bg.surface' : 'bg'}
            _hover={{
                transform: featured ? { md: 'scale(1.06) translateY(-4px)' } : 'translateY(-8px)',
                boxShadow: 'xl',
                borderColor: 'brand.solid',
            }}
        >
            <CardContent p="7">
                <Flex gap="1" mb="4" alignItems="center">
                    {Array.from({ length: rating }).map((_, i) => (
                        <Icon key={i} as={Star} boxSize="4" color="warning.fg" fill="currentColor" />
                    ))}
                </Flex>
                <Icon as={Quote} boxSize="7" color="brand.solid" opacity={0.4} mb="3" />
                <Text fontSize="sm" lineHeight="relaxed" mb="6" color="fg">
                    "{quote}"
                </Text>
                <HStack gap="3">
                    <Avatar.Root colorPalette="brand" size="md">
                        <Avatar.Fallback name={author} />
                    </Avatar.Root>
                    <Box>
                        <Text fontWeight="semibold" fontSize="sm">
                            {author}
                        </Text>
                        <Text fontSize="xs" color="fg.muted">
                            {role}
                        </Text>
                    </Box>
                </HStack>
            </CardContent>
        </Card>
    );
}

function PricingFeature({ text, highlight = false }: { text: string; highlight?: boolean }) {
    return (
        <HStack as="li" gap="3">
            <Box flexShrink={0} borderRadius="full" p="0.5" bg={highlight ? 'brand.muted' : 'transparent'}>
                <Icon as={CheckCircle2} boxSize="4" color={highlight ? 'brand.solid' : 'brand.solid/70'} />
            </Box>
            <Text as="span" fontWeight={highlight ? 'medium' : 'normal'}>
                {text}
            </Text>
        </HStack>
    );
}

function TrustStat({
    icon,
    value,
    label,
}: {
    icon: typeof Users;
    value: string;
    label: string;
}) {
    return (
        <Stat.Root>
            <HStack gap="3">
                <Flex
                    h="11"
                    w="11"
                    flexShrink={0}
                    borderRadius="xl"
                    bg="brand.muted"
                    color="brand.solid"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={icon} boxSize="5" />
                </Flex>
                <Box>
                    <Stat.ValueText
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight="extrabold"
                        letterSpacing="tight"
                        color="fg"
                    >
                        {value}
                    </Stat.ValueText>
                    <Stat.Label
                        fontSize="xs"
                        color="fg.muted"
                        fontWeight="medium"
                        textTransform="uppercase"
                        letterSpacing="wider"
                    >
                        {label}
                    </Stat.Label>
                </Box>
            </HStack>
        </Stat.Root>
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
            dotBg: 'success.solid',
            wrapperBg: 'bg.muted',
            wrapperBorder: 'border',
            icon: <Icon as={CheckCircle2} boxSize="4" color="success.solid" />,
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
            dotBg: 'warning.solid',
            wrapperBg: 'warning.subtle',
            wrapperBorder: 'warning.muted',
            icon: <Icon as={AlertCircle} boxSize="4" color="warning.solid" />,
            strikethrough: false,
        },
    }[status];

    return (
        <HStack
            borderRadius="xl"
            borderWidth="2px"
            borderColor={cfg.wrapperBorder}
            bg={cfg.wrapperBg}
            p="3"
            transition="all 0.3s"
            gap="3"
        >
            <Box
                h="2.5"
                w="2.5"
                borderRadius="full"
                flexShrink={0}
                bg={cfg.dotBg}
                animation={animate ? 'pulse 2s ease-in-out infinite' : undefined}
            />
            <Text
                as="span"
                flex="1"
                fontSize="sm"
                textDecoration={cfg.strikethrough ? 'line-through' : undefined}
                color={cfg.strikethrough ? 'fg.muted' : undefined}
            >
                {text}
            </Text>
            {cfg.icon}
        </HStack>
    );
}
