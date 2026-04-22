import { Badge, Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarDays, Receipt } from 'lucide-react';
import type { ReactNode } from 'react';
import AppointmentShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';
import { KosmoBriefing as KosmoBriefingComponent } from '@/components/kosmo/kosmo-briefing';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth, KosmoBriefing } from '@/types';

const ChakraLink = chakra(Link);

interface DashboardStats {
    sessions_today: number;
    appointments_this_week: number;
    pending_invoices: number;
    active_patients: number;
    collection_rate: number;
}

interface TodayAppointment {
    id: number;
    scheduled_at: string;
    modality: string;
    status: string;
    session_number: number;
    total_sessions: number;
    patient: {
        id: number;
        patient_user_id: number;
        name: string;
        avatar_path: string | null;
    };
    service_name: string | null;
}

interface PendingPayment {
    id: number;
    patient_id: number;
    patient_name: string;
    amount: number;
    status: 'sent' | 'overdue';
    due_at: string | null;
    hours_since_due: number | null;
}

interface AlertPatient {
    id: number;
    project_name: string;
    payment_status?: string;
}

interface Props {
    activePatients: { id: number; user_id: number; user?: { id: number; name: string } }[];
    todayAppointments: TodayAppointment[];
    pendingPayments: PendingPayment[];
    alerts: {
        invoice: AlertPatient[];
        consent: AlertPatient[];
    };
    dailyBriefing: KosmoBriefing | null;
    stats: DashboardStats;
}

const greeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
};

const formatDate = (): string =>
    new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

const formatTime = (dt: string): { time: string; period: string } => {
    const date = new Date(dt);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours < 12 ? 'AM' : 'PM';
    const displayHour = hours % 12 || 12;
    return { time: `${displayHour.toString().padStart(2, '0')}:${minutes}`, period };
};

const getModalityLabel = (modality: string): string => {
    const map: Record<string, string> = {
        presencial: 'Presencial',
        online: 'Online',
        videollamada: 'Videollamada',
        telefono: 'Teléfono',
    };
    return map[modality?.toLowerCase()] ?? modality ?? 'Presencial';
};

const isOnlineModality = (modality: string): boolean =>
    ['online', 'videollamada', 'telefono'].includes(modality?.toLowerCase());

const getPaymentLabel = (payment: PendingPayment): string => {
    if (payment.status === 'overdue') {
        return payment.hours_since_due
            ? `Pago vencido (${payment.hours_since_due}h)`
            : 'Pago vencido';
    }
    if (payment.hours_since_due && payment.hours_since_due >= 48) {
        return `Cobro pendiente (${payment.hours_since_due}h)`;
    }
    return 'Cobro pendiente';
};

export default function ProfessionalDashboard({
    todayAppointments,
    pendingPayments,
    alerts,
    dailyBriefing,
    stats,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const allPendingAlerts = [
        ...pendingPayments.map((p) => ({
            id: p.id,
            patientId: p.patient_id,
            name: p.patient_name,
            label: getPaymentLabel(p),
            isOverdue: p.status === 'overdue',
            type: 'invoice' as const,
        })),
        ...alerts.consent.slice(0, 3 - pendingPayments.length).map((p) => ({
            id: p.id,
            patientId: p.id,
            name: p.project_name,
            label: 'Falta consentimiento',
            isOverdue: false,
            type: 'consent' as const,
        })),
    ].slice(0, 4);

    return (
        <>
            <Head title="Hoy — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }}>

                <Box>
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        {greeting()}, {auth.user.name.split(' ')[0]}
                    </Heading>
                    <Text mt="0.5" fontSize="md" color="fg.muted" textTransform="capitalize">
                        {formatDate()}
                    </Text>
                </Box>

                {dailyBriefing && (
                    <KosmoBriefingComponent
                        title="Tu día de un vistazo"
                        content={
                            <Text fontSize="sm" color="fg.muted">
                                {typeof dailyBriefing.content === 'object' && 'summary' in dailyBriefing.content
                                    ? String(dailyBriefing.content.summary)
                                    : JSON.stringify(dailyBriefing.content)}
                            </Text>
                        }
                    />
                )}

                <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap="6">

                    <Box gridColumn={{ lg: 'span 2' }}>
                        <Flex alignItems="center" justifyContent="space-between" mb="4">
                            <Heading as="h2" fontSize="xl" fontWeight="semibold" color="fg">
                                Agenda del día
                            </Heading>
                            <ChakraLink
                                href="/appointments"
                                fontSize="sm"
                                fontWeight="medium"
                                color="brand.solid"
                                _hover={{ textDecoration: 'underline' }}
                                display="flex"
                                alignItems="center"
                                gap="1"
                            >
                                Ver calendario completo <Box as={ArrowRight} w="3.5" h="3.5" />
                            </ChakraLink>
                        </Flex>

                        {todayAppointments.length === 0 ? (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                p="10"
                                textAlign="center"
                            >
                                <Box as={CalendarDays} w="8" h="8" mx="auto" mb="3" color="fg.subtle" />
                                <Text fontSize="sm" color="fg.muted">
                                    No hay sesiones programadas para hoy.
                                </Text>
                            </Box>
                        ) : (
                            <Stack gap="3">
                                {todayAppointments.map((session, index) => {
                                    const isNext = index === 0;
                                    const { time, period } = formatTime(session.scheduled_at);
                                    const isOnline = isOnlineModality(session.modality);

                                    return (
                                        <Flex
                                            key={session.id}
                                            alignItems="center"
                                            gap="4"
                                            borderRadius="lg"
                                            borderWidth="1px"
                                            borderColor={isNext ? 'brand.solid' : 'border'}
                                            bg="bg.surface"
                                            p="4"
                                            boxShadow={isNext ? 'sm' : undefined}
                                            _hover={isNext ? undefined : { boxShadow: 'sm' }}
                                            transition="box-shadow 0.2s"
                                        >
                                            <Box
                                                w="2.5"
                                                h="2.5"
                                                borderRadius="full"
                                                flexShrink={0}
                                                bg={isNext ? 'brand.solid' : 'fg.subtle'}
                                            />

                                            <Box w="14" flexShrink={0} textAlign="center">
                                                <Text fontSize="sm" fontWeight="semibold" lineHeight="none" color="fg">
                                                    {time}
                                                </Text>
                                                <Text fontSize="xs" color="fg.subtle" mt="0.5">{period}</Text>
                                            </Box>

                                            <Box flex="1" minW={0}>
                                                <Text fontSize="sm" fontWeight="semibold" color="fg" truncate>
                                                    {session.patient.name}
                                                </Text>
                                                <Text fontSize="xs" color="fg.muted" mt="0.5">
                                                    {session.service_name
                                                        ? `${session.service_name} • Sesión ${session.session_number}/${session.total_sessions}`
                                                        : `Sesión ${session.session_number}/${session.total_sessions}`}
                                                </Text>
                                                <Flex flexWrap="wrap" gap="1.5" mt="2">
                                                    <Badge
                                                        variant="subtle"
                                                        colorPalette={isOnline ? 'gray' : 'green'}
                                                        borderRadius="full"
                                                        px="2"
                                                        py="0.5"
                                                        fontSize="2xs"
                                                        fontWeight="semibold"
                                                        textTransform="uppercase"
                                                        letterSpacing="wider"
                                                    >
                                                        {getModalityLabel(session.modality)}
                                                    </Badge>
                                                </Flex>
                                            </Box>

                                            {isNext ? (
                                                <Button asChild variant="primary" size="sm" flexShrink={0}>
                                                    <ChakraLink href={AppointmentShowAction.url(session.id)}>
                                                        Preparar sesión
                                                    </ChakraLink>
                                                </Button>
                                            ) : (
                                                <Button asChild variant="outline" size="sm" flexShrink={0}>
                                                    <ChakraLink href={PatientShowAction.url(session.patient.id)}>
                                                        Ver ficha
                                                    </ChakraLink>
                                                </Button>
                                            )}
                                        </Flex>
                                    );
                                })}
                            </Stack>
                        )}
                    </Box>

                    <Stack gap="4">

                        {allPendingAlerts.length > 0 && (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                overflow="hidden"
                                boxShadow="sm"
                            >
                                <Box px="4" py="3" borderBottomWidth="1px" borderColor="border">
                                    <Text
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        color="fg.muted"
                                    >
                                        Cobros pendientes
                                    </Text>
                                </Box>
                                {allPendingAlerts.map((alert, index) => (
                                    <ChakraLink
                                        key={`${alert.type}-${alert.id}`}
                                        href={PatientShowAction.url(alert.patientId)}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        px="4"
                                        py="3"
                                        borderTopWidth={index > 0 ? '1px' : undefined}
                                        borderColor="border"
                                        _hover={{ bg: 'bg.subtle' }}
                                        transition="background 0.2s"
                                    >
                                        <Flex alignItems="flex-start" gap="2.5" minW={0}>
                                            <Box mt="1" w="2" h="2" borderRadius="full" flexShrink={0} bg="error.solid" />
                                            <Box minW={0}>
                                                <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
                                                    {alert.name}
                                                </Text>
                                                <Text
                                                    fontSize="2xs"
                                                    fontWeight="semibold"
                                                    textTransform="uppercase"
                                                    letterSpacing="wider"
                                                    mt="0.5"
                                                    color={alert.isOverdue ? 'error.fg' : 'warning.fg'}
                                                >
                                                    {alert.label}
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Box as={ArrowRight} w="4" h="4" flexShrink={0} color="fg.subtle" ml="2" />
                                    </ChakraLink>
                                ))}
                                <Box px="4" py="2.5" borderTopWidth="1px" borderColor="border">
                                    <ChakraLink
                                        href="/invoices"
                                        fontSize="xs"
                                        fontWeight="medium"
                                        color="brand.solid"
                                        _hover={{ textDecoration: 'underline' }}
                                    >
                                        Ver todo el historial
                                    </ChakraLink>
                                </Box>
                            </Box>
                        )}

                        <Flex
                            borderRadius="lg"
                            bg="brand.solid"
                            p="5"
                            alignItems="center"
                            justifyContent="space-between"
                            boxShadow="sm"
                        >
                            <Box>
                                <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="white/70">
                                    Sesiones hoy
                                </Text>
                                <Text fontSize="3xl" fontWeight="bold" color="white" mt="1" lineHeight="none">
                                    {stats.sessions_today.toString().padStart(2, '0')}
                                </Text>
                            </Box>
                            <Flex borderRadius="md" bg="white/15" p="2.5">
                                <Box as={CalendarDays} w="22px" h="22px" color="white" />
                            </Flex>
                        </Flex>

                        <Flex
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="border"
                            bg="bg.surface"
                            p="5"
                            alignItems="center"
                            justifyContent="space-between"
                            boxShadow="sm"
                        >
                            <Box>
                                <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                                    Pendientes
                                </Text>
                                <Text fontSize="3xl" fontWeight="bold" color="fg" mt="1" lineHeight="none">
                                    {Number(stats.pending_invoices).toLocaleString('es-ES', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} €
                                </Text>
                                {allPendingAlerts.length > 0 && (
                                    <Text fontSize="xs" color="fg.subtle" mt="1">
                                        {allPendingAlerts.length}{' '}
                                        {allPendingAlerts.length === 1 ? 'factura' : 'facturas'}
                                    </Text>
                                )}
                            </Box>
                            <Flex borderRadius="md" bg="bg.subtle" p="2.5">
                                <Box as={Receipt} w="22px" h="22px" color="fg.muted" />
                            </Flex>
                        </Flex>

                    </Stack>

                </Grid>
            </Stack>
        </>
    );
}

ProfessionalDashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
