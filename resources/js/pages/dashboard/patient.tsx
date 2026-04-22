import { Box, Flex, Grid, Heading, Image, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { Bell, CalendarDays, Receipt, Video } from 'lucide-react';
import type { ReactNode } from 'react';
import AppointmentIndexAction from '@/actions/App/Http/Controllers/Appointment/IndexAction';
import AppointmentShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import InvoiceIndexAction from '@/actions/App/Http/Controllers/Invoice/IndexAction';
import InvoiceShowAction from '@/actions/App/Http/Controllers/Invoice/ShowAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraLink = chakra(Link);

interface UpcomingAppointment {
    id: number;
    scheduled_at: string;
    modality: string;
    status: string;
    professional: {
        id: number;
        name: string;
        specialty: string | null;
        avatar_path: string | null;
    };
    service_name: string | null;
}

interface RecentInvoice {
    id: number;
    amount: number;
    status: string;
    due_at: string | null;
    created_at: string | null;
}

interface PatientStats {
    upcoming_appointments: number;
    completed_sessions: number;
    pending_invoices: number;
}

interface Props {
    upcomingAppointments: UpcomingAppointment[];
    recentInvoices: RecentInvoice[];
    stats: PatientStats;
}

const formatDateTime = (dt: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dt));

const getModalityLabel = (modality: string): string => {
    const map: Record<string, string> = {
        in_person: 'Presencial',
        video_call: 'Videollamada',
        online: 'Online',
        telefono: 'Teléfono',
    };
    return map[modality?.toLowerCase()] ?? modality ?? 'Presencial';
};

const isOnlineModality = (modality: string): boolean =>
    ['video_call', 'online', 'telefono'].includes(modality?.toLowerCase());

const getInitials = (name: string): string =>
    name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

const formatInvoiceNumber = (id: number): string =>
    `#INV-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`;

const getDueDays = (dueAt: string | null): number | null => {
    if (!dueAt) return null;
    const due = new Date(dueAt);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const appointmentStatusLabel: Record<string, string> = {
    confirmed: 'Confirmada',
    pending: 'Pendiente',
    scheduled: 'Programada',
    cancelled: 'Cancelada',
};

export default function PatientDashboard({ upcomingAppointments, recentInvoices }: Props) {
    const nextAppointment = upcomingAppointments[0] ?? null;
    const otherAppointments = upcomingAppointments.slice(1);

    return (
        <>
            <Head title="Inicio — ClientKosmos" />

            <Stack gap="16" px="8" pt="14" pb="8">

                {/* ── Header section ── */}
                <Stack gap="13">

                    {/* Title row */}
                    <Flex alignItems="center" justifyContent="space-between">
                        <Heading
                            as="h1"
                            fontSize="4xl"
                            fontWeight="bold"
                            color="fg"
                            letterSpacing="-0.48px"
                        >
                            Tu próxima cita
                        </Heading>
                        <Box
                            as="button"
                            bg="white"
                            borderWidth="1px"
                            borderColor="border"
                            p="3"
                            borderRadius="lg"
                            cursor="pointer"
                            _hover={{ bg: 'bg.subtle' }}
                            transition="background 0.2s"
                        >
                            <Box as={Bell} w="5" h="5" color="fg.muted" />
                        </Box>
                    </Flex>

                    {/* Hero card: next session */}
                    {nextAppointment ? (
                        <Box
                            bg="white"
                            borderRadius="xl"
                            boxShadow="0px 2px 23.5px 5px rgba(12,29,42,0.19)"
                            p="8"
                            position="relative"
                            overflow="hidden"
                            minH="297px"
                            display="flex"
                            alignItems="center"
                            maxW="821px"
                        >
                            {/* Left content */}
                            <Stack gap="6" position="relative" zIndex={1} maxW="55%">
                                {/* Badge */}
                                <Box
                                    display="inline-flex"
                                    bg="#93f0e0"
                                    px="3"
                                    py="1"
                                    borderRadius="full"
                                    alignSelf="flex-start"
                                >
                                    <Text
                                        fontSize="10px"
                                        fontWeight="bold"
                                        color="#006f63"
                                        textTransform="uppercase"
                                        letterSpacing="1px"
                                    >
                                        Tu próxima sesión
                                    </Text>
                                </Box>

                                {/* Doctor info */}
                                <Stack gap="1">
                                    <Heading fontSize="3xl" fontWeight="bold" color="fg">
                                        {nextAppointment.professional.name}
                                    </Heading>
                                    <Flex alignItems="center" gap="2">
                                        <Box as={CalendarDays} w="3.5" h="3.5" color="fg.muted" flexShrink={0} />
                                        <Text fontSize="md" color="fg.muted">
                                            {formatDateTime(nextAppointment.scheduled_at)}
                                        </Text>
                                    </Flex>
                                </Stack>

                                {/* CTA button */}
                                <Button asChild variant="primary" size="lg" alignSelf="flex-start">
                                    <ChakraLink href={AppointmentShowAction.url(nextAppointment.id)}>
                                        <Box as={Video} w="4" h="3" mr="1.5" />
                                        {isOnlineModality(nextAppointment.modality) ? 'Join Session' : 'Ver cita'}
                                    </ChakraLink>
                                </Button>
                            </Stack>

                            {/* Right: doctor avatar / photo */}
                            <Box
                                position="absolute"
                                top="0"
                                left="50%"
                                right="0"
                                bottom="0"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                overflow="hidden"
                            >
                                {nextAppointment.professional.avatar_path ? (
                                    <Image
                                        src={nextAppointment.professional.avatar_path}
                                        alt={nextAppointment.professional.name}
                                        fit="cover"
                                        w="full"
                                        h="121%"
                                        mt="-10%"
                                    />
                                ) : (
                                    <Flex
                                        w="36"
                                        h="36"
                                        borderRadius="full"
                                        bg="brand.subtle"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontSize="4xl"
                                        fontWeight="bold"
                                        color="brand.solid"
                                        flexShrink={0}
                                    >
                                        {getInitials(nextAppointment.professional.name)}
                                    </Flex>
                                )}
                                {/* Left-to-right gradient overlay */}
                                <Box
                                    position="absolute"
                                    inset="0"
                                    style={{
                                        background: 'linear-gradient(to right, white 0%, white 15%, transparent 55%)',
                                    }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            bg="white"
                            borderRadius="xl"
                            p="10"
                            textAlign="center"
                            borderWidth="1px"
                            borderColor="border"
                            maxW="821px"
                        >
                            <Box as={CalendarDays} w="10" h="10" mx="auto" mb="3" color="fg.subtle" />
                            <Text color="fg.muted">No tienes citas próximas programadas.</Text>
                        </Box>
                    )}
                </Stack>

                {/* ── Bottom two-column sections ── */}
                <Grid
                    templateColumns={{ base: '1fr', lg: '5fr 6fr' }}
                    gap={{ base: '10', lg: '12' }}
                >
                    {/* Left: Próximas citas */}
                    <Stack gap="6">
                        <Flex alignItems="center" justifyContent="space-between">
                            <Heading
                                fontSize="2xl"
                                fontWeight="bold"
                                color="fg"
                                letterSpacing="-0.48px"
                            >
                                Próximas citas
                            </Heading>
                            <ChakraLink
                                href={AppointmentIndexAction.url()}
                                fontSize="sm"
                                fontWeight="bold"
                                color="brand.solid"
                                _hover={{ textDecoration: 'underline' }}
                            >
                                Ver todos
                            </ChakraLink>
                        </Flex>

                        <Stack gap="4">
                            {otherAppointments.length === 0 ? (
                                <Box
                                    bg="bg.surface"
                                    borderRadius="xl"
                                    p="6"
                                    textAlign="center"
                                    boxShadow="sm"
                                >
                                    <Box as={CalendarDays} w="7" h="7" mx="auto" mb="2" color="fg.subtle" />
                                    <Text fontSize="sm" color="fg.muted">
                                        Sin más citas próximas.
                                    </Text>
                                </Box>
                            ) : (
                                otherAppointments.map((apt) => (
                                    <Box
                                        key={apt.id}
                                        bg="bg.surface"
                                        borderRadius="xl"
                                        p="6"
                                        boxShadow="sm"
                                    >
                                        <Flex alignItems="flex-start" justifyContent="space-between">
                                            <Stack gap="1">
                                                <Heading
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    color="fg"
                                                    letterSpacing="-0.36px"
                                                    lineHeight="short"
                                                >
                                                    {apt.professional.name}
                                                </Heading>
                                                <Text fontSize="sm" color="fg.muted">
                                                    {getModalityLabel(apt.modality)}
                                                </Text>
                                            </Stack>
                                            <Box
                                                bg="brand.subtle"
                                                color="brand.solid"
                                                borderRadius="md"
                                                px="2.5"
                                                py="1"
                                                fontSize="2xs"
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                                flexShrink={0}
                                            >
                                                {appointmentStatusLabel[apt.status] ?? apt.status}
                                            </Box>
                                        </Flex>
                                        <Text fontSize="xs" color="fg.muted" mt="3">
                                            {formatDateTime(apt.scheduled_at)}
                                        </Text>
                                    </Box>
                                ))
                            )}
                        </Stack>
                    </Stack>

                    {/* Right: Facturas pendientes */}
                    <Stack gap="6">
                        <Flex alignItems="center" justifyContent="space-between">
                            <Heading
                                fontSize="2xl"
                                fontWeight="bold"
                                color="fg"
                                letterSpacing="-0.48px"
                            >
                                Facturas pendientes
                            </Heading>
                            <ChakraLink
                                href={InvoiceIndexAction.url()}
                                fontSize="sm"
                                fontWeight="bold"
                                color="brand.solid"
                                _hover={{ textDecoration: 'underline' }}
                            >
                                Ver todos
                            </ChakraLink>
                        </Flex>

                        <Stack gap="4">
                            {recentInvoices.length === 0 ? (
                                <Box
                                    bg="bg.surface"
                                    borderRadius="xl"
                                    p="6"
                                    textAlign="center"
                                    boxShadow="sm"
                                >
                                    <Box as={Receipt} w="7" h="7" mx="auto" mb="2" color="fg.subtle" />
                                    <Text fontSize="sm" color="fg.muted">
                                        No hay facturas pendientes.
                                    </Text>
                                </Box>
                            ) : (
                                recentInvoices.map((invoice) => {
                                    const dueDays = getDueDays(invoice.due_at);
                                    const isUrgent =
                                        invoice.status === 'overdue' ||
                                        (dueDays !== null && dueDays <= 3 && dueDays >= 0);

                                    return (
                                        <Flex
                                            key={invoice.id}
                                            bg={isUrgent ? '#ffecec' : 'bg.surface'}
                                            borderRadius="xl"
                                            p="6"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            boxShadow="sm"
                                        >
                                            {/* Left: icon + invoice info */}
                                            <Flex alignItems="center" gap="5">
                                                <Flex
                                                    w="12"
                                                    h="12"
                                                    borderRadius="xl"
                                                    bg="brand.subtle"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexShrink={0}
                                                >
                                                    <Box as={Receipt} w="4" h="5" color="brand.solid" />
                                                </Flex>
                                                <Stack gap="0.5">
                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="bold"
                                                        color="fg.subtle"
                                                        textTransform="uppercase"
                                                        letterSpacing="wider"
                                                    >
                                                        {formatInvoiceNumber(invoice.id)}
                                                    </Text>
                                                    <Text fontSize="xs" color="fg.muted">
                                                        {invoice.created_at
                                                            ? new Intl.DateTimeFormat('es-ES', {
                                                                  day: 'numeric',
                                                                  month: 'short',
                                                                  year: 'numeric',
                                                              }).format(new Date(invoice.created_at))
                                                            : '—'}
                                                    </Text>
                                                </Stack>
                                            </Flex>

                                            {/* Right: amount + due label + pay button */}
                                            <Flex alignItems="center" gap="6">
                                                <Stack gap="0.5" alignItems="flex-end">
                                                    <Text fontSize="xl" fontWeight="bold" color="fg">
                                                        {Number(invoice.amount).toLocaleString('es-ES', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{' '}
                                                        €
                                                    </Text>
                                                    {dueDays !== null && (
                                                        <Text
                                                            fontSize="2xs"
                                                            fontWeight="bold"
                                                            textTransform="uppercase"
                                                            letterSpacing="wider"
                                                            color={
                                                                dueDays <= 0 || invoice.status === 'overdue'
                                                                    ? 'danger.solid'
                                                                    : 'fg.subtle'
                                                            }
                                                        >
                                                            {dueDays <= 0 || invoice.status === 'overdue'
                                                                ? 'VENCIDA'
                                                                : `VENCE EN ${dueDays} DÍA${dueDays === 1 ? '' : 'S'}`}
                                                        </Text>
                                                    )}
                                                </Stack>
                                                <Button asChild variant="primary" size="sm">
                                                    <ChakraLink href={InvoiceShowAction.url(invoice.id)}>
                                                        Pagar
                                                    </ChakraLink>
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    );
                                })
                            )}
                        </Stack>
                    </Stack>
                </Grid>
            </Stack>
        </>
    );
}

PatientDashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
