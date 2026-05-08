import { Box, Flex, Grid, Heading, Separator, Stack, Table, Text, Textarea } from '@chakra-ui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarClock, CheckCircle, FileText, Pencil, Receipt, Shield, Sparkles, Trash2, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import AgreementDestroyAction from '@/actions/App/Http/Controllers/Agreement/DestroyAction';
import AgreementUpdateAction from '@/actions/App/Http/Controllers/Agreement/UpdateAction';
import DocumentDestroyAction from '@/actions/App/Http/Controllers/Document/DestroyAction';
import NoteDestroyAction from '@/actions/App/Http/Controllers/Note/DestroyAction';
import NoteStoreAction from '@/actions/App/Http/Controllers/Note/StoreAction';
import NoteUpdateAction from '@/actions/App/Http/Controllers/Note/UpdateAction';
import { EmptyState } from '@/components/empty-state';
import { PatientHeader } from '@/components/patient/patient-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import type { Agreement, ConsentForm, ConsultingSessionType, Document, Note, Patient, Payment } from '@/types';

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

const formatCurrency = (amount: number | string) =>
    `€${Number(amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;

interface SectionHeaderProps {
    icon: React.ElementType;
    title: string;
    action?: ReactNode;
}

const SectionHeader = ({ icon: Icon, title, action }: SectionHeaderProps) => (
    <Flex alignItems="center" justifyContent="space-between" gap="3">
        <Flex alignItems="center" gap="2">
            <Flex
                w="7"
                h="7"
                borderRadius="md"
                bg="brand.subtle"
                color="brand.fg"
                alignItems="center"
                justifyContent="center"
            >
                <Box as={Icon} w="4" h="4" />
            </Flex>
            <Heading
                as="h3"
                fontSize="lg"
                fontWeight="semibold"
                fontFamily="heading"
                color="fg"
                letterSpacing="-0.01em"
            >
                {title}
            </Heading>
        </Flex>
        {action}
    </Flex>
);

interface SectionCardProps {
    children: ReactNode;
    p?: string | number;
}

const SectionCard = ({ children, p = '5' }: SectionCardProps) => (
    <Box
        borderRadius="xl"
        borderWidth="1px"
        borderColor="border.subtle"
        bg="bg.surface"
        p={p}
        boxShadow="sm"
        transition="box-shadow 200ms, border-color 200ms"
    >
        {children}
    </Box>
);

export default function PatientShow({ patient }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('resumen');
    const [noteFocused, setNoteFocused] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editingNoteContent, setEditingNoteContent] = useState('');
    const [editingAgreementId, setEditingAgreementId] = useState<number | null>(null);
    const [editingAgreementContent, setEditingAgreementContent] = useState('');

    const { data: noteData, setData: setNoteData, post: postNote, processing: savingNote, reset: resetNote } = useForm({
        content: '',
        type: 'quick_note' as const,
    });

    const tabs: { key: Tab; label: string; icon: React.ElementType; count?: number }[] = [
        { key: 'resumen', label: 'Resumen', icon: User },
        { key: 'acuerdos', label: 'Acuerdos', icon: CheckCircle, count: patient.agreements.length },
        { key: 'notas', label: 'Notas', icon: FileText, count: patient.notes.length },
        { key: 'documentos', label: 'Documentos', icon: Shield, count: patient.documents.length },
        { key: 'cobros', label: 'Cobros', icon: Receipt, count: patient.payments.length },
    ];

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        postNote(NoteStoreAction.url(patient.id), {
            onSuccess: () => {
                resetNote();
                setNoteFocused(false);
            },
        });
    };

    const saveNote = (noteId: number) => {
        router.patch(NoteUpdateAction.url({ patient: patient.id, note: noteId }), { content: editingNoteContent }, {
            onSuccess: () => setEditingNoteId(null),
        });
    };

    const deleteNote = (noteId: number) => {
        router.delete(NoteDestroyAction.url({ patient: patient.id, note: noteId }));
    };

    const saveAgreement = (agreementId: number) => {
        router.patch(AgreementUpdateAction.url({ patient: patient.id, agreement: agreementId }), { content: editingAgreementContent }, {
            onSuccess: () => setEditingAgreementId(null),
        });
    };

    const deleteAgreement = (agreementId: number) => {
        router.delete(AgreementDestroyAction.url({ patient: patient.id, agreement: agreementId }));
    };

    const deleteDocument = (documentId: number) => {
        router.delete(DocumentDestroyAction.url({ patient: patient.id, document: documentId }));
    };

    const upcomingSession = patient.sessions[0];
    const recentSessions = patient.sessions.slice(0, 3);
    const totalPaid = patient.payments
        .filter((p) => p.status === 'paid')
        .reduce((acc, p) => acc + Number(p.amount), 0);

    return (
        <>
            <Head title={`${patient.name ?? patient.project_name ?? 'Paciente'} — ClientKosmos`} />

            <Flex direction="column" minH="100vh" bg="bg">
                <PatientHeader patient={patient} />

                <Box
                    borderBottomWidth="1px"
                    borderColor="border.subtle"
                    bg="bg.surface"
                    px={{ base: '4', lg: '8' }}
                    position="sticky"
                    top="73px"
                    zIndex="sticky"
                    backdropFilter="saturate(180%) blur(8px)"
                >
                    <Flex gap="1" overflowX="auto" role="tablist" aria-label="Secciones del paciente">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;
                            return (
                                <Flex
                                    as="button"
                                    key={tab.key}
                                    role="tab"
                                    aria-selected={isActive}
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
                                    transition="color 200ms, border-color 200ms, background-color 200ms"
                                    _hover={{ color: isActive ? 'brand.solid' : 'fg', bg: isActive ? undefined : 'bg.subtle' }}
                                    _focusVisible={{
                                        outline: '2px solid',
                                        outlineColor: 'brand.solid',
                                        outlineOffset: '-2px',
                                        borderRadius: 'sm',
                                    }}
                                >
                                    <Box as={tab.icon} w="4" h="4" />
                                    {tab.label}
                                    {typeof tab.count === 'number' && tab.count > 0 && (
                                        <Box
                                            as="span"
                                            ml="0.5"
                                            px="1.5"
                                            minW="5"
                                            h="5"
                                            display="inline-flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            borderRadius="full"
                                            bg={isActive ? 'brand.subtle' : 'bg.subtle'}
                                            color={isActive ? 'brand.fg' : 'fg.muted'}
                                        >
                                            {tab.count}
                                        </Box>
                                    )}
                                </Flex>
                            );
                        })}
                    </Flex>
                </Box>

                <Box
                    p={{ base: '5', lg: '8' }}
                    maxW="5xl"
                    mx="auto"
                    w="full"
                    role="tabpanel"
                >
                    {activeTab === 'resumen' && (
                        <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' }} gap="6">
                            <Stack gap="6">
                                <SectionCard>
                                    <Stack gap="4">
                                        <SectionHeader icon={User} title="Datos del paciente" />
                                        <Stack as="dl" gap="3.5">
                                            {(patient.consultation_reason ?? patient.service_scope) && (
                                                <Box>
                                                    <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" fontWeight="medium">
                                                        Motivo de consulta
                                                    </Text>
                                                    <Text as="dd" fontSize="sm" color="fg" mt="1" lineHeight="short">
                                                        {patient.consultation_reason ?? patient.service_scope}
                                                    </Text>
                                                </Box>
                                            )}
                                            {(patient.therapeutic_approach ?? patient.brand_tone) && (
                                                <Box>
                                                    <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" fontWeight="medium">
                                                        Enfoque terapéutico
                                                    </Text>
                                                    <Text as="dd" fontSize="sm" color="fg" mt="1" lineHeight="short">
                                                        {patient.therapeutic_approach ?? patient.brand_tone}
                                                    </Text>
                                                </Box>
                                            )}
                                            {patient.last_session_at && (
                                                <Box>
                                                    <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" fontWeight="medium">
                                                        Última sesión
                                                    </Text>
                                                    <Text as="dd" fontSize="sm" color="fg" mt="1" lineHeight="short">
                                                        {formatDate(patient.last_session_at)}
                                                    </Text>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Stack>
                                </SectionCard>

                            </Stack>

                            <Stack gap="6">
                                {upcomingSession && (
                                    <SectionCard>
                                        <Stack gap="3">
                                            <SectionHeader icon={CalendarClock} title="Próxima sesión" />
                                            <Flex alignItems="baseline" gap="3" flexWrap="wrap">
                                                <Text fontSize="xl" fontWeight="semibold" color="fg" fontFamily="heading">
                                                    {formatDateTime(upcomingSession.scheduled_at)}
                                                </Text>
                                                <Text
                                                    fontSize="xs"
                                                    px="2"
                                                    py="0.5"
                                                    borderRadius="full"
                                                    bg="bg.subtle"
                                                    color="fg.muted"
                                                    fontWeight="medium"
                                                >
                                                    {upcomingSession.duration_minutes ?? 50} min
                                                </Text>
                                            </Flex>
                                        </Stack>
                                    </SectionCard>
                                )}

                                {recentSessions.length > 0 ? (
                                    <SectionCard p="0">
                                        <Box px="5" pt="5" pb="3">
                                            <SectionHeader icon={FileText} title="Últimas sesiones" />
                                        </Box>
                                        <Stack gap="0">
                                            {recentSessions.map((session) => (
                                                <Box
                                                    key={session.id}
                                                    px="5"
                                                    py="4"
                                                    borderTopWidth="1px"
                                                    borderColor="border.subtle"
                                                >
                                                    <Flex alignItems="center" justifyContent="space-between" gap="3">
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
                                                            fontWeight="medium"
                                                            flexShrink={0}
                                                        >
                                                            {session.duration_minutes ?? 50} min
                                                        </Text>
                                                    </Flex>
                                                    {session.ai_summary && (
                                                        <Flex
                                                            alignItems="flex-start"
                                                            gap="2"
                                                            mt="2.5"
                                                            p="2.5"
                                                            borderRadius="md"
                                                            bg="kosmo.subtle"
                                                        >
                                                            <Box as={Sparkles} w="4" h="4" mt="0.5" color="kosmo.solid" flexShrink={0} />
                                                            <Text fontSize="sm" color="fg.muted" lineClamp={2} lineHeight="short">
                                                                {session.ai_summary}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                </Box>
                                            ))}
                                        </Stack>
                                    </SectionCard>
                                ) : (
                                    <SectionCard>
                                        <SectionHeader icon={FileText} title="Últimas sesiones" />
                                        <Text fontSize="sm" color="fg.muted" mt="3">
                                            Las sesiones aparecerán aquí conforme las vayas completando.
                                        </Text>
                                    </SectionCard>
                                )}
                            </Stack>
                        </Grid>
                    )}

                    {activeTab === 'acuerdos' && (
                        <Stack gap="5">
                            <SectionHeader icon={CheckCircle} title="Acuerdos terapéuticos" />
                            {patient.agreements.length === 0 ? (
                                <EmptyState
                                    icon={CheckCircle}
                                    title="Sin acuerdos"
                                    description="Los acuerdos terapéuticos aparecerán aquí."
                                />
                            ) : (
                                <SectionCard p="0">
                                    {patient.agreements.map((agreement, idx) => (
                                        <Flex
                                            key={agreement.id}
                                            alignItems="flex-start"
                                            gap="3"
                                            p="4"
                                            borderTopWidth={idx > 0 ? '1px' : undefined}
                                            borderColor="border.subtle"
                                            transition="background-color 150ms"
                                            _hover={{ bg: 'bg.subtle' }}
                                        >
                                            <Box mt="0.5">
                                                <Checkbox
                                                    checked={agreement.is_completed}
                                                    onCheckedChange={() =>
                                                        router.patch(AgreementUpdateAction.url({ patient: patient.id, agreement: agreement.id }), {
                                                            is_completed: !agreement.is_completed,
                                                        })
                                                    }
                                                />
                                            </Box>
                                            <Box flex="1" minW="0">
                                                {editingAgreementId === agreement.id ? (
                                                    <Stack gap="2">
                                                        <Textarea
                                                            value={editingAgreementContent}
                                                            onChange={(e) => setEditingAgreementContent(e.target.value)}
                                                            autoFocus
                                                            minH="80px"
                                                            fontSize="sm"
                                                            resize="vertical"
                                                        />
                                                        <Flex gap="2">
                                                            <Button size="sm" variant="primary" onClick={() => saveAgreement(agreement.id)} disabled={!editingAgreementContent.trim()}>
                                                                Guardar
                                                            </Button>
                                                            <Button size="sm" variant="secondary" onClick={() => setEditingAgreementId(null)}>
                                                                Cancelar
                                                            </Button>
                                                        </Flex>
                                                    </Stack>
                                                ) : (
                                                    <>
                                                        <Text
                                                            fontSize="sm"
                                                            color={agreement.is_completed ? 'fg.subtle' : 'fg'}
                                                            textDecoration={agreement.is_completed ? 'line-through' : undefined}
                                                            lineHeight="short"
                                                        >
                                                            {agreement.content}
                                                        </Text>
                                                        <Text fontSize="xs" color="fg.subtle" mt="1.5">
                                                            {formatDate(agreement.created_at)}
                                                        </Text>
                                                    </>
                                                )}
                                            </Box>
                                            {editingAgreementId !== agreement.id && (
                                                <Flex gap="1" flexShrink={0}>
                                                    <Box
                                                        as="button"
                                                        p="1.5"
                                                        borderRadius="md"
                                                        color="fg.muted"
                                                        _hover={{ color: 'fg', bg: 'bg.muted' }}
                                                        onClick={() => { setEditingAgreementId(agreement.id); setEditingAgreementContent(agreement.content); }}
                                                        aria-label="Editar acuerdo"
                                                    >
                                                        <Box as={Pencil} w="3.5" h="3.5" />
                                                    </Box>
                                                    <Box
                                                        as="button"
                                                        p="1.5"
                                                        borderRadius="md"
                                                        color="fg.muted"
                                                        _hover={{ color: 'red.fg', bg: 'red.subtle' }}
                                                        onClick={() => deleteAgreement(agreement.id)}
                                                        aria-label="Eliminar acuerdo"
                                                    >
                                                        <Box as={Trash2} w="3.5" h="3.5" />
                                                    </Box>
                                                </Flex>
                                            )}
                                        </Flex>
                                    ))}
                                </SectionCard>
                            )}
                        </Stack>
                    )}

                    {activeTab === 'notas' && (
                        <Stack gap="5">
                            <SectionHeader icon={FileText} title="Notas de sesión" />

                            <form onSubmit={submitNote}>
                                <Box
                                    borderRadius="md"
                                    borderWidth="1px"
                                    borderColor={noteFocused ? 'brand.solid' : 'border'}
                                    bg="bg.surface"
                                    transition="border-color 200ms, box-shadow 200ms"
                                    boxShadow={noteFocused ? '0 0 0 3px var(--ck-colors-brand-muted)' : 'none'}
                                >
                                    <Textarea
                                        value={noteData.content}
                                        onChange={(e) => setNoteData('content', e.target.value)}
                                        onFocus={() => setNoteFocused(true)}
                                        onBlur={() => noteData.content.length === 0 && setNoteFocused(false)}
                                        placeholder="Escribe una nota rápida…"
                                        w="full"
                                        minH={noteFocused ? '120px' : '64px'}
                                        px="3"
                                        py="2.5"
                                        bg="transparent"
                                        resize="vertical"
                                        border="none"
                                        color="fg"
                                        fontSize="md"
                                        lineHeight="short"
                                        _placeholder={{ color: 'fg.subtle' }}
                                        _focusVisible={{ outline: 'none', boxShadow: 'none' }}
                                        transition="min-height 200ms"
                                    />
                                    {(noteFocused || noteData.content) && (
                                        <Flex
                                            alignItems="center"
                                            justifyContent="space-between"
                                            px="3"
                                            py="2"
                                            borderTopWidth="1px"
                                            borderColor="border.subtle"
                                        >
                                            <Text fontSize="xs" color="fg.subtle">
                                                {noteData.content.length} caracteres
                                            </Text>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="primary"
                                                loading={savingNote}
                                                disabled={!noteData.content.trim()}
                                            >
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
                                <SectionCard p="0">
                                    {patient.notes.map((note, idx) => (
                                        <Box
                                            key={note.id}
                                            p="4"
                                            borderTopWidth={idx > 0 ? '1px' : undefined}
                                            borderColor="border.subtle"
                                        >
                                            {editingNoteId === note.id ? (
                                                <Stack gap="2">
                                                    <Textarea
                                                        value={editingNoteContent}
                                                        onChange={(e) => setEditingNoteContent(e.target.value)}
                                                        autoFocus
                                                        minH="100px"
                                                        fontSize="sm"
                                                        resize="vertical"
                                                    />
                                                    <Flex gap="2">
                                                        <Button size="sm" variant="primary" onClick={() => saveNote(note.id)} disabled={!editingNoteContent.trim()}>
                                                            Guardar
                                                        </Button>
                                                        <Button size="sm" variant="secondary" onClick={() => setEditingNoteId(null)}>
                                                            Cancelar
                                                        </Button>
                                                    </Flex>
                                                </Stack>
                                            ) : (
                                                <Flex gap="3" alignItems="flex-start">
                                                    <Box flex="1" minW="0">
                                                        <Text fontSize="sm" color="fg" whiteSpace="pre-wrap" lineHeight="tall">
                                                            {note.content}
                                                        </Text>
                                                        <Text fontSize="xs" color="fg.subtle" mt="2.5">
                                                            {formatDate(note.created_at)}
                                                        </Text>
                                                    </Box>
                                                    <Flex gap="1" flexShrink={0}>
                                                        <Box
                                                            as="button"
                                                            p="1.5"
                                                            borderRadius="md"
                                                            color="fg.muted"
                                                            _hover={{ color: 'fg', bg: 'bg.muted' }}
                                                            onClick={() => { setEditingNoteId(note.id); setEditingNoteContent(note.content); }}
                                                            aria-label="Editar nota"
                                                        >
                                                            <Box as={Pencil} w="3.5" h="3.5" />
                                                        </Box>
                                                        <Box
                                                            as="button"
                                                            p="1.5"
                                                            borderRadius="md"
                                                            color="fg.muted"
                                                            _hover={{ color: 'red.fg', bg: 'red.subtle' }}
                                                            onClick={() => deleteNote(note.id)}
                                                            aria-label="Eliminar nota"
                                                        >
                                                            <Box as={Trash2} w="3.5" h="3.5" />
                                                        </Box>
                                                    </Flex>
                                                </Flex>
                                            )}
                                        </Box>
                                    ))}
                                </SectionCard>
                            )}
                        </Stack>
                    )}

                    {activeTab === 'documentos' && (
                        <Stack gap="5">
                            <SectionHeader icon={Shield} title="Documentos" />
                            {patient.documents.length === 0 ? (
                                <EmptyState
                                    icon={Shield}
                                    title="Sin documentos"
                                    description="Guarda aquí los consentimientos RGPD, informes y documentos del paciente."
                                />
                            ) : (
                                <SectionCard p="0">
                                    {patient.documents.map((doc, idx) => (
                                        <Flex
                                            key={doc.id}
                                            alignItems="center"
                                            justifyContent="space-between"
                                            gap="3"
                                            p="4"
                                            borderTopWidth={idx > 0 ? '1px' : undefined}
                                            borderColor="border.subtle"
                                            transition="background-color 150ms"
                                            _hover={{ bg: 'bg.subtle' }}
                                        >
                                            <Flex alignItems="center" gap="3" minW="0">
                                                <Flex
                                                    w="9"
                                                    h="9"
                                                    borderRadius="md"
                                                    bg="bg.subtle"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexShrink={0}
                                                    color="fg.muted"
                                                >
                                                    <Box as={FileText} w="4" h="4" />
                                                </Flex>
                                                <Box minW="0">
                                                    <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
                                                        {doc.name}
                                                    </Text>
                                                    <Text fontSize="xs" color="fg.subtle" mt="0.5">
                                                        {formatDate(doc.created_at)}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Flex gap="2" alignItems="center" flexShrink={0}>
                                                {doc.is_rgpd && (
                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                        px="2"
                                                        py="0.5"
                                                        borderRadius="full"
                                                        bg="purple.subtle"
                                                        color="purple.fg"
                                                    >
                                                        RGPD
                                                    </Text>
                                                )}
                                                <Box
                                                    as="button"
                                                    p="1.5"
                                                    borderRadius="md"
                                                    color="fg.muted"
                                                    _hover={{ color: 'red.fg', bg: 'red.subtle' }}
                                                    onClick={() => deleteDocument(doc.id)}
                                                    aria-label="Eliminar documento"
                                                >
                                                    <Box as={Trash2} w="3.5" h="3.5" />
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    ))}
                                </SectionCard>
                            )}
                        </Stack>
                    )}

                    {activeTab === 'cobros' && (
                        <Stack gap="5">
                            <SectionHeader
                                icon={Receipt}
                                title="Cobros"
                                action={
                                    patient.payments.length > 0 ? (
                                        <Text fontSize="sm" color="fg.muted">
                                            Total cobrado{' '}
                                            <Text as="span" color="fg" fontWeight="semibold" fontVariantNumeric="tabular-nums">
                                                {formatCurrency(totalPaid)}
                                            </Text>
                                        </Text>
                                    ) : undefined
                                }
                            />
                            {patient.payments.length === 0 ? (
                                <EmptyState
                                    icon={Receipt}
                                    title="Sin cobros registrados"
                                    description="Aquí verás el historial de pagos de este paciente."
                                />
                            ) : (
                                <SectionCard p="0">
                                    <Table.Root size="sm" variant="line">
                                        <Table.Header>
                                            <Table.Row bg="bg.subtle">
                                                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                                    Fecha
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                                    Concepto
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" textAlign="right">
                                                    Importe
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                                    Estado
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {patient.payments.map((payment) => (
                                                <Table.Row
                                                    key={payment.id}
                                                    _hover={{ bg: 'bg.subtle' }}
                                                    transition="background-color 150ms"
                                                >
                                                    <Table.Cell color="fg" fontVariantNumeric="tabular-nums">
                                                        {formatDate(payment.due_date)}
                                                    </Table.Cell>
                                                    <Table.Cell color="fg.muted">
                                                        {payment.concept ?? 'Sesión'}
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="right" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums">
                                                        {formatCurrency(payment.amount)}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <StatusBadge status={payment.status as 'paid' | 'pending' | 'overdue'} variant="subtle" />
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                    <Separator />
                                    <Flex px="4" py="3" justifyContent="flex-end" alignItems="center" gap="3" bg="bg.subtle">
                                        <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" fontWeight="medium">
                                            Total cobrado
                                        </Text>
                                        <Text fontSize="md" fontWeight="semibold" color="fg" fontVariantNumeric="tabular-nums">
                                            {formatCurrency(totalPaid)}
                                        </Text>
                                    </Flex>
                                </SectionCard>
                            )}
                        </Stack>
                    )}
                </Box>
            </Flex>
        </>
    );
}

PatientShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
