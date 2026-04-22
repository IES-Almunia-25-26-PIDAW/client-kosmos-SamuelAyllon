import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import type { IJitsiMeetExternalApi } from '@jitsi/react-sdk/lib/types';
import type { ReactNode } from 'react';
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
    patient: AppointmentUser;
    professional: AppointmentUser;
}

interface Props {
    appointment: Appointment;
    jitsiDomain: string;
    jitsiRoomName: string;
    exitUrl: string;
}

function LoadingScreen() {
    return (
        <Flex h="100vh" w="100%" alignItems="center" justifyContent="center" bg="black" direction="column" gap="4">
            <Spinner size="xl" color="white" />
            <Text color="whiteAlpha.700" fontSize="sm">
                Conectando a la videoconsulta...
            </Text>
        </Flex>
    );
}

export default function CallRoom({ appointment, jitsiDomain, jitsiRoomName, exitUrl }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const isProfessional = auth.user.id === appointment.professional_id;

    const handleApiReady = (api: IJitsiMeetExternalApi) => {
        // Cuando el usuario cierra la sala o hace clic en "Colgar"
        api.addEventListener('readyToClose', () => {
            if (isProfessional) {
                // El profesional finaliza la cita al salir
                router.post(
                    `/appointments/${appointment.id}/end-call`,
                    {},
                    {
                        onFinish: () => {
                            window.location.href = exitUrl;
                        },
                    },
                );
            } else {
                window.location.href = exitUrl;
            }
        });
    };

    return (
        <>
            <Head title="Videoconsulta" />

            <Box h="100vh" w="100vw" overflow="hidden" bg="black">
                <JitsiMeeting
                    domain={jitsiDomain}
                    roomName={jitsiRoomName}
                    configOverwrite={{
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        disableModeratorIndicator: true,
                        enableWelcomePage: false,
                        prejoinPageEnabled: false,
                        enableEmailInRegistration: false,
                        disableDeepLinking: true,
                        // Mostrar solo los controles esenciales
                        toolbarButtons: [
                            'microphone',
                            'camera',
                            'desktop',
                            'chat',
                            'hangup',
                            'tileview',
                        ],
                    }}
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
                        MOBILE_APP_PROMO: false,
                    }}
                    userInfo={{
                        displayName: auth.user.name,
                        email: auth.user.email,
                    }}
                    spinner={LoadingScreen}
                    onApiReady={handleApiReady}
                    getIFrameRef={(node) => {
                        node.style.height = '100vh';
                        node.style.width = '100%';
                        node.style.border = 'none';
                    }}
                />
            </Box>
        </>
    );
}

// Sin layout: Jitsi ocupa toda la ventana
CallRoom.layout = (page: ReactNode) => <>{page}</>;
