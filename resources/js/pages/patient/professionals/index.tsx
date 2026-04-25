import { Badge, Box, Flex, Heading, Separator, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import { BadgeCheck, CalendarClock, ChevronDown, MapPin, Search, SlidersHorizontal, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import BookAction from '@/actions/App/Http/Controllers/Portal/Appointment/BookAction';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

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

interface Service {
    id: number;
    name: string;
    duration_minutes: number;
    price: string;
}

interface Props {
    professionals: Professional[];
    services: Service[];
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

const formatDateLabel = (isoDate: string): string => {
    const [y, m, d] = isoDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.getTime() === today.getTime()) { return 'Hoy'; }
    if (date.getTime() === tomorrow.getTime()) { return 'Mañana'; }

    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(date);
};

export default function PortalProfessionalsIndex({ professionals }: Props) {
    const [activeProfessional, setActiveProfessional] = useState<Professional | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProfessionals = professionals.filter((p) => {
        if (!searchQuery.trim()) { return true; }
        const q = searchQuery.toLowerCase();
        return (
            p.name.toLowerCase().includes(q) ||
            p.specialties.some((s) => formatSpecialty(s).toLowerCase().includes(q)) ||
            (p.bio?.toLowerCase().includes(q) ?? false)
        );
    });

    const openBooking = (professional: Professional) => {
        setActiveProfessional(professional);
        setSelectedDate(professional.slots[0]?.date ?? null);
    };

    const closeBooking = () => {
        setActiveProfessional(null);
        setSelectedDate(null);
    };

    const selectSlot = (date: string, time: string) => {
        if (!activeProfessional) { return; }

        const [y, mo, d] = date.split('-').map(Number);
        const [h, mi] = time.split(':').map(Number);
        const local = new Date(y, mo - 1, d, h, mi, 0);
        const startsAt = local.toISOString();

        router.visit(
            BookAction.url({
                query: {
                    professional_id: activeProfessional.id,
                    starts_at: startsAt,
                },
            }),
        );
    };

    const activeDaySlots = activeProfessional?.slots.find((s) => s.date === selectedDate);

    return (
        <>
            <Head title="Profesionales — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="6"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="5xl"
                mx="auto"
                w="full"
            >
                {/* Header */}
                <Stack gap="1">
                    <Heading as="h1" fontSize="4xl" fontWeight="bold" color="fg" letterSpacing="-0.48px">
                        Lista de profesionales
                    </Heading>
                    <Text fontSize="md" color="fg.muted">
                        Encuentra al profesional que mejor se adapte a ti
                    </Text>
                </Stack>

                {/* Search bar */}
                <Box
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="border"
                    bg="bg.surface"
                    p="3"
                >
                    <Flex align="center" gap="0">
                        <Flex align="center" gap="2" flex="1" px="3">
                            <Box as={Search} w="4" h="4" color="fg.subtle" flexShrink={0} aria-hidden />
                            <Input
                                border="none"
                                _focusVisible={{ boxShadow: 'none', borderColor: 'transparent' }}
                                placeholder="Sector de psicólogo (ej. Psicología infantil)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Buscar por especialidad o nombre"
                            />
                        </Flex>

                        <Separator orientation="vertical" h="8" borderColor="border" />

                        <Flex align="center" gap="2" flex="1" px="3">
                            <Box as={MapPin} w="4" h="4" color="fg.subtle" flexShrink={0} aria-hidden />
                            <Input
                                border="none"
                                _focusVisible={{ boxShadow: 'none', borderColor: 'transparent' }}
                                placeholder="Ciudad (ej. Zaragoza, Madrid)"
                                aria-label="Filtrar por ciudad"
                            />
                        </Flex>

                        <Button variant="primary" size="icon" aria-label="Buscar">
                            <Box as={Search} w="4" h="4" aria-hidden />
                        </Button>
                    </Flex>
                </Box>

                {/* Filter chips */}
                <Flex gap="2" flexWrap="wrap">
                    <Button variant="secondary" size="sm">
                        <Box as={SlidersHorizontal} w="3.5" h="3.5" aria-hidden />
                        All Specialties
                    </Button>
                    <Button variant="secondary" size="sm">
                        Availability: This Week
                        <Box as={ChevronDown} w="3.5" h="3.5" aria-hidden />
                    </Button>
                </Flex>

                {/* Professional list */}
                {filteredProfessionals.length === 0 ? (
                    <Box borderRadius="2xl" borderWidth="1px" borderColor="border" bg="bg.surface" p="12" textAlign="center">
                        <Box as={Users} w="10" h="10" mx="auto" mb="3" color="fg.subtle" aria-hidden />
                        <Text fontSize="sm" color="fg.muted">
                            {professionals.length === 0
                                ? 'No hay profesionales verificados en este momento. Vuelve a consultar más tarde.'
                                : 'Ningún profesional coincide con tu búsqueda.'}
                        </Text>
                    </Box>
                ) : (
                    <Stack gap="4">
                        {filteredProfessionals.map((professional) => {
                            const hasSlots = professional.slots.length > 0;

                            return (
                                <Box
                                    key={professional.id}
                                    borderRadius="xl"
                                    borderWidth="1px"
                                    borderColor="border"
                                    bg="bg.surface"
                                    p="5"
                                >
                                    <Flex gap="4" align="center">
                                        {/* Avatar */}
                                        <Box w="16" h="16" borderRadius="full" overflow="hidden" flexShrink={0}>
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
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                >
                                                    {getInitials(professional.name)}
                                                </Flex>
                                            )}
                                        </Box>

                                        {/* Info */}
                                        <Box flex="1" minW={0}>
                                            <Flex align="center" gap="2" mb="0.5" flexWrap="wrap">
                                                <Heading as="h2" fontSize="lg" fontWeight="bold" color="fg">
                                                    {professional.name}
                                                </Heading>
                                                {professional.is_verified && (
                                                    <Flex align="center" gap="1">
                                                        <Box as={BadgeCheck} w="4" h="4" color="green.fg" aria-hidden />
                                                        <Text fontSize="2xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="green.fg">
                                                            Verificado
                                                        </Text>
                                                    </Flex>
                                                )}
                                            </Flex>

                                            {professional.bio && (
                                                <Text fontSize="sm" color="brand.solid" mb="2" fontWeight="medium">
                                                    {professional.bio}
                                                </Text>
                                            )}

                                            {professional.specialties.length > 0 && (
                                                <Flex flexWrap="wrap" gap="1.5" mb="2">
                                                    {professional.specialties.map((specialty) => (
                                                        <Badge
                                                            key={specialty}
                                                            variant="outline"
                                                            colorPalette="gray"
                                                            borderRadius="full"
                                                            px="2.5"
                                                            py="0.5"
                                                            fontSize="2xs"
                                                            fontWeight="semibold"
                                                            textTransform="uppercase"
                                                            letterSpacing="wider"
                                                        >
                                                            {formatSpecialty(specialty)}
                                                        </Badge>
                                                    ))}
                                                </Flex>
                                            )}

                                            {professional.collegiate_number && (
                                                <Text fontSize="xs" color="fg.subtle">
                                                    Nº colegiado: {professional.collegiate_number}
                                                </Text>
                                            )}
                                        </Box>

                                        {/* Actions */}
                                        <Stack gap="2" flexShrink={0} align="stretch" minW="28">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                disabled={!hasSlots}
                                                onClick={() => openBooking(professional)}
                                                aria-label={`Reservar cita con ${professional.name}`}
                                            >
                                                <Box as={CalendarClock} w="3.5" h="3.5" aria-hidden />
                                                {hasSlots ? 'Reservar' : 'Sin disponibilidad'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled
                                                aria-label={`Ver perfil de ${professional.name}`}
                                            >
                                                Ver Perfil
                                            </Button>
                                        </Stack>
                                    </Flex>
                                </Box>
                            );
                        })}
                    </Stack>
                )}
            </Stack>

            <Dialog open={activeProfessional !== null} onOpenChange={(open) => !open && closeBooking()}>
                {activeProfessional && (
                    <DialogContent maxWidth={{ base: 'calc(100% - 2rem)', sm: '2xl' }}>
                        <DialogHeader>
                            <DialogTitle>Reservar con {activeProfessional.name}</DialogTitle>
                            <DialogDescription>Elige día y hora para tu sesión.</DialogDescription>
                        </DialogHeader>

                        {activeProfessional.slots.length === 0 ? (
                            <Text fontSize="sm" color="fg.muted" textAlign="center" py="8">
                                Este profesional no tiene huecos disponibles en los próximos 14 días.
                            </Text>
                        ) : (
                            <Stack gap="5">
                                <Stack gap="2">
                                    <Text
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        color="fg.subtle"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                    >
                                        Día
                                    </Text>
                                    <Flex gap="2" overflowX="auto" pb="1">
                                        {activeProfessional.slots.map((day) => {
                                            const isActive = day.date === selectedDate;
                                            return (
                                                <Button
                                                    key={day.date}
                                                    type="button"
                                                    variant={isActive ? 'primary' : 'secondary'}
                                                    size="sm"
                                                    onClick={() => setSelectedDate(day.date)}
                                                    flexShrink={0}
                                                >
                                                    {formatDateLabel(day.date)}
                                                </Button>
                                            );
                                        })}
                                    </Flex>
                                </Stack>

                                {activeDaySlots && (
                                    <Stack gap="2">
                                        <Text
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            color="fg.subtle"
                                            textTransform="uppercase"
                                            letterSpacing="wider"
                                        >
                                            Hora
                                        </Text>
                                        <Flex gap="2" flexWrap="wrap">
                                            {activeDaySlots.times.map((time) => (
                                                <Button
                                                    key={time}
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => selectSlot(activeDaySlots.date, time)}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </Flex>
                                    </Stack>
                                )}
                            </Stack>
                        )}
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}

PortalProfessionalsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
