import { Badge, Box, Flex, Heading, List, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import { BadgeCheck, CalendarClock, MapPin, Search, SlidersHorizontal, Users, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import BookAction from '@/actions/App/Http/Controllers/Portal/Appointment/BookAction';
import ShowAction from '@/actions/App/Http/Controllers/Portal/Professional/ShowAction';
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
    city: string | null;
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
    cities: string[];
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

type NameSuggestion = { type: 'professional'; label: string; id: number };

export default function PortalProfessionalsIndex({ professionals, cities }: Props) {
    const [activeProfessional, setActiveProfessional] = useState<Professional | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Name search
    const [nameQuery, setNameQuery] = useState('');
    const [showNameSuggestions, setShowNameSuggestions] = useState(false);
    const nameSearchRef = useRef<HTMLDivElement>(null);

    // City search
    const [cityQuery, setCityQuery] = useState('');
    const [activeCity, setActiveCity] = useState<string | null>(null);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const citySearchRef = useRef<HTMLDivElement>(null);

    // Specialty filter — uses all known keys, not just those in current data
    const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);

    const allSpecialtyKeys = Object.keys(SPECIALTY_LABELS);

    // Professional name suggestions
    const nameSuggestions: NameSuggestion[] = (() => {
        if (!nameQuery.trim()) { return []; }
        const q = nameQuery.toLowerCase();
        return professionals
            .filter((p) => p.name.toLowerCase().includes(q))
            .slice(0, 5)
            .map((p) => ({ type: 'professional', label: p.name, id: p.id }));
    })();

    // City suggestions from the cities prop
    const citySuggestions = (() => {
        if (!cityQuery.trim()) { return cities; }
        const q = cityQuery.toLowerCase();
        return cities.filter((c) => c.toLowerCase().includes(q));
    })();

    const filteredProfessionals = professionals.filter((p) => {
        if (activeSpecialty && !p.specialties.includes(activeSpecialty)) { return false; }
        if (activeCity && p.city !== activeCity) { return false; }
        if (!nameQuery.trim()) { return true; }
        const q = nameQuery.toLowerCase();
        return (
            p.name.toLowerCase().includes(q) ||
            p.specialties.some((s) => formatSpecialty(s).toLowerCase().includes(q)) ||
            (p.bio?.toLowerCase().includes(q) ?? false)
        );
    });;

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
        router.visit(
            BookAction.url({
                query: {
                    professional_id: activeProfessional.id,
                    starts_at: local.toISOString(),
                },
            }),
        );
    };

    const applyCity = (city: string) => {
        setActiveCity(city);
        setCityQuery(city);
        setShowCitySuggestions(false);
    };

    const clearCity = () => {
        setActiveCity(null);
        setCityQuery('');
    };

    const activeDaySlots = activeProfessional?.slots.find((s) => s.date === selectedDate);

    const hasActiveFilters = activeSpecialty !== null || activeCity !== null || nameQuery.trim() !== '';

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

                {/* Search bars */}
                <Flex gap="3" direction={{ base: 'column', sm: 'row' }}>
                    {/* Name search */}
                    <Box position="relative" ref={nameSearchRef} flex="1">
                        <Box
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor="border"
                            bg="bg.surface"
                            px="3"
                            py="2.5"
                        >
                            <Flex align="center" gap="2">
                                <Box as={Search} w="4" h="4" color="fg.subtle" flexShrink={0} aria-hidden />
                                <Input
                                    border="none"
                                    _focusVisible={{ boxShadow: 'none', borderColor: 'transparent' }}
                                    placeholder="Nombre o especialidad"
                                    value={nameQuery}
                                    onChange={(e) => { setNameQuery(e.target.value); setShowNameSuggestions(true); }}
                                    onFocus={() => setShowNameSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowNameSuggestions(false), 150)}
                                    aria-label="Buscar por nombre o especialidad"
                                />
                                {nameQuery && (
                                    <Box
                                        as="button"
                                        onClick={() => { setNameQuery(''); setShowNameSuggestions(false); }}
                                        aria-label="Limpiar búsqueda"
                                        flexShrink={0}
                                        color="fg.subtle"
                                        _hover={{ color: 'fg' }}
                                    >
                                        <Box as={X} w="3.5" h="3.5" aria-hidden />
                                    </Box>
                                )}
                            </Flex>
                        </Box>

                        {showNameSuggestions && nameSuggestions.length > 0 && (
                            <Box
                                position="absolute"
                                top="calc(100% + 4px)"
                                left="0"
                                right="0"
                                bg="bg.surface"
                                borderWidth="1px"
                                borderColor="border"
                                borderRadius="xl"
                                boxShadow="md"
                                zIndex="dropdown"
                                overflow="hidden"
                            >
                                <List.Root listStyle="none" p="0" m="0">
                                    {nameSuggestions.map((s) => (
                                        <List.Item key={s.id}>
                                            <Box
                                                as="button"
                                                w="full"
                                                textAlign="left"
                                                px="4"
                                                py="3"
                                                display="flex"
                                                alignItems="center"
                                                gap="3"
                                                _hover={{ bg: 'bg.subtle' }}
                                                onClick={() => { setNameQuery(s.label); setShowNameSuggestions(false); }}
                                                fontSize="sm"
                                            >
                                                <Box as={Users} w="4" h="4" color="fg.subtle" flexShrink={0} aria-hidden />
                                                <Text color="fg">{s.label}</Text>
                                            </Box>
                                        </List.Item>
                                    ))}
                                </List.Root>
                            </Box>
                        )}
                    </Box>

                    {/* City search */}
                    <Box position="relative" ref={citySearchRef} flex="1">
                        <Box
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={activeCity ? 'brand.solid' : 'border'}
                            bg="bg.surface"
                            px="3"
                            py="2.5"
                        >
                            <Flex align="center" gap="2">
                                <Box as={MapPin} w="4" h="4" color={activeCity ? 'brand.solid' : 'fg.subtle'} flexShrink={0} aria-hidden />
                                <Input
                                    border="none"
                                    _focusVisible={{ boxShadow: 'none', borderColor: 'transparent' }}
                                    placeholder="Ciudad (ej. Jerez de la Frontera)"
                                    value={cityQuery}
                                    onChange={(e) => { setCityQuery(e.target.value); setActiveCity(null); setShowCitySuggestions(true); }}
                                    onFocus={() => setShowCitySuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
                                    aria-label="Filtrar por ciudad"
                                />
                                {(cityQuery || activeCity) && (
                                    <Box
                                        as="button"
                                        onClick={clearCity}
                                        aria-label="Limpiar ciudad"
                                        flexShrink={0}
                                        color="fg.subtle"
                                        _hover={{ color: 'fg' }}
                                    >
                                        <Box as={X} w="3.5" h="3.5" aria-hidden />
                                    </Box>
                                )}
                            </Flex>
                        </Box>

                        {showCitySuggestions && citySuggestions.length > 0 && (
                            <Box
                                position="absolute"
                                top="calc(100% + 4px)"
                                left="0"
                                right="0"
                                bg="bg.surface"
                                borderWidth="1px"
                                borderColor="border"
                                borderRadius="xl"
                                boxShadow="md"
                                zIndex="dropdown"
                                overflow="hidden"
                            >
                                <List.Root listStyle="none" p="0" m="0">
                                    {citySuggestions.map((city) => (
                                        <List.Item key={city}>
                                            <Box
                                                as="button"
                                                w="full"
                                                textAlign="left"
                                                px="4"
                                                py="3"
                                                display="flex"
                                                alignItems="center"
                                                gap="3"
                                                _hover={{ bg: 'bg.subtle' }}
                                                onClick={() => applyCity(city)}
                                                fontSize="sm"
                                            >
                                                <Box as={MapPin} w="4" h="4" color="fg.subtle" flexShrink={0} aria-hidden />
                                                <Text color="fg">{city}</Text>
                                            </Box>
                                        </List.Item>
                                    ))}
                                </List.Root>
                            </Box>
                        )}
                    </Box>
                </Flex>

                {/* Specialty filter chips — all known specialties */}
                <Stack gap="2">
                    <Flex align="center" gap="2">
                        <Box as={SlidersHorizontal} w="3.5" h="3.5" color="fg.subtle" aria-hidden />
                        <Text fontSize="xs" fontWeight="semibold" color="fg.subtle" textTransform="uppercase" letterSpacing="wider">
                            Tipo de psicología
                        </Text>
                    </Flex>
                    <Flex gap="2" flexWrap="wrap">
                        <Button
                            variant={activeSpecialty === null ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setActiveSpecialty(null)}
                        >
                            Todas
                        </Button>
                        {allSpecialtyKeys.map((key) => {
                            const count = professionals.filter((p) => p.specialties.includes(key)).length;
                            const isActive = activeSpecialty === key;
                            return (
                                <Button
                                    key={key}
                                    variant={isActive ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => setActiveSpecialty(isActive ? null : key)}
                                    opacity={count === 0 ? 0.45 : 1}
                                    title={count === 0 ? 'Sin profesionales disponibles' : undefined}
                                >
                                    {formatSpecialty(key)}
                                    {count > 0 && (
                                        <Box
                                            as="span"
                                            display="inline-flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            w="4"
                                            h="4"
                                            borderRadius="full"
                                            bg={isActive ? 'whiteAlpha.300' : 'bg.subtle'}
                                            fontSize="2xs"
                                            fontWeight="bold"
                                            color={isActive ? 'white' : 'fg.subtle'}
                                            ml="0.5"
                                        >
                                            {count}
                                        </Box>
                                    )}
                                    {isActive && (
                                        <Box as={X} w="3" h="3" aria-hidden />
                                    )}
                                </Button>
                            );
                        })}
                    </Flex>
                </Stack>

                {/* Active filters summary */}
                {hasActiveFilters && (
                    <Flex align="center" gap="2" flexWrap="wrap">
                        <Text fontSize="xs" color="fg.subtle">Filtros activos:</Text>
                        {nameQuery.trim() && (
                            <Badge
                                variant="outline"
                                colorPalette="brand"
                                borderRadius="full"
                                px="2.5"
                                py="0.5"
                                fontSize="xs"
                                display="flex"
                                alignItems="center"
                                gap="1"
                            >
                                {nameQuery}
                                <Box as="button" onClick={() => setNameQuery('')} aria-label="Quitar filtro nombre">
                                    <Box as={X} w="2.5" h="2.5" />
                                </Box>
                            </Badge>
                        )}
                        {activeCity && (
                            <Badge
                                variant="outline"
                                colorPalette="brand"
                                borderRadius="full"
                                px="2.5"
                                py="0.5"
                                fontSize="xs"
                                display="flex"
                                alignItems="center"
                                gap="1"
                            >
                                <Box as={MapPin} w="2.5" h="2.5" />
                                {activeCity}
                                <Box as="button" onClick={clearCity} aria-label="Quitar filtro ciudad">
                                    <Box as={X} w="2.5" h="2.5" />
                                </Box>
                            </Badge>
                        )}
                        {activeSpecialty && (
                            <Badge
                                variant="outline"
                                colorPalette="brand"
                                borderRadius="full"
                                px="2.5"
                                py="0.5"
                                fontSize="xs"
                                display="flex"
                                alignItems="center"
                                gap="1"
                            >
                                {formatSpecialty(activeSpecialty)}
                                <Box as="button" onClick={() => setActiveSpecialty(null)} aria-label="Quitar filtro especialidad">
                                    <Box as={X} w="2.5" h="2.5" />
                                </Box>
                            </Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setNameQuery(''); clearCity(); setActiveSpecialty(null); }}
                        >
                            Limpiar todo
                        </Button>
                    </Flex>
                )}

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

                                            <Flex align="center" gap="3" flexWrap="wrap">
                                                {professional.city && (
                                                    <Flex align="center" gap="1">
                                                        <Box as={MapPin} w="3" h="3" color="fg.subtle" aria-hidden />
                                                        <Text fontSize="xs" color="fg.subtle">{professional.city}</Text>
                                                    </Flex>
                                                )}
                                                {professional.collegiate_number && (
                                                    <Text fontSize="xs" color="fg.subtle">
                                                        Nº colegiado: {professional.collegiate_number}
                                                    </Text>
                                                )}
                                            </Flex>
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
                                                onClick={() => router.visit(ShowAction.url(professional.id))}
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
