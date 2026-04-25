import { Box, Flex, Grid, Heading, Stack, Table, Text, Textarea, chakra } from '@chakra-ui/react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { CheckCircle, FileText, Receipt, Shield } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PatientHeader } from '@/components/patient/patient-header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import type { Agreement, ConsentForm, ConsultingSessionType, Document, Note, Patient, Payment } from '@/types';

const ChakraLink = chakra(Link);

interface Props {
    patient: Patient & {
        sessions: ConsultingSessionType[];
        notes: Note[];
        agreements: Agreement[];
        payments: Payment[];
        documents: Document[];
        consent_forms: ConsentForm[];
    };
}

type Tab = 'resumen' | 'acuerdos' | 'notas' | 'documentos' | 'cobros';

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

const formatDateTime = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

export default function PatientShow({ patient }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('resumen');

    const { data: noteData, setData: setNoteData, post: postNote, processing: savingNote, reset: resetNote } = useForm({
        content: '',
        type: 'quick_note' as const,
    });

    const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
        { key: 'resumen', label: 'Resumen', icon: FileText },
        { key: 'acuerdos', label: 'Acuerdos', icon: CheckCircle },
        { key: 'notas', label: 'Notas', icon: FileText },
        { key: 'documentos', label: 'Documentos', icon: Shield },
        { key: 'cobros', label: 'Cobros', icon: Receipt },
    ];

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        postNote(`/patients/${patient.id}/notes`, {
            onSuccess: () => resetNote(),
        });
    };

    return (
        <>
            <Head title={`${patient.project_name} — ClientKosmos`} />

            <Flex direction="column">

                <PatientHeader patient={patient} />

                <Box
                    borderBottomWidth="1px"
                    borderColor="border.subtle"
                    bg="bg.surface"
                    px="4"
                    position="sticky"
                    top="73px"
                    zIndex="sticky"
                >
                    <Flex gap="1" overflowX="auto">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;
                            return (
                                <Flex
                                    as="button"
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    alignItems="center"
                                    gap="2"
                                    px="4"
                                    py="3"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    whiteSpace="nowrap"
                                    borderBottomWidth="2px"
                                    borderColor={isActive ? 'brand.solid' : 'transparent'}
                                    color={isActive ? 'brand.solid' : 'fg.muted'}
                                    transition="colors 0.2s"
                                    _hover={isActive ? undefined : { color: 'fg' }}
                                >
                                    <Box as={tab.icon} w="4" h="4" />
                                    {tab.label}
                                </Flex>
                            );
                        })}
                    </Flex>
                </Box>

                <Box p={{ base: '6', lg: '8' }} maxW="4xl">

                    {activeTab === 'resumen' && (
                        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap="6">
                            <Stack gap="4">
                                <Box
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="border"
                                    bg="bg.surface"
                                    p="5"
                                    boxShadow="sm"
                                >
                                    <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="4">
                                        Datos del paciente
                                    </Heading>
                                    <Stack as="dl" gap="3">
                                        {patient.service_scope && (
                                            <Box>
                                                <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                                    Motivo de consulta
                                                </Text>
                                                <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                                    {patient.service_scope}
                                                </Text>
                                            </Box>
                                        )}
                                        {patient.brand_tone && (
                                            <Box>
                                                <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                                    Enfoque terapéutico
                                                </Text>
                                                <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                                    {patient.brand_tone}
                                                </Text>
                                            </Box>
                                        )}
                                        {patient.next_deadline && (
                                            <Box>
                                                <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                                    Próxima sesión
                                                </Text>
                                                <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                                    {formatDate(patient.next_deadline)}
                                                </Text>
                                            </Box>
                                        )}
                                    </Stack>
                                </Box>
                                <Flex gap="3">
                                    <ChakraLink href={`/patients/${patient.id}/pre-session`}>
                                        <Button variant="primary" size="md">Preparar sesión</Button>
                                    </ChakraLink>
                                    <ChakraLink href={`/patients/${patient.id}/post-session`}>
                                        <Button variant="secondary" size="md">Al terminar</Button>
                                    </ChakraLink>
                                </Flex>
                            </Stack>

                            <Stack gap="4">
                                {patient.sessions.slice(0, 3).length > 0 && (
                                    <Box
                                        borderRadius="lg"
                                        borderWidth="1px"
                                        borderColor="border"
                                        bg="bg.surface"
                                        overflow="hidden"
                                        boxShadow="sm"
                                    >
                                        <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" px="5" pt="5" pb="3">
                                            Últimas sesiones
                                        </Heading>
                                        {patient.sessions.slice(0, 3).map((session) => (
                                            <Box key={session.id} px="5" py="3" borderTopWidth="1px" borderColor="border.subtle">
                                                <Flex alignItems="center" justifyContent="space-between">
                                                    <Text fontSize="sm" fontWeight="semibold" color="fg">
                                                        {formatDateTime(session.scheduled_at)}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        px="2"
                                                        py="0.5"
                                                        borderRadius="full"
                                                        bg="bg.subtle"
                                                        color="fg.muted"
                                                    >
                                                        {session.duration_minutes ?? 50} min
                                                    </Text>
                                                </Flex>
                                                {session.ai_summary && (
                                                    <Text fontSize="sm" color="fg.muted" mt="1" lineClamp={2}>
                                                        {session.ai_summary}
                                                    </Text>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Stack>
                        </Grid>
                    )}

                    {activeTab === 'acuerdos' && (
                        <Stack gap="4">
                            <Flex alignItems="center" justifyContent="space-between">
                                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
                                    Acuerdos terapéuticos
                                </Heading>
                            </Flex>
                            {patient.agreements.length === 0 ? (
                                <EmptyState
                                    icon={CheckCircle}
                                    title="Sin acuerdos"
                                    description="Los acuerdos terapéuticos aparecerán aquí."
                                />
                            ) : (
                                <Box
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="border"
                                    bg="bg.surface"
                                    overflow="hidden"
                                    boxShadow="sm"
                                >
                                    {patient.agreements.map((agreement, idx) => (
                                        <Flex
                                            key={agreement.id}
                                            alignItems="flex-start"
                                            gap="3"
                                            p="4"
                                            borderTopWidth={idx > 0 ? '1px' : undefined}
                                            borderColor="border.subtle"
                                        >
                                            <chakra.input
                                                type="checkbox"
                                                checked={agreement.is_completed}
                                                onChange={() => router.patch(`/patients/${patient.id}/agreements/${agreement.id}`, {
                                                    is_completed: !agreement.is_completed,
                                                })}
                                                mt="1"
                                                w="4"
                                                h="4"
                                                borderRadius="sm"
                                                borderWidth="1px"
                                                borderColor="border"
                                                accentColor="brand.solid"
                                            />
                                            <Box flex="1">
                                                <Text
                                                    fontSize="sm"
                                                    color={agreement.is_completed ? 'fg.subtle' : 'fg'}
                                                    textDecoration={agreement.is_completed ? 'line-through' : undefined}
                                                >
                                                    {agreement.content}
                                                </Text>
                                                <Text fontSize="xs" color="fg.subtle" mt="1">
                                                    {formatDate(agreement.created_at)}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    ))}
                                </Box>
                            )}
                        </Stack>
                    )}

                    {activeTab === 'notas' && (
                        <Stack gap="4">
                            <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
                                Notas de sesión
                            </Heading>
                            <form onSubmit={submitNote}>
                                <Box
                                    borderRadius="md"
                                    borderWidth="1px"
                                    borderColor="border"
                                    bg="bg.surface"
                                    transition="all 0.2s"
                                    _focusWithin={{
                                        borderColor: 'brand.solid',
                                        boxShadow: '0 0 0 3px var(--ck-colors-brand-muted)',
                                    }}
                                >
                                    <Textarea
                                        value={noteData.content}
                                        onChange={(e) => setNoteData('content', e.target.value)}
                                        placeholder="Escribe una nota rápida…"
                                        w="full"
                                        minH="80px"
                                        px="3"
                                        py="2"
                                        bg="transparent"
                                        resize="vertical"
                                        border="none"
                                        color="fg"
                                        fontSize="md"
                                        _placeholder={{ color: 'fg.subtle' }}
                                        _focusVisible={{ outline: 'none', boxShadow: 'none' }}
                                    />
                                    {noteData.content && (
                                        <Flex alignItems="center" justifyContent="space-between" px="3" py="2" borderTopWidth="1px" borderColor="border.subtle">
                                            <Text fontSize="xs" color="fg.subtle">
                                                {noteData.content.length} caracteres
                                            </Text>
                                            <Button type="submit" size="sm" variant="primary" loading={savingNote}>
                                                Guardar nota
                                            </Button>
                                        </Flex>
                                    )}
                                </Box>
                            </form>

                            {patient.notes.length === 0 ? (
                                <EmptyState
                                    icon={FileText}
                                    title="Sin notas todavía"
                                    description="Aquí irán tus notas de sesión y observaciones clave."
                                />
                            ) : (
                                <Box
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="border"
                                    bg="bg.surface"
                                    overflow="hidden"
                                    boxShadow="sm"
                                >
                                    {patient.notes.map((note, idx) => (
                                        <Box
                                            key={note.id}
                                            p="4"
                                            borderTopWidth={idx > 0 ? '1px' : undefined}
                                            borderColor="border.subtle"
                                        >
                                            <Text fontSize="sm" color="fg" whiteSpace="pre-wrap">
                                                {note.content}
                                            </Text>
                                            <Text fontSize="xs" color="fg.subtle" mt="2">
                                                {formatDate(note.created_at)}
                                            </Text>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Stack>
                    )}

                    {activeTab === 'documentos' && (
                        <Stack gap="4">
                            <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
                                Documentos
                            </Heading>
                            {patient.documents.length === 0 ? (
                                <EmptyState
                                    icon={Shield}
                                    title="Sin documentos"
                                    description="Guarda aquí los consentimientos RGPD, informes y documentos del paciente."
                                />
                            ) : (
                                <Box
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="border"
                                    bg="bg.surface"
                                    overflow="hidden"
                                    boxShadow="sm"
                                >
                                    {patient.documents.map((doc, idx) => (
                                        <Flex
                                            key={doc.id}
                                            alignItems="center"
                                            justifyContent="space-between"
                                            p="4"
                                            borderTopWidth={idx > 0 ? '1px' : undefined}
                                            borderColor="border.subtle"
                                        >
                                            <Box>
                                                <Text fontSize="sm" fontWeight="medium" color="fg">
                                                    {doc.name}
                                                </Text>
                                                <Text fontSize="xs" color="fg.subtle">
                                                    {formatDate(doc.created_at)}
                                                </Text>
                                            </Box>
                                            {doc.is_rgpd && (
                                                <Text
                                                    fontSize="xs"
                                                    px="2"
                                                    py="0.5"
                                                    borderRadius="full"
                                                    bg="purple.subtle"
                                                    color="purple.fg"
                                                >
                                                    RGPD
                                                </Text>
                                            )}
                                        </Flex>
                                    ))}
                                </Box>
                            )}
                        </Stack>
                    )}

                    {activeTab === 'cobros' && (
                        <Stack gap="4">
                            <Flex alignItems="center" justifyContent="space-between">
                                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
                                    Cobros
                                </Heading>
                            </Flex>
                            {patient.payments.length === 0 ? (
                                <EmptyState
                                    icon={Receipt}
                                    title="Sin cobros registrados"
                                    description="Aquí verás el historial de pagos de este paciente."
                                />
                            ) : (
                                <Box
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="border"
                                    bg="bg.surface"
                                    overflow="hidden"
                                    boxShadow="sm"
                                >
                                    <Table.Root size="sm">
                                        <Table.Header>
                                            <Table.Row bg="bg.subtle">
                                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                                    Fecha
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                                    Concepto
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider" textAlign="right">
                                                    Importe
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                                    Estado
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {patient.payments.map((payment) => (
                                                <Table.Row key={payment.id} _hover={{ bg: 'bg.subtle' }} transition="colors 0.2s">
                                                    <Table.Cell color="fg">{formatDate(payment.due_date)}</Table.Cell>
                                                    <Table.Cell color="fg.muted">{payment.concept ?? 'Sesión'}</Table.Cell>
                                                    <Table.Cell textAlign="right" fontWeight="medium" color="fg" fontVariantNumeric="tabular-nums">
                                                        €{Number(payment.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <StatusBadge status={payment.status as 'paid' | 'pending' | 'overdue'} variant="subtle" />
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>
                            )}
                        </Stack>
                    )}

                </Box>
            </Flex>
        </>
    );
}

PatientShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
