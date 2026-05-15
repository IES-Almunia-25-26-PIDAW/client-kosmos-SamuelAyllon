import { Badge, Box, EmptyState, Flex, Heading, Stack, Tabs, Text, VStack, chakra } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, CalendarClock, ChevronLeft, ChevronRight, MessageSquare, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import IndexAction from '@/actions/App/Http/Controllers/Portal/Professional/IndexAction';
import { BookingDialog } from '@/components/patient/booking-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { OfferedConsultation } from '@/types/offered-consultation';

const ChakraImg = chakra('img');

interface SlotsByDay {
    date: string;
    times: string[];
}

interface Professional {
    id: number;
    user_id: number;
    name: string;
    avatar_path: string | null;
    specialties: string[];
    bio: string | null;
    collegiate_number: string | null;
    is_verified: boolean;
    slots: SlotsByDay[];
}

interface Props {
    professional: Professional;
    services: OfferedConsultation[];
}

const SPECIALTY_LABELS: Record<string, string> = {
    clinical: 'Clínica',
    cognitive_behavioral: 'Cognitivo-conductual',
    child: 'Infantil',
    couples: 'Parejas',
    trauma: 'Trauma',
    systemic: 'Sistémica',
};

const formatSpecialty = (key: string): string =>
    SPECIALTY_LABELS[key] ?? key.replace(/_/g, ' ');

const getInitials = (name: string): string =>
    name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();


const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function formatDayColumn(isoDate: string): { dayName: string; dayNum: number } {
    const [y, m, d] = isoDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return { dayName: DAY_NAMES[date.getDay()], dayNum: d };
}

const DAYS_PER_PAGE = 3;

export default function ProfessionalShow({ professional, services }: Props) {
    const [slotPage, setSlotPage] = useState(0);
    const [bioExpanded, setBioExpanded] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [preselectedServiceId, setPreselectedServiceId] = useState<number | null>(null);
    const [preselectedSlot, setPreselectedSlot] = useState<{ date: string; time: string } | null>(null);
    const [activeTab, setActiveTab] = useState('experiencia');
    const tabScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = tabScrollRef.current;
        if (!container) return;
        const active = container.querySelector<HTMLElement>('[data-selected]');
        active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [activeTab]);

    const openBooking = (serviceId: number | null = null, slot: { date: string; time: string } | null = null) => {
        setPreselectedServiceId(serviceId);
        setPreselectedSlot(slot);
        setBookingOpen(true);
    };

    const totalPages = Math.ceil(professional.slots.length / DAYS_PER_PAGE);
    const visibleSlots = professional.slots.slice(slotPage * DAYS_PER_PAGE, (slotPage + 1) * DAYS_PER_PAGE);

    const pageLabel = (() => {
        if (professional.slots.length === 0) { return '—'; }
        const first = visibleSlots[0]?.date ?? '';
        const last = visibleSlots[visibleSlots.length - 1]?.date ?? '';
        const fmt = (iso: string) => {
            const [y, m, d] = iso.split('-').map(Number);
            return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
        };
        return first === last ? fmt(first) : `${fmt(first)} – ${fmt(last)}`;
    })();

    void router;

    const bioText = professional.bio ?? '';
    const BIO_LIMIT = 220;
    const bioTruncated = bioText.length > BIO_LIMIT && !bioExpanded;
    const bioDisplay = bioTruncated ? bioText.slice(0, BIO_LIMIT) + '…' : bioText;

    return (
        <>
            <Head title={`${professional.name} — ClientKosmos`} />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="6"
                pt={{ base: '8', lg: '10' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="5xl"
                mx="auto"
                w="full"
            >
                {/* Back nav */}
                <Flex align="center" gap="2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit(IndexAction.url())}
                        aria-label="Volver a Profesionales"
                    >
                        <Box as={ArrowLeft} w="3.5" h="3.5" aria-hidden />
                        <Text fontSize="xs" fontWeight="extrabold" textTransform="uppercase" letterSpacing="wider" color="fg.subtle">
                            Volver a <Text as="span" fontWeight="extrabold">Profesionales</Text>
                        </Text>
                    </Button>
                </Flex>

                <Flex gap="6" align="start" flexDirection={{ base: 'column', lg: 'row' }}>
                    {/* Left column */}
                    <Stack gap="4" flex="1" minW={0}>
                        {/* Profile header card */}
                        <Box
                            borderRadius="2xl"
                            borderWidth="1px"
                            borderColor="border"
                            bg="bg.surface"
                            p={{ base: '4', sm: '6', md: '8' }}
                            boxShadow="sm"
                        >
                            <Flex
                                gap={{ base: '4', md: '8' }}
                                align={{ base: 'center', sm: 'start' }}
                                flexDirection={{ base: 'column', sm: 'row' }}
                            >
                                {/* Avatar */}
                                <Box
                                    w={{ base: '20', sm: '24', md: '32' }}
                                    h={{ base: '20', sm: '24', md: '32' }}
                                    borderRadius="full"
                                    overflow="hidden"
                                    flexShrink={0}
                                    bg="bg.subtle"
                                >
                                    {professional.avatar_path ? (
                                        <ChakraImg
                                            src={professional.avatar_path}
                                            alt=""
                                            w="full"
                                            h="full"
                                            objectFit="cover"
                                        />
                                    ) : (
                                        <Flex
                                            w="full"
                                            h="full"
                                            bg="brand.subtle"
                                            color="brand.solid"
                                            alignItems="center"
                                            justifyContent="center"
                                            fontSize={{ base: 'xl', md: '2xl' }}
                                            fontWeight="bold"
                                        >
                                            {getInitials(professional.name)}
                                        </Flex>
                                    )}
                                </Box>

                                {/* Info */}
                                <Stack gap="1" flex="1" minW={0} align={{ base: 'center', sm: 'start' }}>
                                    <Flex align="center" gap="2" flexWrap="wrap" justify={{ base: 'center', sm: 'start' }}>
                                        <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="extrabold" color="fg" letterSpacing="-0.5px" m="0" textAlign={{ base: 'center', sm: 'start' }}>
                                            {professional.name}
                                        </Heading>
                                        {professional.is_verified && (
                                            <Box as={BadgeCheck} w="5" h="5" color="green.fg" aria-label="Verificado" />
                                        )}
                                    </Flex>

                                    {professional.specialties.length > 0 && (
                                        <Text fontSize="sm" color="fg.muted" m="0" textAlign={{ base: 'center', sm: 'start' }}>
                                            {professional.specialties.map(formatSpecialty).join(', ')}
                                        </Text>
                                    )}

                                    {/* Rating placeholder */}
                                    <Flex align="center" gap="1.5" mt="1" m="0">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Box
                                                key={i}
                                                as={Star}
                                                w="3.5"
                                                h="3.5"
                                                color={i <= 4 ? 'warning.solid' : 'fg.subtle'}
                                                fill={i <= 4 ? 'currentColor' : 'none'}
                                                aria-hidden
                                            />
                                        ))}
                                        <Text fontSize="sm" fontWeight="bold" color="fg" m="0">4.9</Text>
                                        <Text fontSize="sm" color="fg.subtle" m="0">(128 opiniones)</Text>
                                    </Flex>

                                    {professional.collegiate_number && (
                                        <Text fontSize="xs" color="fg.subtle" mt="1" m="0">
                                            Nº colegiado: {professional.collegiate_number}
                                        </Text>
                                    )}

                                    <Flex
                                        gap="3"
                                        mt="4"
                                        flexWrap="wrap"
                                        flexDirection={{ base: 'column', sm: 'row' }}
                                        w={{ base: 'full', sm: 'auto' }}
                                    >
                                        <Button
                                            variant="primary"
                                            size="md"
                                            disabled={services.length === 0}
                                            onClick={() => openBooking(null)}
                                            w={{ base: 'full', sm: 'auto' }}
                                        >
                                            <Box as={CalendarClock} w="4" h="4" aria-hidden />
                                            Reservar cita
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="md"
                                            disabled
                                            w={{ base: 'full', sm: 'auto' }}
                                        >
                                            <Box as={MessageSquare} w="4" h="4" aria-hidden />
                                            Enviar mensaje
                                        </Button>
                                    </Flex>
                                </Stack>
                            </Flex>
                        </Box>

                        {/* Navigation tabs + content */}
                        <Tabs.Root
                            value={activeTab}
                            onValueChange={(e) => setActiveTab(e.value)}
                            colorPalette="brand"
                            variant="line"
                            lazyMount
                            unmountOnExit
                        >
                            {/* Tab nav — own card, scrollable on mobile */}
                            <Box
                                ref={tabScrollRef}
                                borderRadius="xl"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                boxShadow="xs"
                                overflowX="auto"
                                css={{
                                    '&::-webkit-scrollbar': { display: 'none' },
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                <Tabs.List gap="0" borderBottomWidth="0" minW="max-content">
                                    <Tabs.Trigger value="experiencia" px={{ base: '3', md: '5' }} py="3.5" fontSize="sm" fontWeight="medium">Experiencia</Tabs.Trigger>
                                    <Tabs.Trigger value="servicios" px={{ base: '3', md: '5' }} py="3.5" fontSize="sm" fontWeight="medium">Servicios y precios</Tabs.Trigger>
                                    <Tabs.Trigger value="consultas" px={{ base: '3', md: '5' }} py="3.5" fontSize="sm" fontWeight="medium">Consultas</Tabs.Trigger>
                                    <Tabs.Trigger value="aseguradoras" px={{ base: '3', md: '5' }} py="3.5" fontSize="sm" fontWeight="medium">Aseguradoras</Tabs.Trigger>
                                    <Tabs.Trigger value="opiniones" px={{ base: '3', md: '5' }} py="3.5" fontSize="sm" fontWeight="medium">Opiniones</Tabs.Trigger>
                                </Tabs.List>
                            </Box>

                            {/* Tab content — own card below */}
                            <Box
                                borderRadius="xl"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                boxShadow="xs"
                            >
                                <Tabs.Content value="experiencia" p="0">
                                    <Box p={{ base: '5', md: '8' }}>
                                        <Stack gap="6">
                                            <Heading as="h2" fontSize="xl" fontWeight="bold" color="fg">
                                                Experiencia
                                            </Heading>

                                            {bioText ? (
                                                <Text fontSize="md" color="fg" lineHeight="tall">
                                                    {bioDisplay}
                                                    {bioText.length > BIO_LIMIT && (
                                                        <Box
                                                            as="button"
                                                            ml="1"
                                                            color="brand.solid"
                                                            fontWeight="medium"
                                                            fontSize="md"
                                                            _hover={{ textDecoration: 'underline' }}
                                                            onClick={() => setBioExpanded(!bioExpanded)}
                                                        >
                                                            {bioExpanded ? 'ver menos' : 'ver más'}
                                                        </Box>
                                                    )}
                                                </Text>
                                            ) : (
                                                <Text fontSize="sm" color="fg.muted" fontStyle="italic">
                                                    Este profesional aún no ha completado su perfil.
                                                </Text>
                                            )}

                                            {professional.specialties.length > 0 && (
                                                <Stack gap="3">
                                                    <Text fontSize="xs" fontWeight="semibold" color="fg.subtle" textTransform="uppercase" letterSpacing="wider">
                                                        Especialista en
                                                    </Text>
                                                    <Flex gap="2" flexWrap="wrap">
                                                        {professional.specialties.map((s) => (
                                                            <Badge
                                                                key={s}
                                                                colorPalette="brand"
                                                                variant="subtle"
                                                                borderRadius="full"
                                                                px="4"
                                                                py="1.5"
                                                                fontSize="sm"
                                                                fontWeight="medium"
                                                            >
                                                                {formatSpecialty(s)}
                                                            </Badge>
                                                        ))}
                                                    </Flex>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Box>
                                </Tabs.Content>

                                {(['servicios', 'consultas', 'aseguradoras', 'opiniones'] as const).map((tab) => (
                                    <Tabs.Content key={tab} value={tab} p="0">
                                        <EmptyState.Root py="16">
                                            <EmptyState.Content>
                                                <VStack textAlign="center" gap="1">
                                                    <EmptyState.Title fontSize="sm" fontWeight="semibold" color="fg">
                                                        Próximamente
                                                    </EmptyState.Title>
                                                    <EmptyState.Description fontSize="sm" color="fg.muted">
                                                        Esta sección estará disponible en breve.
                                                    </EmptyState.Description>
                                                </VStack>
                                            </EmptyState.Content>
                                        </EmptyState.Root>
                                    </Tabs.Content>
                                ))}
                            </Box>
                        </Tabs.Root>
                    </Stack>

                    {/* Right column — booking widget */}
                    <Box
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p={{ base: '5', md: '8' }}
                        boxShadow="md"
                        w={{ base: 'full', lg: '96' }}
                        flexShrink={0}
                        position={{ lg: 'sticky' }}
                        top={{ lg: '24' }}
                        alignSelf={{ lg: 'flex-start' }}
                    >
                        <Stack gap="4">
                            <Heading as="h2" fontSize="xl" fontWeight="bold" color="fg">
                                Reservar cita
                            </Heading>
                            <Text fontSize="sm" color="fg.muted">
                                Primera consulta de psicología
                            </Text>

                            {professional.slots.length === 0 ? (
                                <Text fontSize="sm" color="fg.muted" textAlign="center" py="8">
                                    Sin disponibilidad en los próximos 14 días.
                                </Text>
                            ) : (
                                <>
                                    {/* Pagination */}
                                    <Flex align="center" justify="space-between" pt="2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSlotPage((p) => Math.max(0, p - 1))}
                                            disabled={slotPage === 0}
                                            aria-label="Semana anterior"
                                        >
                                            <Box as={ChevronLeft} w="4" h="4" aria-hidden />
                                        </Button>
                                        <Text fontSize="sm" fontWeight="bold" color="fg">
                                            {pageLabel}
                                        </Text>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSlotPage((p) => Math.min(totalPages - 1, p + 1))}
                                            disabled={slotPage >= totalPages - 1}
                                            aria-label="Semana siguiente"
                                        >
                                            <Box as={ChevronRight} w="4" h="4" aria-hidden />
                                        </Button>
                                    </Flex>

                                    {/* Day columns */}
                                    <Flex gap="2" py="2">
                                        {visibleSlots.map((day) => {
                                            const { dayName, dayNum } = formatDayColumn(day.date);
                                            return (
                                                <Stack key={day.date} gap="2" flex="1" align="center">
                                                    <Text fontSize="xs" color="fg.muted" fontWeight="medium">
                                                        {dayName}
                                                    </Text>
                                                    <Text fontSize="sm" fontWeight="bold" color="fg" mb="2">
                                                        {dayNum}
                                                    </Text>
                                                    {day.times.map((time) => (
                                                        <Button
                                                            key={time}
                                                            type="button"
                                                            variant="secondary"
                                                            size="sm"
                                                            w="full"
                                                            onClick={() => {
                                                                const firstActive = services.find((s) => s.is_active);
                                                                openBooking(firstActive?.id ?? null, { date: day.date, time });
                                                            }}
                                                        >
                                                            {time}
                                                        </Button>
                                                    ))}
                                                </Stack>
                                            );
                                        })}
                                        {/* Fill empty columns */}
                                        {Array.from({ length: DAYS_PER_PAGE - visibleSlots.length }).map((_, i) => (
                                            <Box key={`empty-${i}`} flex="1" />
                                        ))}
                                    </Flex>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        w="full"
                                        onClick={() => {
                                            const next = slotPage + 1;
                                            if (next < totalPages) {
                                                setSlotPage(next);
                                            }
                                        }}
                                        disabled={slotPage >= totalPages - 1}
                                    >
                                        Ver más horarios
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Box>
                </Flex>
            </Stack>

            <BookingDialog
                open={bookingOpen}
                onOpenChange={setBookingOpen}
                professional={{ id: professional.id, user_id: professional.user_id, name: professional.name }}
                services={services}
                slots={professional.slots}
                preselectedServiceId={preselectedServiceId}
                preselectedSlot={preselectedSlot}
            />
        </>
    );
}

ProfessionalShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
