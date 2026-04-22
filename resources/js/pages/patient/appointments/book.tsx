import { Badge, Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Clock, Euro, Video } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import AppointmentStoreAction from '@/actions/App/Http/Controllers/Portal/Appointment/StoreAction';
import ProfessionalIndexAction from '@/actions/App/Http/Controllers/Portal/Professional/IndexAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraLink = chakra(Link);
const ChakraImg = chakra('img');

interface Professional {
    id: number;
    user_id: number;
    name: string;
    avatar_path: string | null;
    specialties: string[];
    collegiate_number: string | null;
}

interface Service {
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: string;
}

interface Props {
    professional: Professional;
    service: Service;
    services: Service[];
    starts_at: string;
    ends_at: string;
}

const SPECIALTY_LABELS: Record<string, string> = {
    clinical: 'Clínica',
    cognitive_behavioral: 'Cognitivo-conductual',
    child: 'Infantil',
    couples: 'Parejas',
    trauma: 'Trauma',
    systemic: 'Sistémica',
};

const formatSpecialty = (key: string): string =>
    SPECIALTY_LABELS[key] ?? key.replace(/_/g, ' ');

const formatDateLong = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(iso));

const formatTime = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));

const initials = (name: string): string =>
    name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

export default function PatientAppointmentBook({ professional, service, starts_at, ends_at }: Props) {
    const form = useForm<{
        professional_id: number;
        service_id: number;
        starts_at: string;
        modality: 'video_call' | 'in_person';
    }>({
        professional_id: professional.user_id,
        service_id: service.id,
        starts_at,
        modality: 'video_call',
    });

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post(AppointmentStoreAction.url());
    };

    return (
        <>
            <Head title="Confirmar reserva — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="8"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="3xl"
                mx="auto"
                w="full"
            >
                <Flex alignItems="center" gap="3">
                    <ChakraLink
                        href={ProfessionalIndexAction.url()}
                        color="fg.muted"
                        _hover={{ color: 'fg' }}
                        display="inline-flex"
                        alignItems="center"
                        gap="1.5"
                        fontSize="sm"
                    >
                        <Box as={ArrowLeft} w="4" h="4" aria-hidden={true} />
                        Volver
                    </ChakraLink>
                </Flex>

                <Stack gap="2">
                    <Heading as="h1" fontSize="4xl" fontWeight="bold" color="fg" letterSpacing="-0.48px">
                        Confirma tu cita
                    </Heading>
                    <Text fontSize="md" color="fg.muted">
                        Revisa los detalles antes de confirmar la reserva.
                    </Text>
                </Stack>

                <Box bg="bg.surface" borderRadius="2xl" p="6" boxShadow="sm">
                    <Flex alignItems="center" gap="4">
                        <Box
                            w="16"
                            h="16"
                            borderRadius="full"
                            overflow="hidden"
                            flexShrink={0}
                        >
                            {professional.avatar_path ? (
                                <ChakraImg src={professional.avatar_path} alt="" w="full" h="full" objectFit="cover" />
                            ) : (
                                <Flex
                                    w="full"
                                    h="full"
                                    bg="brand.subtle"
                                    color="brand.solid"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="lg"
                                    fontWeight="bold"
                                >
                                    {initials(professional.name)}
                                </Flex>
                            )}
                        </Box>
                        <Stack gap="1" minW={0}>
                            <Heading as="h2" fontSize="xl" fontWeight="semibold" color="fg" truncate>
                                {professional.name}
                            </Heading>
                            {professional.collegiate_number && (
                                <Text fontSize="xs" color="fg.subtle">
                                    Nº colegiado: {professional.collegiate_number}
                                </Text>
                            )}
                            {professional.specialties.length > 0 && (
                                <Flex flexWrap="wrap" gap="1.5" mt="1">
                                    {professional.specialties.slice(0, 3).map((s) => (
                                        <Badge
                                            key={s}
                                            variant="subtle"
                                            colorPalette="gray"
                                            borderRadius="full"
                                            px="2.5"
                                            py="0.5"
                                            fontSize="2xs"
                                            fontWeight="semibold"
                                            textTransform="uppercase"
                                            letterSpacing="wider"
                                        >
                                            {formatSpecialty(s)}
                                        </Badge>
                                    ))}
                                </Flex>
                            )}
                        </Stack>
                    </Flex>
                </Box>

                <Stack gap="3">
                    <Heading as="h3" fontSize="sm" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                        Detalles de la cita
                    </Heading>

                    <Stack gap="0" bg="bg.surface" borderRadius="2xl" boxShadow="sm" overflow="hidden">
                        <DetailRow icon={CalendarDays} label="Fecha" value={formatDateLong(starts_at)} />
                        <DetailRow
                            icon={Clock}
                            label="Hora"
                            value={`${formatTime(starts_at)} – ${formatTime(ends_at)} (${service.duration_minutes} min)`}
                        />
                        <DetailRow icon={Video} label="Modalidad" value="Videollamada" />
                        <DetailRow icon={Euro} label="Servicio" value={`${service.name} · ${Number(service.price).toFixed(2)} €`} isLast />
                    </Stack>

                    {service.description && (
                        <Text fontSize="sm" color="fg.muted">
                            {service.description}
                        </Text>
                    )}
                </Stack>

                {form.errors.starts_at && (
                    <Text fontSize="sm" color="danger.solid">
                        {form.errors.starts_at}
                    </Text>
                )}
                {form.errors.professional_id && (
                    <Text fontSize="sm" color="danger.solid">
                        {form.errors.professional_id}
                    </Text>
                )}

                <chakra.form onSubmit={onSubmit} display="flex" gap="3" flexDirection={{ base: 'column-reverse', sm: 'row' }} justifyContent="flex-end">
                    <Button asChild variant="secondary" size="md" type="button">
                        <ChakraLink href={ProfessionalIndexAction.url()}>Cancelar</ChakraLink>
                    </Button>
                    <Button type="submit" variant="primary" size="md" disabled={form.processing}>
                        {form.processing ? 'Reservando…' : 'Confirmar reserva'}
                    </Button>
                </chakra.form>
            </Stack>
        </>
    );
}

interface DetailRowProps {
    icon: React.ComponentType<{ size?: number | string }>;
    label: string;
    value: string;
    isLast?: boolean;
}

function DetailRow({ icon, label, value, isLast }: DetailRowProps) {
    return (
        <Flex
            alignItems="center"
            gap="4"
            px="5"
            py="4"
            borderBottomWidth={isLast ? 0 : '1px'}
            borderColor="border.subtle"
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
                <Box as={icon} w="4" h="4" />
            </Flex>
            <Stack gap="0" flex="1" minW={0}>
                <Text fontSize="xs" fontWeight="semibold" color="fg.subtle" textTransform="uppercase" letterSpacing="wider">
                    {label}
                </Text>
                <Text fontSize="sm" color="fg" fontWeight="medium">
                    {value}
                </Text>
            </Stack>
        </Flex>
    );
}

PatientAppointmentBook.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
