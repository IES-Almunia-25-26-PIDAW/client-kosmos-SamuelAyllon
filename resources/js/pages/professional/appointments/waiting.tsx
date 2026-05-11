import { Box, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import StartCallAction from '@/actions/App/Http/Controllers/Appointment/StartCallAction';
import { Button } from '@/components/ui/button';
import { useCountdown } from '@/hooks/use-countdown';
import AppLayout from '@/layouts/app-layout';
import axios from '@/lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
    avatar_path: string | null;
}

interface Appointment {
    id: number;
    status: string;
    starts_at: string;
    ends_at: string;
    patient_id: number;
    professional_id: number;
    patient_joined_at: string | null;
    professional_joined_at: string | null;
    meeting_room_id: string | null;
    meeting_url: string | null;
    patient: User | null;
    professional: User | null;
}

interface Props {
    appointment: Appointment;
}

const REDIRECT_THRESHOLD_MIN = 5;

const initials = (name: string | undefined) =>
    (name ?? '?')
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase();

export default function AppointmentWaiting({ appointment }: Props) {
    const startsAt = useMemo(() => new Date(appointment.starts_at), [appointment.starts_at]);

    // Countdown displayed to the professional (time until session start)
    const countdown = useCountdown(startsAt);

    // When this target is past, the professional is ≤5 min from start → auto-join
    const autoJoinAt = useMemo(
        () => new Date(startsAt.getTime() - REDIRECT_THRESHOLD_MIN * 60 * 1000),
        [startsAt],
    );
    const { isPast: shouldJoin } = useCountdown(autoJoinAt);

    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasJoined = useRef(false);

    const isJoinable = appointment.status === 'confirmed' || appointment.status === 'in_progress';

    const handleJoin = useCallback(async () => {
        if (hasJoined.current) return;
        hasJoined.current = true;
        setJoining(true);
        setError(null);
        try {
            const { data } = await axios.post<{ room_id: string; meeting_url: string | null }>(
                StartCallAction.url(appointment.id),
            );
            if (data.room_id) router.visit(`/call/${data.room_id}`);
        } catch (e: unknown) {
            hasJoined.current = false;
            let msg = 'No se pudo iniciar la sesión. Inténtalo de nuevo.';
            if (axios.isAxiosError(e)) {
                const data = e.response?.data as { message?: string } | undefined;
                msg = data?.message ?? e.message ?? msg;
            } else if (e instanceof Error) {
                msg = e.message;
            }
            setError(msg);
            setJoining(false);
        }
    }, [appointment.id]);

    // Auto-trigger join when the 5-min threshold is crossed (or on load if already past)
    useEffect(() => {
        if (shouldJoin && isJoinable && !hasJoined.current) {
            void handleJoin();
        }
    }, [shouldJoin, isJoinable, handleJoin]);

    return (
        <>
            <Head title="Sala de espera" />

            <Flex flex="1" alignItems="center" justifyContent="center" p="8" minH="70vh">
                <Stack gap="6" alignItems="center" textAlign="center" maxW="md">
                    {/* Animated avatar */}
                    <Flex position="relative" alignItems="center" justifyContent="center">
                        <Box
                            position="absolute"
                            display="inline-flex"
                            h="24"
                            w="24"
                            borderRadius="full"
                            bg="brand.solid"
                            opacity={0.2}
                            animation="ping 1s cubic-bezier(0, 0, 0.2, 1) infinite"
                        />
                        <Flex
                            position="relative"
                            w="20"
                            h="20"
                            borderRadius="full"
                            bg="brand.solid"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text fontSize="2xl" fontWeight="semibold" color="brand.contrast">
                                {initials(appointment.patient?.name)}
                            </Text>
                        </Flex>
                    </Flex>

                    <Box>
                        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="fg">
                            Sesión con {appointment.patient?.name ?? 'tu paciente'}
                        </Heading>
                    </Box>

                    {/* Not yet confirmed */}
                    {!isJoinable && (
                        <Text fontSize="sm" color="fg.muted">
                            Esta cita aún no ha sido confirmada. Confírmala antes de iniciar la sesión.
                        </Text>
                    )}

                    {/* Countdown — more than 5 min remaining */}
                    {isJoinable && !shouldJoin && (
                        <Stack gap="1" alignItems="center">
                            <Text
                                fontSize="4xl"
                                fontWeight="bold"
                                color="fg"
                                fontFamily="mono"
                                letterSpacing="wider"
                            >
                                {countdown.hh}:{countdown.mm}:{countdown.ss}
                            </Text>
                            <Text fontSize="sm" color="fg.muted">
                                Aún faltan {countdown.hh}:{countdown.mm}:{countdown.ss} para empezar
                            </Text>
                        </Stack>
                    )}

                    {/* Joining in progress */}
                    {isJoinable && joining && (
                        <Stack gap="3" alignItems="center">
                            <Spinner size="lg" color="brand.solid" />
                            <Text fontSize="sm" color="fg.muted">
                                Entrando a la sesión…
                            </Text>
                        </Stack>
                    )}

                    {/* Error + retry */}
                    {error && (
                        <Stack gap="2" alignItems="center">
                            <Text fontSize="sm" color="danger.fg">
                                {error}
                            </Text>
                            <Button variant="outline" size="sm" onClick={() => void handleJoin()}>
                                Reintentar
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </Flex>
        </>
    );
}

AppointmentWaiting.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
