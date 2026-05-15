import { Badge, Box, Container, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';

import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, Clock } from 'lucide-react';
import type { ReactNode } from 'react';
import IndexAction from '@/actions/App/Http/Controllers/Appointment/IndexAction';
import ShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraLink = chakra(Link);

interface AppointmentItem {
    id: number;
    starts_at: string;
    ends_at: string | null;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    modality: string;
    patient: { id: number; name: string } | null;
    service: { id: number; name: string } | null;
}

interface Paginated {
    data: AppointmentItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    appointments: Paginated;
    filters: { status?: string; date?: string };
}

const statusConfig: Record<string, { label: string; palette: string }> = {
    scheduled:   { label: 'Programada', palette: 'purple' },
    confirmed:   { label: 'Confirmada', palette: 'green' },
    in_progress: { label: 'En curso',   palette: 'yellow' },
    completed:   { label: 'Completada', palette: 'gray' },
    cancelled:   { label: 'Cancelada',  palette: 'red' },
};

const modalityLabel: Record<string, string> = {
    in_person:  'Presencial',
    video_call: 'Videollamada',
    telefono:   'Teléfono',
};

const isOnline = (modality: string) =>
    ['video_call', 'telefono'].includes(modality?.toLowerCase());

const formatDateTime = (dt: string) => {
    const date = new Date(dt);
    return {
        date: new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(date),
        time: new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date),
    };
};

const statusFilters = [
    { value: '', label: 'Todas' },
    { value: 'scheduled', label: 'Programadas' },
    { value: 'confirmed', label: 'Confirmadas' },
    { value: 'completed', label: 'Completadas' },
    { value: 'cancelled', label: 'Canceladas' },
];

export default function AppointmentsIndex({ appointments, filters }: Props) {
    const setFilter = (status: string) => {
        router.get(IndexAction.url(), { status: status || undefined, date: filters.date }, { preserveState: true });
    };

    return (
        <>
            <Head title="Citas — ClientKosmos" />

            <Container maxW="6xl" px={{ base: '4', md: '6', lg: '8' }} py={{ base: '6', lg: '8' }}>
              <Stack gap="6">

                <Flex alignItems="flex-end" justifyContent="space-between" gap="3" flexWrap="wrap">
                    <Box>
                        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="fg" lineHeight="shorter">
                            Listado de citas
                        </Heading>
                        <Text mt="1" fontSize="sm" color="fg.muted">
                            Historial y gestión de todas tus citas
                        </Text>
                    </Box>
                    <Badge variant="subtle" colorPalette="gray" borderRadius="full" px="3" py="1" fontSize="xs">
                        {appointments.total} {appointments.total === 1 ? 'cita' : 'citas'}
                    </Badge>
                </Flex>

                <Flex
                    gap="1"
                    flexWrap="wrap"
                    role="tablist"
                    aria-label="Filtrar por estado"
                    p="1"
                    borderRadius="full"
                    w="fit-content"
                    maxW="full"
                    overflowX="auto"
                >
                    {statusFilters.map((f) => {
                        const isActive = (filters.status ?? '') === f.value;
                        return (
                            <chakra.button
                                key={f.value}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setFilter(f.value)}
                                px="3.5"
                                py="1.5"
                                minH="8"
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="medium"
                                whiteSpace="nowrap"
                                transition="all 0.15s ease"
                                bg={isActive ? 'bg.surface' : 'transparent'}
                                color={isActive ? 'fg' : 'fg.muted'}
                                boxShadow={isActive ? 'xs' : undefined}
                                cursor="pointer"
                                _hover={isActive ? undefined : { color: 'fg' }}
                                _focusVisible={{ outline: '2px solid', outlineColor: 'brand.solid', outlineOffset: '2px' }}
                            >
                                {f.label}
                            </chakra.button>
                        );
                    })}
                </Flex>

                {appointments.data.length === 0 ? (
                    <EmptyState
                        icon={CalendarDays}
                        title="Sin citas"
                        description="No hay citas que coincidan con los filtros seleccionados."
                    />
                ) : (
                    <Stack gap="2">
                        {appointments.data.map((appt) => {
                            const { date, time } = formatDateTime(appt.starts_at);
                            const cfg = statusConfig[appt.status] ?? statusConfig.scheduled;
                            const online = isOnline(appt.modality);

                            return (
                                <Flex
                                    key={appt.id}
                                    alignItems={{ base: 'flex-start', md: 'center' }}
                                    gap={{ base: '3', md: '4' }}
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="border"
                                    bg="bg.surface"
                                    px={{ base: '3', md: '4' }}
                                    py={{ base: '3', md: '3' }}
                                    transition="box-shadow 0.15s ease, border-color 0.15s ease"
                                    _hover={{ boxShadow: 'sm', borderColor: 'border.emphasized' }}
                                    flexWrap={{ base: 'wrap', md: 'nowrap' }}
                                >
                                    <Box
                                        w="2.5"
                                        h="2.5"
                                        mt={{ base: '1.5', md: '0' }}
                                        borderRadius="full"
                                        flexShrink={0}
                                        bg={`${cfg.palette}.solid`}
                                    />

                                    <Box w={{ base: 'auto', md: '28' }} flexShrink={0}>
                                        <Text fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="capitalize" margin="0">
                                            {date}
                                        </Text>
                                        <Flex alignItems="center" gap="1" mt="0.5">
                                            <Box as={Clock} w="3" h="3" color="fg.subtle" />
                                            <Text fontSize="sm" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums" margin="var(--space-1)">
                                                {time}
                                            </Text>
                                        </Flex>
                                    </Box>

                                    <Box flex="1" minW="0" w={{ base: 'full', md: 'auto' }}>
                                        <Text fontSize="sm" fontWeight="semibold" color="fg" truncate>
                                            {appt.patient?.name ?? 'Paciente'}
                                        </Text>
                                        {appt.service && (
                                            <Text fontSize="xs" color="fg.muted" mt="0.5" truncate>
                                                {appt.service.name}
                                            </Text>
                                        )}
                                    </Box>

                                    <Flex
                                        gap={{ base: '2', md: '4' }}
                                        alignItems={{ base: 'flex-start', md: 'center' }}
                                        flexDirection={{ base: 'column', md: 'row' }}
                                        w={{ base: 'full', md: 'auto' }}
                                        flexShrink={0}
                                    >
                                        <Flex gap="1.5" flexShrink={0} flexWrap="wrap">
                                            <Badge
                                                variant="subtle"
                                                colorPalette={online ? 'gray' : 'green'}
                                                borderRadius="full"
                                                px="2"
                                                py="0.5"
                                                fontSize="2xs"
                                                fontWeight="semibold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                            >
                                                {modalityLabel[appt.modality?.toLowerCase()] ?? appt.modality ?? 'Presencial'}
                                            </Badge>

                                            <Badge
                                                variant="subtle"
                                                colorPalette={cfg.palette}
                                                borderRadius="full"
                                                px="2"
                                                py="0.5"
                                                fontSize="2xs"
                                                fontWeight="semibold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                            >
                                                {cfg.label}
                                            </Badge>
                                        </Flex>
                                    </Flex>
                                    <Flex
                                            alignItems="center"
                                            gap="1"
                                            flexShrink={0}
                                            w={{ base: 'full', md: 'auto' }}
                                            justifyContent={{ base: 'flex-start', md: 'flex-start' }}
                                            flexWrap="wrap"
                                        >
                                            {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                                                <Button asChild variant="primary" size="sm">
                                                    <ChakraLink href={ShowAction.url(appt.id)}>Inicar sesión</ChakraLink>
                                                </Button>
                                            )}
                                    </Flex>
                                </Flex>
                            );
                        })}
                    </Stack>
                )}

                {appointments.last_page > 1 && (
                    <Flex alignItems="center" justifyContent="space-between" gap="3" flexWrap="wrap" pt="2">
                        <Text fontSize="xs" color="fg.muted">
                            Página {appointments.current_page} de {appointments.last_page}
                        </Text>
                        <Flex gap="1" as="nav" aria-label="Paginación">
                            {appointments.links.map((link, i) => (
                                <chakra.button
                                    key={i}
                                    disabled={!link.url}
                                    aria-current={link.active ? 'page' : undefined}
                                    onClick={() => link.url && router.get(link.url)}
                                    minW="9"
                                    minH="9"
                                    px="3"
                                    fontSize="xs"
                                    fontWeight="medium"
                                    borderRadius="md"
                                    transition="all 0.15s ease"
                                    bg={link.active ? 'brand.solid' : 'transparent'}
                                    color={link.active ? 'brand.contrast' : link.url ? 'fg' : 'fg.subtle'}
                                    borderWidth="1px"
                                    borderColor={link.active ? 'brand.solid' : 'border'}
                                    cursor={link.url ? 'pointer' : 'not-allowed'}
                                    opacity={link.url || link.active ? 1 : 0.5}
                                    _hover={link.active || !link.url ? undefined : { bg: 'bg.subtle', borderColor: 'border.emphasized' }}
                                    _focusVisible={{ outline: '2px solid', outlineColor: 'brand.solid', outlineOffset: '2px' }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </Flex>
                    </Flex>
                )}
              </Stack>
            </Container>
        </>
    );
}

AppointmentsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
