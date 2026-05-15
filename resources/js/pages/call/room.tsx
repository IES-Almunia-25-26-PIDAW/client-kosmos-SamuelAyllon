import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Flex,
    HStack,
    Separator,
    Stack,
    Status,
    Text,
} from '@chakra-ui/react';
import { Head, usePage } from '@inertiajs/react';
import { Circle, ExternalLink, PhoneOff, Square } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { LiveTranscriptPanel } from '@/components/live-transcript-panel';
import { RecordingIndicator } from '@/components/recording-indicator';
import { useProfessionalTabRecorder } from '@/hooks/use-professional-tab-recorder';
import axios from '@/lib/axios';
import type { Auth } from '@/types';

interface AppointmentUser {
    id: number;
    name: string;
    email: string;
    avatar_path: string | null;
}

interface Appointment {
    id: number;
    status: string;
    patient_id: number;
    professional_id: number;
    starts_at: string;
    ends_at: string;
    meeting_room_id: string;
    meeting_url: string | null;
    patient: AppointmentUser;
    professional: AppointmentUser;
}

interface Props {
    appointment: Appointment;
    exitUrl: string;
}

function useSessionTimer(): string {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(id);
    }, []);
    const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const s = (elapsed % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export default function CallRoom({ appointment, exitUrl }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isProfessional = auth.user.id === appointment.professional_id;
    const recorder = useProfessionalTabRecorder({ appointmentId: appointment.id });
    const timer = useSessionTimer();

    const other = isProfessional ? appointment.patient : appointment.professional;

    const handleOpenMeet = () => {
        if (isProfessional && recorder.status === 'idle') {
            void recorder.startRecording();
        }
        if (appointment.meeting_url) {
            window.open(appointment.meeting_url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleEndSession = async () => {
        if (recorder.status === 'recording') recorder.stopRecording();
        try {
            await axios.post(`/appointments/${appointment.id}/end-call`);
        } catch {
            // navigate out even on failure
        }
        window.location.href = exitUrl;
    };

    return (
        <>
            <Head title="Videoconsulta" />

            <Flex h="100vh" w="100vw" overflow="hidden" bg="gray.950" direction={{ base: 'column', lg: 'row' }}>
                {/* Left: control panel */}
                <Flex direction="column" flex="1" bg="gray.900" overflow="hidden">
                    {/* Session header */}
                    <HStack
                        px="6"
                        py="4"
                        borderBottomWidth="1px"
                        borderColor="whiteAlpha.100"
                        justify="space-between"
                    >
                        <HStack gap="2">
                            <Status.Root colorPalette="green" size="sm">
                                <Status.Indicator />
                            </Status.Root>
                            <Text fontSize="sm" fontWeight="medium" color="whiteAlpha.800">
                                Sesión activa
                            </Text>
                        </HStack>
                        <Text fontSize="sm" fontFamily="mono" color="whiteAlpha.500" minW="10" textAlign="right">
                            {timer}
                        </Text>
                    </HStack>

                    {/* Participant hero */}
                    <Flex flex="1" direction="column" alignItems="center" justifyContent="center" gap="5" px="8">
                        <Avatar.Root size="2xl" colorPalette="brand">
                            <Avatar.Image src={other.avatar_path ?? undefined} />
                            <Avatar.Fallback name={other.name} />
                        </Avatar.Root>
                        <Stack gap="1" textAlign="center">
                            <Text fontSize="xl" fontWeight="bold" color="white">
                                {other.name}
                            </Text>
                            <Text fontSize="sm" color="whiteAlpha.500">
                                {other.email}
                            </Text>
                        </Stack>
                    </Flex>

                    {/* Controls card */}
                    <Box p="6">
                        <Card.Root bg="gray.800" borderColor="whiteAlpha.100" variant="outline">
                            <Card.Body p="5" gap="4">
                                {appointment.meeting_url && (
                                    <Button
                                        colorPalette="blue"
                                        variant="solid"
                                        size="lg"
                                        w="full"
                                        onClick={handleOpenMeet}
                                    >
                                        <ExternalLink />
                                        Abrir Google Meet
                                    </Button>
                                )}

                                {isProfessional && (
                                    <>
                                        <Separator borderColor="whiteAlpha.100" />

                                        {recorder.status === 'idle' || recorder.status === 'error' ? (
                                            <Button
                                                colorPalette="green"
                                                variant="subtle"
                                                w="full"
                                                onClick={() => void recorder.startRecording()}
                                            >
                                                <Circle />
                                                Iniciar grabación
                                            </Button>
                                        ) : recorder.status === 'permission_pending' ? (
                                            <Button colorPalette="gray" variant="subtle" loading disabled w="full">
                                                Esperando permiso...
                                            </Button>
                                        ) : (
                                            <Stack gap="3">
                                                <HStack justify="space-between">
                                                    <RecordingIndicator />
                                                    <Text fontSize="xs" color="whiteAlpha.400">
                                                        {recorder.chunksUploaded} segmentos transcritos
                                                    </Text>
                                                </HStack>
                                                <Button
                                                    colorPalette="red"
                                                    variant="outline"
                                                    size="sm"
                                                    w="full"
                                                    onClick={recorder.stopRecording}
                                                >
                                                    <Square />
                                                    Pausar grabación
                                                </Button>
                                            </Stack>
                                        )}

                                        {recorder.error && (
                                            <Alert.Root colorPalette="red" variant="subtle" borderRadius="md">
                                                <Alert.Indicator />
                                                <Alert.Content>
                                                    <Alert.Description fontSize="xs">
                                                        {recorder.error}
                                                    </Alert.Description>
                                                </Alert.Content>
                                            </Alert.Root>
                                        )}
                                    </>
                                )}

                                <Separator borderColor="whiteAlpha.100" />

                                <Button
                                    colorPalette="red"
                                    variant="solid"
                                    w="full"
                                    onClick={() => void handleEndSession()}
                                >
                                    <PhoneOff />
                                    {isProfessional ? 'Finalizar sesión' : 'Salir de la sesión'}
                                </Button>
                            </Card.Body>
                        </Card.Root>
                    </Box>
                </Flex>

                {/* Right: live transcript panel (professional only) */}
                {isProfessional && (
                    <LiveTranscriptPanel
                        appointmentId={appointment.id}
                        professionalId={appointment.professional_id}
                        patientId={appointment.patient_id}
                    />
                )}
            </Flex>
        </>
    );
}

CallRoom.layout = (page: ReactNode) => <>{page}</>;
