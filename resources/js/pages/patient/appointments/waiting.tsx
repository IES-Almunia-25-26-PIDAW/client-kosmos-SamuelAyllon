import { Alert, Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { JoinCallButton } from '@/components/join-call-button';
import AppLayout from '@/layouts/app-layout';

interface Appointment {
    id: number;
    status: string;
    starts_at: string;
    ends_at: string;
    meeting_url: string | null;
    meeting_room_id: string | null;
    patient_joined_at: string | null;
    professional_joined_at: string | null;
    professional: { id: number; name: string; avatar_path: string | null } | null;
}

interface Props {
    appointment: Appointment;
}

export default function PatientAppointmentWaiting({ appointment }: Props) {
    return (
        <>
            <Head title="Sala de espera" />

            <Flex flex="1" alignItems="center" justifyContent="center" p="8" minH="70vh">
                <Stack gap="8" alignItems="center" textAlign="center" maxW="md">
                    <Flex position="relative" alignItems="center" justifyContent="center">
                        <Box
                            position="absolute"
                            display="inline-flex"
                            h="24"
                            w="24"
                            borderRadius="full"
                            bg="brand.solid"
                            opacity={0.2}
                            animation="ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite"
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
                            <Box
                                w="2.5"
                                h="2.5"
                                borderRadius="full"
                                bg="brand.contrast"
                                animation="pulse 1.4s ease-in-out infinite"
                            />
                        </Flex>
                    </Flex>

                    <Stack gap="2">
                        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="fg">
                            Tu sesión con {appointment.professional?.name ?? 'tu profesional'}
                        </Heading>
                        <Text fontSize="md" color="fg.muted">
                            El botón se habilitará 10 minutos antes del inicio.
                        </Text>
                    </Stack>

                    <JoinCallButton appointment={appointment} role="patient" />

                    <Alert.Root status="info" variant="subtle" borderRadius="md" textAlign="left">
                        <Alert.Indicator />
                        <Alert.Description fontSize="xs" color="fg.muted">
                            Esta sesión será grabada y transcrita automáticamente por la IA de ClientKosmos para apoyar a tu profesional.
                            Puedes revocar este consentimiento desde tu perfil en cualquier momento.
                        </Alert.Description>
                    </Alert.Root>
                </Stack>
            </Flex>
        </>
    );
}

PatientAppointmentWaiting.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
