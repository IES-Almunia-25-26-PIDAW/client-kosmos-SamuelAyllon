import { Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, CreditCard, FileText, Lock, Shield, User, Video } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import AppointmentStoreAction from '@/actions/App/Http/Controllers/Portal/Appointment/StoreAction';
import ProfessionalIndexAction from '@/actions/App/Http/Controllers/Portal/Professional/IndexAction';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types/auth';

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

const formatDateMedium = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
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
    const { auth } = usePage<{ auth: Auth }>().props;

    const form = useForm<{
        professional_id: number;
        service_id: number;
        starts_at: string;
        modality: 'video_call' | 'in_person';
        notes: string;
    }>({
        professional_id: professional.user_id,
        service_id: service.id,
        starts_at,
        modality: 'video_call',
        notes: '',
    });

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post(AppointmentStoreAction.url());
    };

    return (
        <>
            <Head title="Confirmar reserva — ClientKosmos" />

            <chakra.form
                onSubmit={onSubmit}
                id="main-content"
                tabIndex={-1}
                display="flex"
                flexDirection="column"
                gap="6"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="6xl"
                mx="auto"
                w="full"
            >
                {/* Back link */}
                <ChakraLink
                    href={ProfessionalIndexAction.url()}
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                    display="inline-flex"
                    alignItems="center"
                    gap="1.5"
                    fontSize="xs"
                    fontWeight="extrabold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    w="fit-content"
                >
                    <Box as={ArrowLeft} w="3.5" h="3.5" aria-hidden />
                    Volver
                </ChakraLink>

                {/* Heading */}
                <Stack gap="1">
                    <Heading as="h1" fontSize="4xl" fontWeight="bold" color="fg" letterSpacing="-0.48px">
                        Confirma tu cita
                    </Heading>
                    <Text fontSize="md" color="fg.muted">
                        Un último paso más y ya tendrás tu reserva terminada
                    </Text>
                </Stack>

                {/* Two-column layout */}
                <Flex gap="8" flexDirection={{ base: 'column', lg: 'row' }} align={{ lg: 'start' }}>
                    {/* Left column */}
                    <Stack gap="5" flex="1" minW={0}>
                        {/* Tu información */}
                        <Box bg="bg.surface" borderRadius="2xl" borderWidth="1px" borderColor="border" p="6" boxShadow="xs">
                            <Flex align="center" gap="3" mb="5">
                                <Box as={User} w="5" h="5" color="brand.solid" aria-hidden />
                                <Heading as="h2" fontSize="lg" fontWeight="bold" color="fg">
                                    Tu información
                                </Heading>
                            </Flex>

                            <Stack gap="4">
                                <ReadonlyField label="NOMBRE COMPLETO" value={auth.user.name} />
                                <Flex gap="4" flexDirection={{ base: 'column', sm: 'row' }}>
                                    <ReadonlyField label="EMAIL" value={auth.user.email} flex="1" />
                                    <ReadonlyField label="NÚMERO DE TLFN" value="—" flex="1" />
                                </Flex>
                            </Stack>
                        </Box>

                        {/* Notas para el profesional */}
                        <Box bg="bg.surface" borderRadius="2xl" borderWidth="1px" borderColor="border" p="6" boxShadow="xs">
                            <Flex align="center" gap="3" mb="4">
                                <Box as={FileText} w="5" h="5" color="brand.solid" aria-hidden />
                                <Heading as="h2" fontSize="lg" fontWeight="bold" color="fg">
                                    Notas para el profesional
                                </Heading>
                            </Flex>

                            <Textarea
                                placeholder="¿Alguna información que el profesional deba saber de antemano?"
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                                minH="32"
                                resize="vertical"
                            />
                        </Box>
                    </Stack>

                    {/* Right sidebar */}
                    <Box
                        bg="bg.surface"
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="border"
                        boxShadow="md"
                        w={{ base: 'full', lg: '96' }}
                        flexShrink={0}
                        overflow="hidden"
                        position={{ lg: 'sticky' }}
                        top={{ lg: '6' }}
                    >
                        {/* Sidebar header */}
                        <Box
                            px="6"
                            pt="5"
                            pb="4"
                            borderBottomWidth="1px"
                            borderColor="border.subtle"
                            textAlign="center"
                        >
                            <Text
                                fontSize="2xs"
                                fontWeight="semibold"
                                color="fg.subtle"
                                textTransform="uppercase"
                                letterSpacing="wider"
                            >
                                Resumen de la cita
                            </Text>
                        </Box>

                        {/* Professional info */}
                        <Flex gap="4" align="center" px="6" py="5" borderBottomWidth="1px" borderColor="border.subtle">
                            <Box w="14" h="14" borderRadius="full" overflow="hidden" flexShrink={0} bg="bg.subtle">
                                {professional.avatar_path ? (
                                    <ChakraImg
                                        src={professional.avatar_path}
                                        alt=""
                                        w="full"
                                        h="full"
                                        objectFit="cover"
                                    />
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
                            <Stack gap="0.5" minW={0}>
                                <Text fontWeight="bold" color="fg" lineClamp={1}>
                                    {professional.name}
                                </Text>
                                <Text fontSize="sm" color="brand.solid" fontWeight="medium" lineClamp={1}>
                                    {service.name}
                                </Text>
                            </Stack>
                        </Flex>

                        {/* Date / Time / Modality */}
                        <Stack gap="0" px="6" py="4" borderBottomWidth="1px" borderColor="border.subtle">
                            <Flex align="start" gap="3" py="2.5">
                                <Box as={CalendarDays} w="4" h="4" color="fg.subtle" flexShrink={0} mt="0.5" aria-hidden />
                                <Stack gap="0">
                                    <Text fontSize="sm" fontWeight="semibold" color="fg" textTransform="capitalize">
                                        {formatDateMedium(starts_at)}
                                    </Text>
                                    <Text fontSize="sm" color="fg.muted">
                                        {formatTime(starts_at)} - {formatTime(ends_at)}
                                    </Text>
                                </Stack>
                            </Flex>
                            <Flex align="start" gap="3" py="2.5">
                                <Box as={Video} w="4" h="4" color="fg.subtle" flexShrink={0} mt="0.5" aria-hidden />
                                <Stack gap="0">
                                    <Text fontSize="sm" fontWeight="semibold" color="fg">
                                        Online
                                    </Text>
                                    <Text fontSize="sm" color="fg.muted">
                                        Sesión {service.duration_minutes} min
                                    </Text>
                                </Stack>
                            </Flex>
                        </Stack>

                        {/* Price breakdown */}
                        <Stack gap="3" px="6" py="5" borderBottomWidth="1px" borderColor="border.subtle">
                            <Flex justify="space-between" align="center">
                                <Text fontSize="sm" color="fg.muted">
                                    Precio sesión
                                </Text>
                                <Text fontSize="sm" color="fg">
                                    {Number(service.price).toFixed(2)} €
                                </Text>
                            </Flex>
                            <Box borderTopWidth="1px" borderColor="border.subtle" pt="3">
                                <Flex justify="space-between" align="center">
                                    <Text fontWeight="bold" color="fg">
                                        Pago total
                                    </Text>
                                    <Text fontWeight="bold" fontSize="xl" color="brand.solid">
                                        {Number(service.price).toFixed(2)} €
                                    </Text>
                                </Flex>
                            </Box>
                        </Stack>

                        {/* Error messages */}
                        {(form.errors.starts_at || form.errors.professional_id) && (
                            <Box px="6" pt="3">
                                {form.errors.starts_at && (
                                    <Text fontSize="sm" color="danger.solid">{form.errors.starts_at}</Text>
                                )}
                                {form.errors.professional_id && (
                                    <Text fontSize="sm" color="danger.solid">{form.errors.professional_id}</Text>
                                )}
                            </Box>
                        )}

                        {/* Confirm button */}
                        <Stack gap="2" px="6" py="5">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                w="full"
                                disabled={form.processing}
                            >
                                {form.processing ? 'Reservando…' : 'Confirmar y reservar →'}
                            </Button>
                            <Text textAlign="center" fontSize="xs" color="fg.subtle">
                                Te cobramos después de la sesión
                            </Text>
                        </Stack>

                        {/* Security badges */}
                        <Flex
                            justify="center"
                            gap="6"
                            px="6"
                            py="4"
                            borderTopWidth="1px"
                            borderColor="border.subtle"
                        >
                            <SecurityBadge icon={Lock} label="Secure" />
                            <SecurityBadge icon={Shield} label="GDPR" />
                            <SecurityBadge icon={CreditCard} label="PCI DSS" />
                        </Flex>
                    </Box>
                </Flex>
            </chakra.form>
        </>
    );
}

interface ReadonlyFieldProps {
    label: string;
    value: string;
    flex?: string;
}

function ReadonlyField({ label, value, flex }: ReadonlyFieldProps) {
    return (
        <Stack gap="1" flex={flex} minW={0}>
            <Text fontSize="2xs" fontWeight="semibold" color="fg.subtle" textTransform="uppercase" letterSpacing="wider">
                {label}
            </Text>
            <Box
                borderWidth="1px"
                borderColor="border"
                borderRadius="lg"
                px="4"
                py="3"
                bg="bg.subtle"
                color="fg.muted"
                fontSize="sm"
            >
                {value}
            </Box>
        </Stack>
    );
}

interface SecurityBadgeProps {
    icon: React.ComponentType<{ size?: number | string }>;
    label: string;
}

function SecurityBadge({ icon, label }: SecurityBadgeProps) {
    return (
        <Stack gap="1" align="center">
            <Box as={icon} w="4" h="4" color="fg.subtle" aria-hidden />
            <Text fontSize="2xs" fontWeight="semibold" color="fg.subtle" textTransform="uppercase" letterSpacing="wider">
                {label}
            </Text>
        </Stack>
    );
}

PatientAppointmentBook.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
