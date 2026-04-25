import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { JoinCallButton } from '@/components/join-call-button';
import AppLayout from '@/layouts/app-layout';

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

const initials = (name: string | undefined) =>
    (name ?? '?')
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase();

export default function AppointmentWaiting({ appointment }: Props) {
    return (
        <>
            <Head title="Sala de espera" />

            <Flex flex="1" alignItems="center" justifyContent="center" p="8" minH="70vh">
                <Stack gap="6" alignItems="center" textAlign="center" maxW="md">
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
                        <Text mt="2" fontSize="md" color="fg.muted">
                            El botón se habilitará 10 minutos antes del inicio.
                        </Text>
                    </Box>

                    <JoinCallButton appointment={appointment} role="professional" />
                </Stack>
            </Flex>
        </>
    );
}

AppointmentWaiting.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
