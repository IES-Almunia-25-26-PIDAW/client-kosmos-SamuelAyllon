import { Badge, Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';

import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, Clock } from 'lucide-react';
import type { ReactNode } from 'react';
import IndexAction from '@/actions/App/Http/Controllers/Appointment/IndexAction';
import ShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';
import { EmptyState } from '@/components/empty-state';
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
    presencial:   'Presencial',
    online:       'Online',
    videollamada: 'Videollamada',
    telefono:     'Teléfono',
};

const isOnline = (modality: string) =>
    ['online', 'videollamada', 'telefono'].includes(modality?.toLowerCase());

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

            <Stack gap="6" p={{ base: '6', lg: '8' }}>

                <Box>
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Listado de citas
                    </Heading>
                    <Text mt="1" fontSize="md" color="fg.muted">
                        Historial y gestión de todas tus citas
                    </Text>
                </Box>

                <Flex gap="2" flexWrap="wrap">
                    {statusFilters.map((f) => {
                        const isActive = (filters.status ?? '') === f.value;
                        return (
                            <Box
                                as="button"
                                key={f.value}
                                onClick={() => setFilter(f.value)}
                                px="3"
                                py="1.5"
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="medium"
                                transition="colors 0.2s"
                                bg={isActive ? 'brand.solid' : 'bg.subtle'}
                                color={isActive ? 'brand.contrast' : 'fg.muted'}
                                _hover={isActive ? undefined : { bg: 'border' }}
                            >
                                {f.label}
                            </Box>
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
                                    alignItems="center"
                                    gap="4"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="border"
                                    bg="bg.surface"
                                    px="4"
                                    py="3"
                                    transition="box-shadow 0.2s"
                                    _hover={{ boxShadow: 'sm' }}
                                >
                                    <Box
                                        w="2.5"
                                        h="2.5"
                                        borderRadius="full"
                                        flexShrink={0}
                                        bg={`${cfg.palette}.solid`}
                                    />

                                    <Box w="28" flexShrink={0}>
                                        <Text fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="capitalize">
                                            {date}
                                        </Text>
                                        <Flex alignItems="center" gap="1" mt="0.5">
                                            <Box as={Clock} w="3" h="3" color="fg.subtle" />
                                            <Text fontSize="sm" fontWeight="semibold" color="fg">
                                                {time}
                                            </Text>
                                        </Flex>
                                    </Box>

                                    <Box flex="1" minW="0">
                                        <Text fontSize="sm" fontWeight="semibold" color="fg" truncate>
                                            {appt.patient?.name ?? 'Paciente'}
                                        </Text>
                                        {appt.service && (
                                            <Text fontSize="xs" color="fg.muted" mt="0.5" truncate>
                                                {appt.service.name}
                                            </Text>
                                        )}
                                    </Box>

                                    <Badge
                                        flexShrink={0}
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
                                        flexShrink={0}
                                        variant="subtle"
                                        colorPalette={cfg.palette}
                                        borderRadius="full"
                                        px="2"
                                        py="0.5"
                                        fontSize="xs"
                                        fontWeight="medium"
                                    >
                                        {cfg.label}
                                    </Badge>

                                    <Flex alignItems="center" gap="2" flexShrink={0}>
                                        {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                                            <ChakraLink
                                                href={ShowAction.url(appt.id)}
                                                borderRadius="md"
                                                bg="brand.solid"
                                                px="3"
                                                py="1.5"
                                                fontSize="xs"
                                                fontWeight="medium"
                                                color="brand.contrast"
                                                transition="colors 0.2s"
                                                _hover={{ bg: 'brand.emphasized' }}
                                            >
                                                Ver sesión
                                            </ChakraLink>
                                        )}
                                        {appt.patient && (
                                            <ChakraLink
                                                href={PatientShowAction.url(appt.patient.id)}
                                                borderRadius="md"
                                                borderWidth="1px"
                                                borderColor="border"
                                                px="3"
                                                py="1.5"
                                                fontSize="xs"
                                                fontWeight="medium"
                                                color="fg"
                                                transition="colors 0.2s"
                                                _hover={{ bg: 'bg.subtle' }}
                                            >
                                                Ver ficha
                                            </ChakraLink>
                                        )}
                                    </Flex>
                                </Flex>
                            );
                        })}
                    </Stack>
                )}

                {appointments.last_page > 1 && (
                    <Flex alignItems="center" justifyContent="space-between">
                        <Text fontSize="xs" color="fg.muted">
                            {appointments.total} citas · Página {appointments.current_page} de {appointments.last_page}
                        </Text>
                        <Flex gap="1">
                            {appointments.links.map((link, i) => (
                                <chakra.button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    px="3"
                                    py="1"
                                    fontSize="xs"
                                    borderRadius="sm"
                                    transition="colors 0.2s"
                                    bg={link.active ? 'brand.solid' : undefined}
                                    color={link.active ? 'brand.contrast' : link.url ? 'fg.muted' : 'fg.subtle'}
                                    cursor={link.url ? 'pointer' : 'not-allowed'}
                                    _hover={link.active || !link.url ? undefined : { bg: 'border' }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </Flex>
                    </Flex>
                )}
            </Stack>
        </>
    );
}

AppointmentsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
