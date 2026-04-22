import { Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import AppointmentShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types';

const ChakraLink = chakra(Link);

interface User {
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
    patient_joined_at: string | null;
    professional_joined_at: string | null;
    meeting_room_id: string | null;
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
    const { auth } = usePage<{ auth: Auth }>().props;
    const viewerIsProfessional = auth.user.id === appointment.professional_id;
    const other = viewerIsProfessional ? appointment.patient : appointment.professional;
    const message = viewerIsProfessional ? 'Esperando al paciente' : 'Esperando al profesional';
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
                                {initials(other?.name)}
                            </Text>
                        </Flex>
                    </Flex>

                    <Box>
                        <Heading as="h1" fontSize="2xl" fontWeight="bold" color="fg">
                            {message}
                        </Heading>
                        <Text mt="2" fontSize="md" color="fg.muted">
                            La sesión comenzará automáticamente cuando ambos estéis presentes.
                        </Text>
                    </Box>

                    <Flex alignItems="center" gap="1.5" aria-hidden="true">
                        <Box w="2" h="2" borderRadius="full" bg="brand.solid" animation="pulse 1.5s ease-in-out infinite" />
                        <Box w="2" h="2" borderRadius="full" bg="brand.solid" animation="pulse 1.5s ease-in-out infinite" style={{ animationDelay: '200ms' }} />
                        <Box w="2" h="2" borderRadius="full" bg="brand.solid" animation="pulse 1.5s ease-in-out infinite" style={{ animationDelay: '400ms' }} />
                    </Flex>

                    <ChakraLink href={AppointmentShowAction.url(appointment.id)}>
                        <Button variant="secondary" size="sm">
                            Cancelar
                        </Button>
                    </ChakraLink>
                </Stack>
            </Flex>
        </>
    );
}

AppointmentWaiting.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
