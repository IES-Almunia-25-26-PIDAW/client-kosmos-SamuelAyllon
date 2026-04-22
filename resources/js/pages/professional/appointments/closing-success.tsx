import { Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, FileText, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Dashboard/IndexAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraLink = chakra(Link);

interface Patient {
    id: number;
    name: string;
    avatar_path: string | null;
}

interface Appointment {
    id: number;
    status: string;
    patient: Patient | null;
}

interface Props {
    appointment: Appointment;
}

const REDIRECT_SECONDS = 15;

export default function ProfessionalAppointmentClosingSuccess({ appointment }: Props) {
    const [remaining, setRemaining] = useState(REDIRECT_SECONDS);
    const dashboardUrl = DashboardIndexAction.url();

    useEffect(() => {
        if (remaining <= 0) {
            window.location.href = dashboardUrl;
            return;
        }
        const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
        return () => clearTimeout(id);
    }, [remaining, dashboardUrl]);

    const patientName = appointment.patient?.name ?? 'tu paciente';

    return (
        <>
            <Head title="Sesión cerrada — ClientKosmos" />

            <Flex flex="1" alignItems="center" justifyContent="center" px={{ base: '6', lg: '8' }} py="12" minH="80vh">
                <Stack gap="10" alignItems="center" textAlign="center" maxW="lg" w="full">
                    <Flex position="relative" alignItems="center" justifyContent="center" w="40" h="40">
                        <Box
                            position="absolute"
                            inset="0"
                            borderRadius="full"
                            borderWidth="2px"
                            borderColor="brand.solid"
                            opacity={0.25}
                        />
                        <Box
                            position="absolute"
                            inset="4"
                            borderRadius="full"
                            borderWidth="2px"
                            borderColor="brand.solid"
                            opacity={0.45}
                        />
                        <Flex
                            position="relative"
                            w="24"
                            h="24"
                            borderRadius="full"
                            bg="brand.subtle"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box as={CheckCircle2} w="10" h="10" color="brand.solid" aria-hidden={true} />
                        </Flex>
                    </Flex>

                    <Stack gap="3">
                        <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" color="brand.solid" letterSpacing="-0.02em" lineHeight="1.1">
                            Sesión cerrada
                            <br />
                            correctamente
                        </Heading>
                        <Text fontSize="md" color="fg.muted" maxW="md" mx="auto">
                            Buen trabajo. Hemos enviado la factura y los acuerdos a {patientName} automáticamente.
                        </Text>
                    </Stack>

                    <Stack gap="3" w="full" maxW="sm">
                        <Flex
                            alignItems="center"
                            gap="3"
                            bg="bg.surface"
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor="border.subtle"
                            px="4"
                            py="3"
                            textAlign="left"
                        >
                            <Flex
                                w="9"
                                h="9"
                                borderRadius="lg"
                                bg="brand.subtle"
                                color="brand.solid"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                                aria-hidden={true}
                            >
                                <Box as={Mail} w="4" h="4" />
                            </Flex>
                            <Text fontSize="sm" color="fg">
                                La <Text as="span" fontWeight="semibold">factura</Text> se ha enviado al paciente desde tu Gmail.
                            </Text>
                        </Flex>

                        <Flex
                            alignItems="center"
                            gap="3"
                            bg="bg.surface"
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor="border.subtle"
                            px="4"
                            py="3"
                            textAlign="left"
                        >
                            <Flex
                                w="9"
                                h="9"
                                borderRadius="lg"
                                bg="brand.subtle"
                                color="brand.solid"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                                aria-hidden={true}
                            >
                                <Box as={FileText} w="4" h="4" />
                            </Flex>
                            <Text fontSize="sm" color="fg">
                                Las <Text as="span" fontWeight="semibold">notas y el resumen IA</Text> quedan guardados en el historial.
                            </Text>
                        </Flex>
                    </Stack>

                    <Stack gap="2" alignItems="center" w="full">
                        <Button asChild variant="primary" size="lg">
                            <ChakraLink href={dashboardUrl}>Volver al dashboard</ChakraLink>
                        </Button>
                        <Text fontSize="xs" color="fg.subtle">
                            Redirigiendo automáticamente en {remaining}s
                        </Text>
                    </Stack>
                </Stack>
            </Flex>
        </>
    );
}

ProfessionalAppointmentClosingSuccess.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
