import { Badge, Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { Bell, CalendarDays, FileText, Video } from 'lucide-react';
import type { ReactNode } from 'react';
import AppointmentIndexAction from '@/actions/App/Http/Controllers/Appointment/IndexAction';
import AppointmentShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import InvoiceIndexAction from '@/actions/App/Http/Controllers/Invoice/IndexAction';
import InvoiceShowAction from '@/actions/App/Http/Controllers/Invoice/ShowAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraLink = chakra(Link);
const ChakraImg = chakra('img');

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

interface Agreement {
    id: number;
    title: string;
    therapist_name: string;
    status: 'in_progress' | 'completed';
    progress: number;
}

interface PatientStats {
    upcoming_appointments: number;
    completed_sessions: number;
    pending_invoices: number;
}

interface Props {
    upcomingAppointments: UpcomingAppointment[];
    recentInvoices: RecentInvoice[];
    agreements?: Agreement[];
    stats: PatientStats;
}

const formatDateTime = (dt: string): string => {
    const date = new Date(dt);
    const dateStr = new Intl.DateTimeFormat('es-ES', {
        month: 'short',
        day: 'numeric',
    }).format(date);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours < 12 ? 'AM' : 'PM';
    const displayHour = hours % 12 || 12;
    return `${dateStr} • ${displayHour}:${minutes} ${period}`;
};

const isOnlineModality = (modality: string): boolean =>
    ['video_call', 'online', 'videollamada', 'telefono'].includes(modality?.toLowerCase());

const getDueDays = (dueAt: string | null): number | null => {
    if (!dueAt) return null;
    return Math.ceil((new Date(dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

const formatInvoiceNumber = (id: number): string =>
    `#INV-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`;

export default function PatientDashboard({
    upcomingAppointments,
    recentInvoices,
    agreements = [],
}: Props) {
    const nextAppointment = upcomingAppointments[0] ?? null;

    return (
        <>
            <Head title="Inicio — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="8"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="6xl"
                mx="auto"
                w="full"
            >
                {/* ── Page header ── */}
                <Flex justifyContent="space-between" alignItems="center">
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
                        bg="bg.surface"
                        borderWidth="1px"
                        borderColor="border"
                        p="3"
                        borderRadius="lg"
                        cursor="pointer"
                        color="fg.muted"
                        _hover={{ bg: 'bg.subtle', color: 'fg' }}
                        transition="background 0.15s, color 0.15s"
                        aria-label="Notificaciones"
                    >
                        <Box as={Bell} w="5" h="5" aria-hidden={true} />
                    </Box>
                </Flex>

                {/* ── Hero: Next Session ── */}
                {nextAppointment ? (
                    <Box
                        bg="bg.surface"
                        borderRadius="2xl"
                        boxShadow="0px 7px 23.5px -2px rgba(12,29,42,0.19)"
                        position="relative"
                        overflow="hidden"
                        minH="72"
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        p="8"
                    >
                        {/* Doctor photo — left half */}
                        <Box
                            position="absolute"
                            left={0}
                            top={0}
                            bottom={0}
                            w="55%"
                            overflow="hidden"
                            aria-hidden={true}
                        >
                            {nextAppointment.professional.avatar_path ? (
                                <ChakraImg
                                    src={nextAppointment.professional.avatar_path}
                                    alt=""
                                    position="absolute"
                                    inset={0}
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                />
                            ) : (
                                <Flex
                                    w="full"
                                    h="full"
                                    bg="brand.subtle"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="6xl"
                                    fontWeight="bold"
                                    color="brand.solid"
                                >
                                    {nextAppointment.professional.name
                                        .split(' ')
                                        .slice(0, 2)
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()}
                                </Flex>
                            )}
                            {/* Gradient fade towards content */}
                            <Box
                                position="absolute"
                                inset={0}
                                pointerEvents="none"
                                background="linear-gradient(to right, transparent 0%, white 90%)"
                            />
                        </Box>

                        {/* Session info — right side */}
                        <Stack
                            gap="6"
                            position="relative"
                            zIndex={1}
                            w={{ base: 'full', md: '45%' }}
                            alignItems="flex-start"
                        >
                            <Badge
                                bg="#93f0e0"
                                color="#006f63"
                                borderRadius="full"
                                px="3"
                                py="1"
                                fontSize="2xs"
                                fontWeight="bold"
                                textTransform="uppercase"
                                letterSpacing="wider"
                            >
                                Tu próxima sesión
                            </Badge>

                            <Stack gap="1.5">
                                <Heading as="h2" fontSize="3xl" fontWeight="bold" color="fg">
                                    {nextAppointment.professional.name}
                                </Heading>
                                <Flex alignItems="center" gap="2">
                                    <Box
                                        as={CalendarDays}
                                        w="3.5"
                                        h="3.5"
                                        color="fg.muted"
                                        flexShrink={0}
                                        aria-hidden={true}
                                    />
                                    <Text fontSize="md" color="fg.muted">
                                        {formatDateTime(nextAppointment.scheduled_at)}
                                    </Text>
                                </Flex>
                            </Stack>

                            <Button asChild variant="primary" size="lg" w="full">
                                <ChakraLink
                                    href={AppointmentShowAction.url(nextAppointment.id)}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="2"
                                    aria-label={`${isOnlineModality(nextAppointment.modality) ? 'Unirse a la sesión' : 'Ver cita'} con ${nextAppointment.professional.name}`}
                                >
                                    <Box as={Video} w="4" h="4" aria-hidden={true} />
                                    {isOnlineModality(nextAppointment.modality)
                                        ? 'Join Session'
                                        : 'Ver cita'}
                                </ChakraLink>
                            </Button>
                        </Stack>
                    </Box>
                ) : (
                    <Box
                        bg="bg.surface"
                        borderRadius="2xl"
                        p="10"
                        textAlign="center"
                        borderWidth="1px"
                        borderColor="border"
                    >
                        <Box
                            as={CalendarDays}
                            w="10"
                            h="10"
                            mx="auto"
                            mb="3"
                            color="fg.subtle"
                            aria-hidden={true}
                        />
                        <Text color="fg.muted">No tienes citas próximas programadas.</Text>
                    </Box>
                )}

                {/* ── Bottom grid ── */}
                <Grid
                    templateColumns={{ base: '1fr', lg: '5fr 7fr' }}
                    gap={{ base: '8', lg: '12' }}
                    alignItems="start"
                >
                    {/* ── Left: Tus Acuerdos ── */}
                    <Box as="section" aria-labelledby="heading-agreements">
                        <Flex justifyContent="space-between" alignItems="center" mb="6">
                            <Heading
                                id="heading-agreements"
                                as="h2"
                                fontSize="2xl"
                                fontWeight="bold"
                                color="fg"
                                letterSpacing="-0.48px"
                            >
                                Tus Acuerdos
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

                        <Stack gap="4" role="list" aria-label="Tus acuerdos activos">
                            {agreements.length === 0 ? (
                                <Box
                                    bg="bg.surface"
                                    borderRadius="2xl"
                                    p="8"
                                    textAlign="center"
                                    boxShadow="sm"
                                >
                                    <Text fontSize="sm" color="fg.muted">
                                        No tienes acuerdos activos.
                                    </Text>
                                </Box>
                            ) : (
                                agreements.map((agreement) => {
                                    const isCompleted = agreement.status === 'completed';
                                    return (
                                        <Box
                                            key={agreement.id}
                                            role="listitem"
                                            bg={isCompleted ? 'rgba(251,242,237,0.47)' : '#fdf9f6'}
                                            borderRadius="2xl"
                                            p="6"
                                            boxShadow="sm"
                                        >
                                            <Flex
                                                justifyContent="space-between"
                                                alignItems="flex-start"
                                                mb="4"
                                                gap="4"
                                            >
                                                <Stack gap="1" flex={1} minW={0}>
                                                    <Text
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                        color="fg"
                                                        lineHeight="short"
                                                    >
                                                        {agreement.title}
                                                    </Text>
                                                    <Text fontSize="sm" color="fg.muted">
                                                        Con {agreement.therapist_name}
                                                    </Text>
                                                </Stack>
                                                <Badge
                                                    bg={isCompleted ? '#93f0e0' : 'rgba(0,97,86,0.1)'}
                                                    color={isCompleted ? '#006f63' : 'brand.solid'}
                                                    borderRadius="md"
                                                    px="2.5"
                                                    py="1"
                                                    fontSize="2xs"
                                                    fontWeight="bold"
                                                    textTransform="uppercase"
                                                    letterSpacing="wider"
                                                    flexShrink={0}
                                                >
                                                    {isCompleted ? 'Completado' : 'En progreso'}
                                                </Badge>
                                            </Flex>

                                            <Box
                                                h="2"
                                                borderRadius="full"
                                                bg="#d4e4f7"
                                                overflow="hidden"
                                                role="progressbar"
                                                aria-valuenow={agreement.progress}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-label={`Progreso: ${agreement.progress}%`}
                                            >
                                                <Box
                                                    h="full"
                                                    w={`${agreement.progress}%`}
                                                    bg="brand.solid"
                                                    borderRadius="full"
                                                    transition="width 0.3s ease"
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })
                            )}
                        </Stack>
                    </Box>

                    {/* ── Right: Facturas pendientes ── */}
                    <Box as="section" aria-labelledby="heading-invoices">
                        <Flex justifyContent="space-between" alignItems="center" mb="6">
                            <Heading
                                id="heading-invoices"
                                as="h2"
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

                        <Stack gap="4" role="list" aria-label="Facturas pendientes de pago">
                            {recentInvoices.length === 0 ? (
                                <Box
                                    bg="bg.surface"
                                    borderRadius="2xl"
                                    p="8"
                                    textAlign="center"
                                    boxShadow="sm"
                                >
                                    <Box
                                        as={FileText}
                                        w="7"
                                        h="7"
                                        mx="auto"
                                        mb="2"
                                        color="fg.subtle"
                                        aria-hidden={true}
                                    />
                                    <Text fontSize="sm" color="fg.muted">
                                        No hay facturas pendientes.
                                    </Text>
                                </Box>
                            ) : (
                                recentInvoices.map((invoice) => {
                                    const dueDays = getDueDays(invoice.due_at);
                                    const isOverdue =
                                        invoice.status === 'overdue' ||
                                        (dueDays !== null && dueDays <= 0);
                                    const isUrgent =
                                        isOverdue ||
                                        (dueDays !== null && dueDays <= 3 && dueDays > 0);

                                    return (
                                        <Flex
                                            key={invoice.id}
                                            role="listitem"
                                            bg={isUrgent ? '#ffecec' : 'bg.subtle'}
                                            borderRadius="2xl"
                                            p="6"
                                            boxShadow="sm"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            gap="4"
                                        >
                                            {/* Icon + invoice info */}
                                            <Flex alignItems="center" gap="5" flex={1} minW={0}>
                                                <Flex
                                                    bg="rgba(0,97,86,0.1)"
                                                    borderRadius="xl"
                                                    w="12"
                                                    h="12"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexShrink={0}
                                                    aria-hidden={true}
                                                >
                                                    <Box
                                                        as={FileText}
                                                        w="5"
                                                        h="5"
                                                        color="brand.solid"
                                                    />
                                                </Flex>
                                                <Stack gap="0.5" minW={0}>
                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="bold"
                                                        color="fg.subtle"
                                                        textTransform="uppercase"
                                                        letterSpacing="wider"
                                                    >
                                                        {formatInvoiceNumber(invoice.id)}
                                                    </Text>
                                                    <Text fontSize="sm" color="fg.muted">
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

                                            {/* Amount + due label + pay button */}
                                            <Flex alignItems="center" gap="5" flexShrink={0}>
                                                <Stack gap="0.5" alignItems="flex-end">
                                                    <Text
                                                        fontSize="xl"
                                                        fontWeight="bold"
                                                        color="fg"
                                                        lineHeight="none"
                                                    >
                                                        {Number(invoice.amount).toLocaleString(
                                                            'es-ES',
                                                            {
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 2,
                                                            },
                                                        )}{' '}
                                                        €
                                                    </Text>
                                                    {dueDays !== null && (
                                                        <Text
                                                            fontSize="2xs"
                                                            fontWeight="bold"
                                                            textTransform="uppercase"
                                                            letterSpacing="wider"
                                                            color={
                                                                isOverdue
                                                                    ? 'danger.solid'
                                                                    : 'fg.subtle'
                                                            }
                                                        >
                                                            {isOverdue
                                                                ? 'VENCIDA'
                                                                : `QUEDAN ${dueDays} DÍA${dueDays === 1 ? '' : 'S'}`}
                                                        </Text>
                                                    )}
                                                </Stack>
                                                <Button asChild variant="primary" size="sm">
                                                    <ChakraLink
                                                        href={InvoiceShowAction.url(invoice.id)}
                                                        aria-label={`Pagar factura ${formatInvoiceNumber(invoice.id)} por ${invoice.amount} €`}
                                                    >
                                                        Pagar
                                                    </ChakraLink>
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    );
                                })
                            )}
                        </Stack>
                    </Box>
                </Grid>
            </Stack>
        </>
    );
}

PatientDashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
