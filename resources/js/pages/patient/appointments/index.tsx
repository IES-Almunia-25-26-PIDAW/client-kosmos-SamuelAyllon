import { Badge, Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { CalendarDays, Clock, Video } from 'lucide-react';
import type { ReactNode } from 'react';
import AppointmentShowAction from '@/actions/App/Http/Controllers/Portal/Appointment/ShowAction';
import ProfessionalIndexAction from '@/actions/App/Http/Controllers/Portal/Professional/IndexAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraLink = chakra(Link);

interface AppointmentRow {
    id: number;
    starts_at: string;
    ends_at: string;
    status: string;
    modality: string;
    professional: { id: number; name: string } | null;
    service: { id: number; name: string; duration_minutes: number } | null;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    appointments: Paginated<AppointmentRow>;
}

const STATUS_LABELS: Record<string, { label: string; palette: string }> = {
    pending: { label: 'Pendiente', palette: 'yellow' },
    confirmed: { label: 'Confirmada', palette: 'green' },
    in_progress: { label: 'En curso', palette: 'blue' },
    completed: { label: 'Completada', palette: 'gray' },
    cancelled: { label: 'Cancelada', palette: 'red' },
    no_show: { label: 'No asistió', palette: 'gray' },
};

const formatDate = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).format(new Date(iso));

const formatTime = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));

export default function PatientAppointmentsIndex({ appointments }: Props) {
    const rows = appointments.data;

    return (
        <>
            <Head title="Mis citas — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="8"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="5xl"
                mx="auto"
                w="full"
            >
                <Flex justifyContent="space-between" alignItems="center" gap="4" flexWrap="wrap">
                    <Stack gap="1">
                        <Heading as="h1" fontSize="4xl" fontWeight="bold" color="fg" letterSpacing="-0.48px">
                            Mis citas
                        </Heading>
                        <Text fontSize="md" color="fg.muted">
                            {rows.length === 0
                                ? 'Aún no tienes citas reservadas.'
                                : `${rows.length} cita${rows.length === 1 ? '' : 's'} en esta página`}
                        </Text>
                    </Stack>

                    <Button asChild variant="primary" size="md">
                        <ChakraLink href={ProfessionalIndexAction.url()}>Reservar nueva cita</ChakraLink>
                    </Button>
                </Flex>

                {rows.length === 0 ? (
                    <Box
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="12"
                        textAlign="center"
                    >
                        <Box as={CalendarDays} w="10" h="10" mx="auto" mb="3" color="fg.subtle" aria-hidden={true} />
                        <Text fontSize="sm" color="fg.muted">
                            Cuando reserves una cita aparecerá aquí.
                        </Text>
                    </Box>
                ) : (
                    <Stack gap="4" role="list">
                        {rows.map((appt) => {
                            const statusCfg = STATUS_LABELS[appt.status] ?? { label: appt.status, palette: 'gray' };
                            const isOnline = appt.modality === 'video_call';

                            return (
                                <Flex
                                    key={appt.id}
                                    role="listitem"
                                    bg="bg.surface"
                                    borderRadius="2xl"
                                    boxShadow="sm"
                                    p="6"
                                    gap="5"
                                    alignItems={{ base: 'stretch', md: 'center' }}
                                    flexDirection={{ base: 'column', md: 'row' }}
                                    justifyContent="space-between"
                                >
                                    <Stack gap="2" flex="1" minW={0}>
                                        <Flex alignItems="center" gap="2">
                                            <Heading as="h2" fontSize="lg" fontWeight="semibold" color="fg" truncate>
                                                {appt.professional?.name ?? 'Profesional'}
                                            </Heading>
                                            <Badge
                                                variant="subtle"
                                                colorPalette={statusCfg.palette}
                                                borderRadius="full"
                                                px="2.5"
                                                py="0.5"
                                                fontSize="2xs"
                                                fontWeight="semibold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                            >
                                                {statusCfg.label}
                                            </Badge>
                                        </Flex>

                                        <Flex alignItems="center" gap="4" flexWrap="wrap" color="fg.muted" fontSize="sm">
                                            <Flex alignItems="center" gap="1.5">
                                                <Box as={CalendarDays} w="3.5" h="3.5" aria-hidden={true} />
                                                <Text>{formatDate(appt.starts_at)}</Text>
                                            </Flex>
                                            <Flex alignItems="center" gap="1.5">
                                                <Box as={Clock} w="3.5" h="3.5" aria-hidden={true} />
                                                <Text>
                                                    {formatTime(appt.starts_at)} – {formatTime(appt.ends_at)}
                                                </Text>
                                            </Flex>
                                            {isOnline && (
                                                <Flex alignItems="center" gap="1.5">
                                                    <Box as={Video} w="3.5" h="3.5" aria-hidden={true} />
                                                    <Text>Videollamada</Text>
                                                </Flex>
                                            )}
                                        </Flex>

                                        {appt.service && (
                                            <Text fontSize="sm" color="fg.subtle">
                                                {appt.service.name}
                                            </Text>
                                        )}
                                    </Stack>

                                    <Button asChild variant="secondary" size="sm">
                                        <ChakraLink href={AppointmentShowAction.url(appt.id)}>Ver detalle</ChakraLink>
                                    </Button>
                                </Flex>
                            );
                        })}
                    </Stack>
                )}

                {(appointments.prev_page_url || appointments.next_page_url) && (
                    <Flex justifyContent="center" gap="3">
                        {appointments.prev_page_url && (
                            <Button asChild variant="secondary" size="sm">
                                <ChakraLink href={appointments.prev_page_url}>Anterior</ChakraLink>
                            </Button>
                        )}
                        {appointments.next_page_url && (
                            <Button asChild variant="secondary" size="sm">
                                <ChakraLink href={appointments.next_page_url}>Siguiente</ChakraLink>
                            </Button>
                        )}
                    </Flex>
                )}
            </Stack>
        </>
    );
}

PatientAppointmentsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
