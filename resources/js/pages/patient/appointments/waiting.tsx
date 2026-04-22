import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Appointment {
    id: number;
    status: string;
    meeting_room_id: string | null;
    patient_joined_at: string | null;
    professional_joined_at: string | null;
    professional: { id: number; name: string; avatar_path: string | null } | null;
}

interface Props {
    appointment: Appointment;
}

export default function PatientAppointmentWaiting({ appointment }: Props) {
    const bothPresent = !!appointment.patient_joined_at && !!appointment.professional_joined_at;

    useEffect(() => {
        const id = setInterval(() => {
            router.reload({ only: ['appointment'], preserveUrl: true });
        }, 4000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (bothPresent && appointment.meeting_room_id) {
            window.location.href = `/call/${appointment.meeting_room_id}`;
        }
    }, [bothPresent, appointment.meeting_room_id]);

    return (
        <>
            <Head title="Esperando al profesional" />

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
                            Esperando al profesional
                        </Heading>
                        <Text fontSize="md" color="fg.muted">
                            Tu sesión comenzará automáticamente en cuanto {appointment.professional?.name ?? 'tu profesional'} se una.
                        </Text>
                    </Stack>

                    <Flex alignItems="center" gap="1.5" aria-hidden="true">
                        <Box w="2" h="2" borderRadius="full" bg="brand.solid" animation="pulse 1.4s ease-in-out infinite" />
                        <Box
                            w="2"
                            h="2"
                            borderRadius="full"
                            bg="brand.solid"
                            animation="pulse 1.4s ease-in-out infinite"
                            style={{ animationDelay: '200ms' }}
                        />
                        <Box
                            w="2"
                            h="2"
                            borderRadius="full"
                            bg="brand.solid"
                            animation="pulse 1.4s ease-in-out infinite"
                            style={{ animationDelay: '400ms' }}
                        />
                    </Flex>
                </Stack>
            </Flex>
        </>
    );
}

PatientAppointmentWaiting.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
