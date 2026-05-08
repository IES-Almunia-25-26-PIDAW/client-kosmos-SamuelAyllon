import { Badge, Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Clock, MapPin, Video } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { JoinCallButton } from '@/components/join-call-button';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import PortalAppointmentConfirmAction from '@/actions/App/Http/Controllers/Portal/Appointment/ConfirmAction';
import PortalAppointmentIndexAction from '@/actions/App/Http/Controllers/Portal/Appointment/IndexAction';

const ChakraLink = chakra(Link);

interface Appointment {
    id: number;
    status: string;
    modality: string | null;
    starts_at: string;
    ends_at: string;
    meeting_url: string | null;
    meeting_room_id: string | null;
    patient_joined_at: string | null;
    professional_joined_at: string | null;
    notes: string | null;
    professional: { id: number; name: string; avatar_path: string | null } | null;
    service: { id: number; name: string; duration_minutes: number } | null;
}

interface Props {
    appointment: Appointment;
    isPaid: boolean;
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
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(iso));

const formatTime = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const JOINABLE_STATUSES = ['pending', 'confirmed', 'in_progress'];

export default function PatientAppointmentShow({ appointment, isPaid }: Props) {
    const statusCfg = STATUS_LABELS[appointment.status] ?? { label: appointment.status, palette: 'gray' };
    const isVideoCall = appointment.modality === 'video_call';
    const isJoinable = JOINABLE_STATUSES.includes(appointment.status);

    const [confirming, setConfirming] = useState(false);
    const canConfirm = useMemo(() => {
        if (appointment.status !== 'pending') return false;
        const cutoff = new Date(appointment.starts_at).getTime() - 24 * 60 * 60 * 1000;
        return Date.now() <= cutoff;
    }, [appointment.status, appointment.starts_at]);
    const handleConfirm = () => {
        setConfirming(true);
        router.post(
            PortalAppointmentConfirmAction.url(appointment.id),
            {},
            { preserveScroll: true, onFinish: () => setConfirming(false) },
        );
    };

    return (
        <>
            <Head title="Detalle de cita — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="8"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="2xl"
                mx="auto"
                w="full"
            >
                <Button asChild variant="ghost" size="sm" alignSelf="flex-start" px="0">
                    <ChakraLink href={PortalAppointmentIndexAction.url()}>
                        <Box as={ArrowLeft} w="4" h="4" mr="1.5" aria-hidden={true} />
                        Mis citas
                    </ChakraLink>
                </Button>

                <Stack gap="2">
                    <Flex alignItems="center" gap="3" flexWrap="wrap">
                        <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg" letterSpacing="-0.02em">
                            Cita con {appointment.professional?.name ?? 'tu profesional'}
                        </Heading>
                        <Badge
                            variant="subtle"
                            colorPalette={statusCfg.palette}
                            borderRadius="full"
                            px="3"
                            py="1"
                            fontSize="xs"
                            fontWeight="semibold"
                            textTransform="uppercase"
                            letterSpacing="wider"
                        >
                            {statusCfg.label}
                        </Badge>
                    </Flex>
                    {appointment.service && (
                        <Text fontSize="md" color="fg.muted">
                            {appointment.service.name} · {appointment.service.duration_minutes} min
                        </Text>
                    )}
                </Stack>

                <Stack
                    gap="4"
                    bg="bg.surface"
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor="border"
                    p="6"
                >
                    <Flex alignItems="center" gap="3" color="fg" fontSize="sm">
                        <Box as={CalendarDays} w="4" h="4" color="fg.muted" aria-hidden={true} flexShrink={0} />
                        <Text>{formatDate(appointment.starts_at)}</Text>
                    </Flex>

                    <Flex alignItems="center" gap="3" color="fg" fontSize="sm">
                        <Box as={Clock} w="4" h="4" color="fg.muted" aria-hidden={true} flexShrink={0} />
                        <Text>
                            {formatTime(appointment.starts_at)} – {formatTime(appointment.ends_at)}
                        </Text>
                    </Flex>

                    <Flex alignItems="center" gap="3" color="fg" fontSize="sm">
                        {isVideoCall ? (
                            <>
                                <Box as={Video} w="4" h="4" color="fg.muted" aria-hidden={true} flexShrink={0} />
                                <Text>Videollamada online</Text>
                            </>
                        ) : (
                            <>
                                <Box as={MapPin} w="4" h="4" color="fg.muted" aria-hidden={true} flexShrink={0} />
                                <Text>Presencial</Text>
                            </>
                        )}
                    </Flex>

                    {appointment.notes && (
                        <Box pt="2" borderTopWidth="1px" borderColor="border.subtle">
                            <Text fontSize="sm" color="fg.muted">
                                {appointment.notes}
                            </Text>
                        </Box>
                    )}
                </Stack>

                {appointment.status === 'completed' && (
                    <Flex
                        alignItems="center"
                        gap="2"
                        px="4"
                        py="3"
                        borderRadius="lg"
                        bg={isPaid ? 'green.subtle' : 'yellow.subtle'}
                        borderWidth="1px"
                        borderColor={isPaid ? 'green.muted' : 'yellow.muted'}
                    >
                        <Text fontSize="sm" fontWeight="medium" color={isPaid ? 'green.fg' : 'yellow.fg'}>
                            {isPaid ? 'Sesión pagada' : 'Pago pendiente'}
                        </Text>
                    </Flex>
                )}

                {appointment.status === 'pending' && (
                    <Stack gap="2" alignItems="center" pt="2">
                        {canConfirm ? (
                            <>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    minW="56"
                                    loading={confirming}
                                    onClick={handleConfirm}
                                >
                                    Confirmar cita
                                </Button>
                                <Text fontSize="xs" color="fg.muted">
                                    Confírmala con al menos 24 horas de antelación.
                                </Text>
                            </>
                        ) : (
                            <Text fontSize="sm" color="fg.muted">
                                El plazo para confirmar esta cita ha expirado.
                            </Text>
                        )}
                    </Stack>
                )}

                {isVideoCall && isJoinable && appointment.status !== 'pending' && (
                    <Flex justifyContent="center" pt="2">
                        <JoinCallButton appointment={appointment} role="patient" />
                    </Flex>
                )}
            </Stack>
        </>
    );
}

PatientAppointmentShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
