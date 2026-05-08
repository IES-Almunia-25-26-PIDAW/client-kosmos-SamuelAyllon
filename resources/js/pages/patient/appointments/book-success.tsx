import { Box, Circle, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { Leaf } from 'lucide-react';
import type { ReactNode } from 'react';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Portal/Dashboard/IndexAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

export default function PatientAppointmentBookSuccess() {
    return (
        <>
            <Head title="Reserva completada — ClientKosmos" />

            <Flex
                id="main-content"
                tabIndex={-1}
                direction="column"
                align="center"
                justify="center"
                minH="70vh"
                px="6"
                py="16"
            >
                {/* Concentric rings + icon */}
                <Box position="relative" mb="10">
                    <Circle
                        size="36"
                        borderWidth="2px"
                        borderColor="brand.subtle"
                        bg="transparent"
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                    />
                    <Circle
                        size="28"
                        borderWidth="2px"
                        borderColor="brand.subtle"
                        bg="transparent"
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                    />
                    <Circle size="20" bg="blue.50">
                        <Box as={Leaf} w="8" h="8" color="brand.solid" aria-hidden />
                    </Circle>
                </Box>

                <Stack gap="6" align="center" textAlign="center" maxW="sm">
                    <Heading
                        as="h1"
                        fontSize={{ base: '3xl', md: '4xl' }}
                        fontWeight="bold"
                        color="brand.solid"
                        letterSpacing="-0.5px"
                        lineHeight="tight"
                    >
                        Reserva completada
                        <Text as="span" display="block">
                            con éxito
                        </Text>
                    </Heading>

                    <Button asChild variant="primary" size="md">
                        <Link href={DashboardIndexAction.url()}>Volver al inicio</Link>
                    </Button>
                </Stack>
            </Flex>
        </>
    );
}

PatientAppointmentBookSuccess.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
