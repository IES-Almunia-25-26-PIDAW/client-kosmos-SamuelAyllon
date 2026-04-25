import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import { Head, router, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { LiveTranscriptPanel } from '@/components/live-transcript-panel';
import { RecordingIndicator } from '@/components/recording-indicator';
import { useProfessionalTabRecorder } from '@/hooks/use-professional-tab-recorder';
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

export default function CallRoom({ appointment, exitUrl }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isProfessional = auth.user.id === appointment.professional_id;

    const recorder = useProfessionalTabRecorder({ appointmentId: appointment.id });

    const handleOpenMeet = () => {
        if (appointment.meeting_url) {
            window.open(appointment.meeting_url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleEndSession = () => {
        if (recorder.status === 'recording') recorder.stopRecording();
        router.post(
            `/appointments/${appointment.id}/end-call`,
            {},
            { onFinish: () => { window.location.href = exitUrl; } },
        );
    };

    return (
        <>
            <Head title="Videoconsulta" />

            <Flex h="100vh" w="100vw" overflow="hidden" bg="gray.950" direction={{ base: 'column', lg: 'row' }}>
                {/* Left panel: controls */}
                <Flex
                    direction="column"
                    flex="1"
                    alignItems="center"
                    justifyContent="center"
                    gap="6"
                    p="8"
                    bg="gray.900"
                >
                    <Stack alignItems="center" gap="2" textAlign="center">
                        <Text fontSize="xl" fontWeight="bold" color="white">
                            Sesión en curso
                        </Text>
                        <Text fontSize="sm" color="whiteAlpha.600">
                            {isProfessional
                                ? `Con ${appointment.patient?.name}`
                                : `Con ${appointment.professional?.name}`}
                        </Text>
                    </Stack>

                    {appointment.meeting_url && (
                        <Button
                            colorPalette="blue"
                            variant="solid"
                            size="lg"
                            onClick={handleOpenMeet}
                        >
                            Abrir Google Meet
                        </Button>
                    )}

                    {isProfessional && (
                        <Stack alignItems="center" gap="3">
                            {recorder.status === 'idle' || recorder.status === 'error' ? (
                                <Button
                                    colorPalette="green"
                                    variant="solid"
                                    onClick={() => void recorder.startRecording()}
                                >
                                    Comenzar grabación
                                </Button>
                            ) : recorder.status === 'permission_pending' ? (
                                <Button colorPalette="gray" variant="subtle" loading disabled>
                                    Esperando permiso...
                                </Button>
                            ) : (
                                <Stack alignItems="center" gap="2">
                                    <RecordingIndicator />
                                    <Text fontSize="xs" color="whiteAlpha.500">
                                        {recorder.chunksUploaded} segmentos transcritos
                                    </Text>
                                    <Button
                                        colorPalette="red"
                                        variant="subtle"
                                        size="sm"
                                        onClick={recorder.stopRecording}
                                    >
                                        Pausar grabación
                                    </Button>
                                </Stack>
                            )}

                            {recorder.error && (
                                <Text fontSize="xs" color="red.300">
                                    {recorder.error}
                                </Text>
                            )}
                        </Stack>
                    )}

                    <Button
                        colorPalette="red"
                        variant="solid"
                        mt="4"
                        onClick={handleEndSession}
                    >
                        {isProfessional ? 'Finalizar sesión' : 'Salir de la sesión'}
                    </Button>
                </Flex>

                {/* Right panel: live transcript (professional only) */}
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
