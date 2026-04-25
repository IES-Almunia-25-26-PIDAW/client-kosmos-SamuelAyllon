import { Box, Text } from '@chakra-ui/react';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import StartCallAction from '@/actions/App/Http/Controllers/Appointment/StartCallAction';
import JoinCallAction from '@/actions/App/Http/Controllers/Portal/Appointment/JoinCallAction';
import { Button } from '@/components/ui/button';
import { useCountdown } from '@/hooks/use-countdown';
import axios from '@/lib/axios';

interface Appointment {
    id: number;
    starts_at: string;
    ends_at: string;
    meeting_url: string | null;
    meeting_room_id: string | null;
}

interface Props {
    appointment: Appointment;
    role: 'professional' | 'patient';
}

export function JoinCallButton({ appointment, role }: Props) {
    const opensAt = useMemo(
        () => new Date(new Date(appointment.starts_at).getTime() - 10 * 60 * 1000),
        [appointment.starts_at],
    );
    const endsAt = useMemo(
        () => new Date(new Date(appointment.ends_at).getTime() + 15 * 60 * 1000),
        [appointment.ends_at],
    );
    const countdown = useCountdown(opensAt);
    const { isPast: isExpired } = useCountdown(endsAt);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isOpen = countdown.isPast && !isExpired;

    const handleJoin = async () => {
        setLoading(true);
        setError(null);
        try {
            if (role === 'professional') {
                const { data } = await axios.post<{ room_id: string; meeting_url: string | null }>(
                    StartCallAction.url(appointment.id),
                );
                if (data.meeting_url) window.open(data.meeting_url, '_blank', 'noopener,noreferrer');
                if (data.room_id) router.visit(`/call/${data.room_id}`);
            } else {
                const { data } = await axios.post<{
                    room_id?: string;
                    meeting_url?: string | null;
                    redirect?: string;
                }>(JoinCallAction.url(appointment.id));

                const meetUrl = data.meeting_url ?? appointment.meeting_url;
                if (meetUrl) window.open(meetUrl, '_blank', 'noopener,noreferrer');
                if (data.room_id) {
                    router.visit(`/call/${data.room_id}`);
                } else {
                    router.reload({ only: ['appointment'] });
                }
            }
        } catch (e: unknown) {
            const msg =
                e instanceof Error
                    ? e.message
                    : 'No se pudo conectar. Inténtalo de nuevo.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (isExpired) {
        return (
            <Text fontSize="sm" color="fg.muted">
                La sesión ya ha finalizado.
            </Text>
        );
    }

    if (!isOpen) {
        return (
            <Box textAlign="center">
                <Button variant="outline" disabled size="lg" minW="56">
                    Disponible en {countdown.hh}:{countdown.mm}:{countdown.ss}
                </Button>
                {error && (
                    <Text mt="2" fontSize="sm" color="red.500">
                        {error}
                    </Text>
                )}
            </Box>
        );
    }

    const label = role === 'professional' ? 'Iniciar sesión' : 'Unirse a la llamada';

    return (
        <Box textAlign="center">
            <Button variant="primary" size="lg" minW="56" loading={loading} onClick={() => void handleJoin()}>
                {label}
            </Button>
            {error && (
                <Text mt="2" fontSize="sm" color="red.500">
                    {error}
                </Text>
            )}
        </Box>
    );
}
