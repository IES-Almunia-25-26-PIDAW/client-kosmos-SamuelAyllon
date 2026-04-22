import { Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { KosmoBriefing as KosmoBriefingComponent } from '@/components/kosmo/kosmo-briefing';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import type { Agreement, ConsultingSessionType, KosmoBriefing, Note, Patient, Payment, ConsentForm } from '@/types';

const ChakraLink = chakra(Link);

interface SessionContext {
    lastSessions: ConsultingSessionType[];
    recentNotes: Note[];
    openAgreements: Agreement[];
    lastPayment: Payment | null;
    validConsent: ConsentForm | null;
}

interface Props {
    patient: Patient;
    context: SessionContext;
    briefing: KosmoBriefing | null;
}

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

const formatDateTime = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

export default function PreSession({ patient, context, briefing }: Props) {
    return (
        <>
            <Head title={`Pre-sesión: ${patient.project_name} — ClientKosmos`} />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="4xl">

                <Box>
                    <ChakraLink
                        href={`/patients/${patient.id}`}
                        display="inline-flex"
                        alignItems="center"
                        gap="2"
                        fontSize="sm"
                        color="fg.muted"
                        mb="4"
                        _hover={{ color: 'fg' }}
                    >
                        <Box as={ArrowLeft} w="4" h="4" />
                        Volver a {patient.project_name}
                    </ChakraLink>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Box>
                            <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                                Preparar sesión
                            </Heading>
                            <Text fontSize="md" color="fg.muted" mt="1">
                                {patient.project_name}
                            </Text>
                        </Box>
                        <Flex gap="2">
                            {patient.statuses?.map((s) => (
                                <StatusBadge key={s} status={s} />
                            ))}
                        </Flex>
                    </Flex>
                </Box>

                <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap="6">

                    <Stack gap="5">

                        {briefing && (
                            <KosmoBriefingComponent
                                title="Kosmo te recuerda"
                                content={
                                    <Stack gap="2">
                                        {Object.entries(briefing.content).map(([k, v]) => (
                                            <Text key={k} fontSize="sm" color="fg.muted">
                                                {String(v)}
                                            </Text>
                                        ))}
                                    </Stack>
                                }
                            />
                        )}

                        {context.lastSessions.length > 0 && (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                p="5"
                                boxShadow="sm"
                            >
                                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="4">
                                    Últimas sesiones
                                </Heading>
                                <Stack gap="2">
                                    {context.lastSessions.map((session, idx) => (
                                        <Flex
                                            key={session.id}
                                            alignItems="center"
                                            justifyContent="space-between"
                                            py="2"
                                            borderTopWidth={idx > 0 ? '1px' : undefined}
                                            borderColor="border.subtle"
                                        >
                                            <Text fontSize="sm" fontWeight="medium" color="fg">
                                                {formatDateTime(session.scheduled_at)}
                                            </Text>
                                            <Text fontSize="xs" color="fg.muted">
                                                {session.duration_minutes ?? 50} min
                                            </Text>
                                        </Flex>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        {context.recentNotes.length > 0 && (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                p="5"
                                boxShadow="sm"
                            >
                                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="4">
                                    Notas recientes
                                </Heading>
                                <Stack gap="3">
                                    {context.recentNotes.map((note) => (
                                        <Box key={note.id} borderLeftWidth="2px" borderColor="border" pl="3">
                                            <Text fontSize="sm" color="fg" lineClamp={3}>
                                                {note.content}
                                            </Text>
                                            <Text fontSize="xs" color="fg.subtle" mt="1">
                                                {formatDate(note.created_at)}
                                            </Text>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Stack>

                    <Stack gap="5">

                        {context.openAgreements.length > 0 && (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="orange.solid"
                                bg="orange.subtle"
                                p="5"
                            >
                                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="4" display="flex" alignItems="center" gap="2">
                                    <Box w="2" h="2" borderRadius="full" bg="orange.solid" />
                                    Acuerdos pendientes
                                </Heading>
                                <Stack as="ul" gap="2" listStyleType="none">
                                    {context.openAgreements.map((a) => (
                                        <Text as="li" key={a.id} fontSize="sm" color="fg">
                                            • {a.content}
                                        </Text>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        {context.lastPayment && context.lastPayment.status !== 'paid' && (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="yellow.solid"
                                bg="yellow.subtle"
                                p="5"
                            >
                                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="2">
                                    Cobro pendiente
                                </Heading>
                                <Text fontSize="sm" color="fg.muted">
                                    €{Number(context.lastPayment.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })} —
                                    vencimiento {formatDate(context.lastPayment.due_date)}
                                </Text>
                            </Box>
                        )}

                        {!patient.has_valid_consent && (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="purple.solid"
                                bg="purple.subtle"
                                p="5"
                            >
                                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="2">
                                    Sin consentimiento RGPD
                                </Heading>
                                <Text fontSize="sm" color="fg.muted">
                                    Este paciente no tiene un consentimiento informado firmado activo.
                                </Text>
                            </Box>
                        )}

                        {patient.service_scope && (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                p="5"
                                boxShadow="sm"
                            >
                                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="2">
                                    Motivo de consulta
                                </Heading>
                                <Text fontSize="sm" color="fg.muted">
                                    {patient.service_scope}
                                </Text>
                                {patient.brand_tone && (
                                    <Text fontSize="xs" color="fg.subtle" mt="2">
                                        Enfoque: {patient.brand_tone}
                                    </Text>
                                )}
                            </Box>
                        )}
                    </Stack>
                </Grid>

                <Flex alignItems="center" justifyContent="space-between" pt="4" borderTopWidth="1px" borderColor="border.subtle">
                    <Text fontSize="sm" color="fg.muted">
                        Cuando la sesión termine, registra el cierre desde el botón de la derecha.
                    </Text>
                    <ChakraLink href={`/patients/${patient.id}/post-session`}>
                        <Button variant="primary">
                            <Box as={Sparkles} w="4" h="4" mr="2" />
                            Cerrar sesión
                        </Button>
                    </ChakraLink>
                </Flex>
            </Stack>
        </>
    );
}

PreSession.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
