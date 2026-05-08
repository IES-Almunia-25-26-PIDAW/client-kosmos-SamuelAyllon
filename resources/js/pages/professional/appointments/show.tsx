import { Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, MessageSquare, Paperclip, Play } from 'lucide-react';
import type { ReactNode } from 'react';
import JoinWaitingRoomAction from '@/actions/App/Http/Controllers/Appointment/JoinWaitingRoomAction';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Dashboard/IndexAction';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraLink = chakra(Link);

interface User {
    id: number;
    name: string;
    email: string;
    avatar_path: string | null;
}

interface Service {
    id: number;
    name: string;
    duration_minutes: number;
}

interface Agreement {
    id: number;
    content: string;
    is_completed: boolean;
    created_at: string;
}

interface Document {
    id: number;
    name: string;
    mime_type: string | null;
    size_bytes: number | null;
    category: string | null;
}

interface PatientProfile {
    id: number;
    diagnosis: string | null;
    clinical_notes: string | null;
    documents: Document[];
}

interface ClinicalNote {
    id: number;
    content: string;
    type: string;
    created_at: string;
}

interface Appointment {
    id: number;
    starts_at: string;
    ends_at: string | null;
    status: string;
    patient: (User & { patient_profile: PatientProfile | null }) | null;
    professional: User | null;
    service: Service | null;
    agreements: Agreement[];
}

interface Props {
    appointment: Appointment;
    lastClinicalNote: ClinicalNote | null;
}

const formatTime = (dt: string) =>
    new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(dt));

const formatSyncedAt = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `Sincronizado hoy ${hh}:${mm}`;
};

const formatRelativeDate = (dt: string) => {
    const now = new Date();
    const then = new Date(dt);
    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'hoy';
    if (diffDays === 1) return 'ayer';
    return `hace ${diffDays} días`;
};

const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes <= 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let value = bytes;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};

const extFromMime = (mime: string | null) => {
    if (!mime) return 'Archivo';
    if (mime.includes('pdf')) return 'PDF';
    if (mime.includes('word') || mime.includes('document')) return 'DOCX';
    if (mime.includes('sheet') || mime.includes('excel')) return 'XLSX';
    if (mime.startsWith('image/')) return 'Imagen';
    if (mime.startsWith('audio/')) return 'Audio';
    if (mime.startsWith('video/')) return 'Vídeo';
    return 'Archivo';
};

const resourceMeta = (doc: Document): { Icon: typeof Paperclip; subtitle: string } => {
    const size = formatFileSize(doc.size_bytes);
    return { Icon: Paperclip, subtitle: size ? `${extFromMime(doc.mime_type)} · ${size}` : extFromMime(doc.mime_type) };
};

export default function AppointmentShow({ appointment, lastClinicalNote }: Props) {
    const patient = appointment.patient;
    const profile = patient?.patient_profile ?? null;
    const resources = profile?.documents ?? [];

    return (
        <>
            <Head title={`Sesión — ${patient?.name ?? 'Paciente'}`} />

            <Stack gap="6" p={{ base: '6', lg: '8' }}>
                <Box>
                    <ChakraLink
                        href={DashboardIndexAction.url()}
                        display="inline-flex"
                        alignItems="center"
                        gap="1.5"
                        fontSize="xs"
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        color="fg.muted"
                        mb="3"
                        transition="colors 0.2s"
                        _hover={{ color: 'fg' }}
                    >
                        <Box as={ArrowLeft} w="3.5" h="3.5" />
                        Volver al dashboard
                    </ChakraLink>
                    <Flex alignItems="baseline" justifyContent="space-between" gap="4" flexWrap="wrap">
                        <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                            {patient?.name ?? 'Paciente'}
                        </Heading>
                        <Text fontSize="md" color="fg.muted" fontVariantNumeric="tabular-nums">
                            {formatTime(appointment.starts_at)}
                            {appointment.ends_at && ` — ${formatTime(appointment.ends_at)}`}
                        </Text>
                    </Flex>
                    <Box mt="4" borderBottomWidth="1px" borderColor="border.subtle" />
                </Box>

                <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap="6">
                    <Box
                        as="section"
                        gridColumn={{ lg: 'span 2' }}
                        borderRadius="lg"
                        overflow="hidden"
                        boxShadow="sm"
                        bg="bg.subtle"
                    >
                        <Flex
                            as="header"
                            alignItems="center"
                            justifyContent="space-between"
                            px="5"
                            py="3"
                            bg="brand.solid"
                            color="brand.contrast"
                        >
                            <Flex alignItems="center" gap="2">
                                <Box as={MessageSquare} w="3.5" h="3.5" />
                                <Text
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                >
                                    Resumen clínico automático
                                </Text>
                            </Flex>
                            <Text fontSize="2xs" opacity={0.8}>
                                {formatSyncedAt()}
                            </Text>
                        </Flex>

                        <Stack gap="6" px="6" py="5">
                            <Box>
                                <Text
                                    as="h2"
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    color="fg.subtle"
                                    mb="2"
                                >
                                    Diagnóstico
                                </Text>
                                <Text fontSize="md" fontStyle="italic" color="fg" lineHeight="relaxed">
                                    {profile?.diagnosis?.trim() ? profile.diagnosis : 'Sin diagnóstico registrado.'}
                                </Text>
                            </Box>

                            <Box>
                                <Text
                                    as="h2"
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    color="fg.subtle"
                                    mb="3"
                                >
                                    Acuerdos establecidos
                                </Text>
                                {appointment.agreements.length === 0 ? (
                                    <Text fontSize="sm" fontStyle="italic" color="fg.muted">
                                        Sin acuerdos registrados.
                                    </Text>
                                ) : (
                                    <Stack as="ul" gap="2" listStyleType="none">
                                        {appointment.agreements.map((a) => (
                                            <Flex as="li" key={a.id} alignItems="flex-start" gap="3">
                                                <Box mt="7px" w="2" h="2" flexShrink={0} borderRadius="full" bg="brand.solid" />
                                                <Text
                                                    fontSize="md"
                                                    color={a.is_completed ? 'fg.subtle' : 'fg'}
                                                    textDecoration={a.is_completed ? 'line-through' : undefined}
                                                >
                                                    {a.content}
                                                </Text>
                                            </Flex>
                                        ))}
                                    </Stack>
                                )}
                            </Box>

                            <Box>
                                <Flex alignItems="baseline" justifyContent="space-between" mb="2">
                                    <Text
                                        as="h2"
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        color="fg.subtle"
                                    >
                                        Última nota clínica
                                    </Text>
                                    {lastClinicalNote && (
                                        <Text fontSize="2xs" color="fg.subtle">
                                            {formatRelativeDate(lastClinicalNote.created_at)}
                                        </Text>
                                    )}
                                </Flex>
                                {lastClinicalNote ? (
                                    <>
                                        <Text fontSize="md" fontStyle="italic" color="fg" lineHeight="relaxed" whiteSpace="pre-wrap">
                                            {lastClinicalNote.content}
                                        </Text>
                                        {patient?.patient_profile && (
                                            <ChakraLink
                                                href={PatientShowAction.url(patient.patient_profile?.id)}
                                                mt="3"
                                                display="inline-flex"
                                                alignItems="center"
                                                gap="1"
                                                fontSize="xs"
                                                fontWeight="semibold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                                color="brand.solid"
                                                transition="colors 0.2s"
                                                _hover={{ color: 'brand.emphasized' }}
                                            >
                                                Ver historial completo
                                            </ChakraLink>
                                        )}
                                    </>
                                ) : (
                                    <Text fontSize="sm" fontStyle="italic" color="fg.muted">
                                        Sin notas clínicas registradas.
                                    </Text>
                                )}
                            </Box>
                        </Stack>
                    </Box>

                    <Stack as="aside" gap="4">
                        <Box
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="border"
                            bg="bg.surface"
                            overflow="hidden"
                            boxShadow="sm"
                        >
                            <Box
                                as="header"
                                px="4"
                                py="3"
                                bg="bg.subtle"
                                borderBottomWidth="1px"
                                borderColor="border.subtle"
                            >
                                <Text
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    color="fg.subtle"
                                >
                                    Recursos del cliente
                                </Text>
                            </Box>
                            {resources.length === 0 ? (
                                <EmptyState
                                    icon={FileText}
                                    title="Sin recursos"
                                    description="Aún no has añadido recursos para este paciente."
                                />
                            ) : (
                                <Stack as="ul" gap="0" maxH="360px" overflowY="auto" listStyleType="none">
                                    {resources.map((doc, idx) => {
                                        const { Icon, subtitle } = resourceMeta(doc);
                                        return (
                                            <Flex
                                                as="li"
                                                key={doc.id}
                                                alignItems="center"
                                                gap="3"
                                                px="4"
                                                py="3"
                                                borderTopWidth={idx > 0 ? '1px' : undefined}
                                                borderColor="border.subtle"
                                            >
                                                <Box as={Icon} w="4" h="4" flexShrink={0} color="fg.muted" />
                                                <Box minW="0" flex="1">
                                                    <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
                                                        {doc.name}
                                                    </Text>
                                                    <Text fontSize="2xs" color="fg.subtle" truncate>
                                                        {subtitle}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Box>

                        <Stack gap="3" alignItems="center">
                            {appointment.service?.duration_minutes && (
                                <Text
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    color="fg.subtle"
                                    fontVariantNumeric="tabular-nums"
                                >
                                    Duración: {appointment.service.duration_minutes} min
                                </Text>
                            )}
                            <Box w="full">
                                <Form
                                    action={JoinWaitingRoomAction.url(appointment.id)}
                                    method="post"
                                    style={{ width: '100%' }}
                                >
                                    <Button type="submit" variant="primary" size="lg" w="full">
                                        <Box as={Play} w="4" h="4" fill="currentColor" />
                                        Iniciar sesión
                                    </Button>
                                </Form>
                            </Box>
                            <Text fontSize="xs" textAlign="center" color="fg.subtle">
                                Kosmo comenzará a transcribir y analizar una vez inicies la sesión.
                            </Text>
                        </Stack>
                    </Stack>
                </Grid>

                <Text
                    textAlign="center"
                    fontSize="2xs"
                    color="fg.subtle"
                    pt="4"
                    borderTopWidth="1px"
                    borderColor="border.subtle"
                >
                    Kosmo IA puede cometer errores
                </Text>
            </Stack>
        </>
    );
}

AppointmentShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
