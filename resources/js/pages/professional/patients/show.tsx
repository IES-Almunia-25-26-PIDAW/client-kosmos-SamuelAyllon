import { Box, Flex, Grid, Heading, Separator, Stack, Table, Text, Textarea } from '@chakra-ui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarClock, CheckCircle, Download, FileText, Pencil, Receipt, Shield, Sparkles, Trash2, User } from 'lucide-react';
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

interface SectionPanelProps {
    title: string;
    children: ReactNode;
    onAdd?: () => void;
}

const SectionPanel = ({ title, children, onAdd }: SectionPanelProps) => (
    <Box borderRadius="xl" overflow="hidden" borderWidth="1px" borderColor="border.subtle" boxShadow="sm">
        <Box bg="brand.solid" px="5" py="3.5">
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontFamily="heading" fontSize="xl" fontWeight="bold" color="white" letterSpacing="-0.01em">
                    {title}
                </Text>
                {onAdd && (
                    <Box
                        as="button"
                        w="7"
                        h="7"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="md"
                        color="white"
                        fontSize="xl"
                        fontWeight="bold"
                        transition="background-color 150ms"
                        _hover={{ bg: 'rgba(255,255,255,0.15)' }}
                        onClick={onAdd}
                        aria-label={`Añadir ${title}`}
                    >
                        +
                    </Box>
                )}
            </Flex>
        </Box>
        <Box borderRightWidth="3px" borderRightColor="brand.solid">
            {children}
        </Box>
    </Box>
);

const AgreementStatusBadge = ({ isCompleted }: { isCompleted: boolean }) => (
    <Box
        as="span"
        display="inline-block"
        fontSize="9px"
        fontWeight="semibold"
        letterSpacing="wide"
        textTransform="uppercase"
        px="2"
        py="0.5"
        borderRadius="sm"
        bg={isCompleted ? 'success.subtle' : 'warning.subtle'}
        color={isCompleted ? 'success.fg' : 'warning.fg'}
    >
        {isCompleted ? 'Completado' : 'En progreso'}
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
        { key: 'documentos', label: 'Recursos', icon: Shield, count: patient.documents.length },
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

    const totalPaid = patient.payments
        .filter((p) => p.status === 'paid')
        .reduce((acc, p) => acc + Number(p.amount), 0);

    const totalPending = patient.payments
        .filter((p) => p.status === 'pending')
        .reduce((acc, p) => acc + Number(p.amount), 0);

    const paidCount = patient.payments.filter((p) => p.status === 'paid').length;

    const aiSummary = patient.sessions.find((s) => s.ai_summary)?.ai_summary;

    const upcomingSession = patient.sessions[0];

    return (
        <>
            <Head title={`${patient.name ?? patient.project_name ?? 'Paciente'} — ClientKosmos`} />

            <Flex direction="column" minH="100vh" bg="bg">
                <PatientHeader patient={patient} />

                {/* Tab nav */}
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
                    <Flex gap="0" overflowX="auto" role="tablist" aria-label="Secciones del paciente">
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
                                    px="5"
                                    py="3.5"
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    letterSpacing="wider"
                                    textTransform="uppercase"
                                    whiteSpace="nowrap"
                                    borderBottomWidth="2px"
                                    borderColor={isActive ? 'brand.solid' : 'transparent'}
                                    color={isActive ? 'brand.solid' : 'fg.muted'}
                                    transition="color 200ms, border-color 200ms"
                                    _hover={{ color: isActive ? 'brand.solid' : 'fg' }}
                                    _focusVisible={{
                                        outline: '2px solid',
                                        outlineColor: 'brand.solid',
                                        outlineOffset: '-2px',
                                        borderRadius: 'sm',
                                    }}
                                >
                                    {tab.label}
                                    {typeof tab.count === 'number' && tab.count > 0 && (
                                        <Box
                                            as="span"
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
                    maxW="7xl"
                    mx="auto"
                    w="full"
                    role="tabpanel"
                >
                    {/* ── RESUMEN ─────────────────────────────────── */}
                    {activeTab === 'resumen' && (
                        <Grid
                            templateColumns={{ base: '1fr', xl: '1fr 320px' }}
                            gap="8"
                            alignItems="flex-start"
                        >
                            {/* Left: clinical summary + agreements & resources */}
                            <Stack gap="6">
                                {/* AI clinical summary */}
                                {aiSummary && (
                                    <Box
                                        bg="brand.subtle"
                                        borderLeftWidth="4px"
                                        borderLeftColor="brand.solid"
                                        borderRightRadius="xl"
                                        px="6"
                                        py="5"
                                        position="relative"
                                        overflow="hidden"
                                    >
                                        <Flex gap="2" alignItems="center" mb="3">
                                            <Box as={Sparkles} w="4" h="4" color="brand.solid" />
                                            <Text
                                                fontSize="xs"
                                                fontWeight="semibold"
                                                color="brand.solid"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                            >
                                                Resumen clínico
                                            </Text>
                                        </Flex>
                                        <Text fontSize="md" fontStyle="italic" color="fg.muted" lineHeight="tall">
                                            "{aiSummary}"
                                        </Text>
                                    </Box>
                                )}

                                {/* Agreements + Resources two-column panels */}
                                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="5" alignItems="flex-start">
                                    {/* Agreements panel */}
                                    <SectionPanel title="Acuerdos Terapéuticos">
                                        {patient.agreements.length === 0 ? (
                                            <Box p="5">
                                                <Text fontSize="sm" color="fg.subtle">
                                                    Aún no hay acuerdos registrados.
                                                </Text>
                                            </Box>
                                        ) : (
                                            <Stack gap="0">
                                                {patient.agreements.map((agreement, idx) => (
                                                    <Box
                                                        key={agreement.id}
                                                        p="4"
                                                        borderTopWidth={idx > 0 ? '1px' : undefined}
                                                        borderColor="border.subtle"
                                                        bg="bg.surface"
                                                        transition="background-color 150ms"
                                                        _hover={{ bg: 'bg.subtle' }}
                                                    >
                                                        <Flex justifyContent="space-between" alignItems="flex-start" mb="1.5">
                                                            <Text
                                                                fontSize="10px"
                                                                fontWeight="semibold"
                                                                color="fg.subtle"
                                                                textTransform="uppercase"
                                                                letterSpacing="wide"
                                                            >
                                                                {formatDate(agreement.created_at)}
                                                            </Text>
                                                            <AgreementStatusBadge isCompleted={agreement.is_completed} />
                                                        </Flex>
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="semibold"
                                                            color={agreement.is_completed ? 'brand.solid' : 'fg'}
                                                            lineHeight="short"
                                                            textDecoration={agreement.is_completed ? 'line-through' : undefined}
                                                        >
                                                            {agreement.content}
                                                        </Text>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        )}
                                    </SectionPanel>

                                    {/* Resources panel */}
                                    <SectionPanel title="Recursos">
                                        {patient.documents.length === 0 ? (
                                            <Box p="5">
                                                <Text fontSize="sm" color="fg.subtle">
                                                    Sin documentos archivados.
                                                </Text>
                                            </Box>
                                        ) : (
                                            <Stack gap="0">
                                                {patient.documents.map((doc, idx) => (
                                                    <Flex
                                                        key={doc.id}
                                                        alignItems="center"
                                                        gap="3"
                                                        px="4"
                                                        py="3.5"
                                                        borderTopWidth={idx > 0 ? '1px' : undefined}
                                                        borderColor="border.subtle"
                                                        bg="bg.surface"
                                                        transition="background-color 150ms"
                                                        _hover={{ bg: 'bg.subtle' }}
                                                    >
                                                        <Flex
                                                            w="8"
                                                            h="8"
                                                            borderRadius="md"
                                                            bg="bg.subtle"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            flexShrink={0}
                                                        >
                                                            <Box as={FileText} w="4" h="4" color="fg.muted" />
                                                        </Flex>
                                                        <Box flex="1" minW="0">
                                                            <Text fontSize="sm" fontWeight="medium" color="fg" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                                                {doc.name}
                                                            </Text>
                                                            <Text fontSize="xs" color="fg.subtle" mt="0.5">
                                                                {formatDate(doc.created_at)}
                                                            </Text>
                                                        </Box>
                                                        <Box as={Download} w="4" h="4" color="fg.subtle" flexShrink={0} />
                                                    </Flex>
                                                ))}
                                            </Stack>
                                        )}
                                    </SectionPanel>
                                </Grid>
                            </Stack>

                            {/* Right sidebar */}
                            <Stack gap="5">
                                {/* Billing summary */}
                                <Box bg="brand.solid" borderRadius="3xl" p="7">
                                    <Flex justifyContent="space-between" alignItems="flex-start" mb="5">
                                        <Heading fontFamily="heading" fontSize="lg" fontWeight="bold" color="white">
                                            Resumen de cobros
                                        </Heading>
                                        <Box as={Receipt} w="5" h="5" color="white" opacity={0.6} flexShrink={0} />
                                    </Flex>
                                    <Text
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        color="white"
                                        opacity={0.7}
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        mb="1"
                                    >
                                        Total cobrado
                                    </Text>
                                    <Text
                                        fontSize="4xl"
                                        fontWeight="bold"
                                        color="white"
                                        letterSpacing="-0.04em"
                                        lineHeight="1"
                                        mb="6"
                                        fontVariantNumeric="tabular-nums"
                                    >
                                        {formatCurrency(totalPaid)}
                                    </Text>
                                    <Stack gap="0" mb="6">
                                        <Flex
                                            justifyContent="space-between"
                                            alignItems="center"
                                            py="2.5"
                                            borderBottomWidth="1px"
                                            borderColor="rgba(255,255,255,0.12)"
                                        >
                                            <Text fontSize="sm" color="white" opacity={0.8}>
                                                Pagos completados
                                            </Text>
                                            <Text fontSize="sm" fontWeight="semibold" color="white">
                                                {paidCount}
                                            </Text>
                                        </Flex>
                                        <Flex
                                            justifyContent="space-between"
                                            alignItems="center"
                                            py="2.5"
                                            borderBottomWidth="1px"
                                            borderColor="rgba(255,255,255,0.12)"
                                        >
                                            <Text fontSize="sm" color="white" opacity={0.8}>
                                                Pendiente
                                            </Text>
                                            <Text fontSize="sm" fontWeight="semibold" color="white" fontVariantNumeric="tabular-nums">
                                                {formatCurrency(totalPending)}
                                            </Text>
                                        </Flex>
                                    </Stack>
                                    <Box
                                        as="button"
                                        w="full"
                                        bg="white"
                                        borderRadius="xl"
                                        py="3.5"
                                        textAlign="center"
                                        boxShadow="md"
                                        transition="opacity 150ms"
                                        _hover={{ opacity: 0.9 }}
                                        onClick={() => setActiveTab('cobros')}
                                    >
                                        <Text fontSize="xs" fontWeight="semibold" color="brand.solid" textTransform="uppercase" letterSpacing="wider">
                                            Ver todos los cobros
                                        </Text>
                                    </Box>
                                </Box>

                                {/* Patient data */}
                                <Box bg="bg.surface" borderRadius="3xl" borderWidth="1px" borderColor="border.subtle" p="6" boxShadow="sm">
                                    <Stack gap="4">
                                        <Flex alignItems="center" gap="2" mb="1">
                                            <Flex
                                                w="7"
                                                h="7"
                                                borderRadius="md"
                                                bg="brand.subtle"
                                                color="brand.fg"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexShrink={0}
                                            >
                                                <Box as={User} w="4" h="4" />
                                            </Flex>
                                            <Heading fontSize="md" fontWeight="semibold" fontFamily="heading" color="fg">
                                                Datos del paciente
                                            </Heading>
                                        </Flex>
                                        <Stack as="dl" gap="3">
                                            {(patient.consultation_reason ?? patient.service_scope) && (
                                                <Box>
                                                    <Text as="dt" fontSize="10px" color="fg.subtle" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
                                                        Motivo de consulta
                                                    </Text>
                                                    <Text as="dd" fontSize="sm" color="fg" mt="1" lineHeight="short">
                                                        {patient.consultation_reason ?? patient.service_scope}
                                                    </Text>
                                                </Box>
                                            )}
                                            {(patient.therapeutic_approach ?? patient.brand_tone) && (
                                                <Box>
                                                    <Text as="dt" fontSize="10px" color="fg.subtle" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
                                                        Enfoque terapéutico
                                                    </Text>
                                                    <Text as="dd" fontSize="sm" color="fg" mt="1" lineHeight="short">
                                                        {patient.therapeutic_approach ?? patient.brand_tone}
                                                    </Text>
                                                </Box>
                                            )}
                                            {upcomingSession && (
                                                <Box>
                                                    <Text as="dt" fontSize="10px" color="fg.subtle" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
                                                        Próxima sesión
                                                    </Text>
                                                    <Flex alignItems="center" gap="2" mt="1">
                                                        <Box as={CalendarClock} w="4" h="4" color="brand.solid" />
                                                        <Text as="dd" fontSize="sm" color="fg" fontWeight="medium">
                                                            {formatDateTime(upcomingSession.scheduled_at)}
                                                        </Text>
                                                    </Flex>
                                                </Box>
                                            )}
                                            {patient.last_session_at && (
                                                <Box>
                                                    <Text as="dt" fontSize="10px" color="fg.subtle" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
                                                        Última sesión
                                                    </Text>
                                                    <Text as="dd" fontSize="sm" color="fg" mt="1">
                                                        {formatDate(patient.last_session_at)}
                                                    </Text>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Grid>
                    )}

                    {/* ── ACUERDOS ────────────────────────────────── */}
                    {activeTab === 'acuerdos' && (
                        <Stack gap="5" maxW="3xl">
                            <Flex alignItems="center" gap="2">
                                <Flex w="7" h="7" borderRadius="md" bg="brand.subtle" color="brand.fg" alignItems="center" justifyContent="center">
                                    <Box as={CheckCircle} w="4" h="4" />
                                </Flex>
                                <Heading fontSize="lg" fontWeight="semibold" fontFamily="heading" color="fg">
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
                                <Box borderRadius="xl" overflow="hidden" borderWidth="1px" borderColor="border.subtle" boxShadow="sm">
                                    <Box bg="brand.solid" px="5" py="3.5">
                                        <Text fontFamily="heading" fontSize="xl" fontWeight="bold" color="white">
                                            Acuerdos Terapéuticos
                                        </Text>
                                    </Box>
                                    <Box borderRightWidth="3px" borderRightColor="brand.solid">
                                        {patient.agreements.map((agreement, idx) => (
                                            <Flex
                                                key={agreement.id}
                                                alignItems="flex-start"
                                                gap="3"
                                                p="4"
                                                borderTopWidth={idx > 0 ? '1px' : undefined}
                                                borderColor="border.subtle"
                                                bg="bg.surface"
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
                                                            <Flex justifyContent="space-between" alignItems="flex-start" mb="1.5">
                                                                <Text
                                                                    fontSize="10px"
                                                                    fontWeight="semibold"
                                                                    color="fg.subtle"
                                                                    textTransform="uppercase"
                                                                    letterSpacing="wide"
                                                                >
                                                                    {formatDate(agreement.created_at)}
                                                                </Text>
                                                                <AgreementStatusBadge isCompleted={agreement.is_completed} />
                                                            </Flex>
                                                            <Text
                                                                fontSize="sm"
                                                                fontWeight="semibold"
                                                                color={agreement.is_completed ? 'brand.solid' : 'fg'}
                                                                textDecoration={agreement.is_completed ? 'line-through' : undefined}
                                                                lineHeight="short"
                                                            >
                                                                {agreement.content}
                                                            </Text>
                                                        </>
                                                    )}
                                                </Box>
                                                {editingAgreementId !== agreement.id && (
                                                    <Flex gap="1" flexShrink={0} mt="0.5">
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
                                                            _hover={{ color: 'danger.fg', bg: 'danger.subtle' }}
                                                            onClick={() => deleteAgreement(agreement.id)}
                                                            aria-label="Eliminar acuerdo"
                                                        >
                                                            <Box as={Trash2} w="3.5" h="3.5" />
                                                        </Box>
                                                    </Flex>
                                                )}
                                            </Flex>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Stack>
                    )}

                    {/* ── NOTAS ───────────────────────────────────── */}
                    {activeTab === 'notas' && (
                        <Stack gap="5" maxW="3xl">
                            <Flex alignItems="center" gap="2">
                                <Flex w="7" h="7" borderRadius="md" bg="brand.subtle" color="brand.fg" alignItems="center" justifyContent="center">
                                    <Box as={FileText} w="4" h="4" />
                                </Flex>
                                <Heading fontSize="lg" fontWeight="semibold" fontFamily="heading" color="fg">
                                    Notas de sesión
                                </Heading>
                            </Flex>

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
                                <Box borderRadius="xl" borderWidth="1px" borderColor="border.subtle" bg="bg.surface" boxShadow="sm" overflow="hidden">
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
                                                            _hover={{ color: 'danger.fg', bg: 'danger.subtle' }}
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
                                </Box>
                            )}
                        </Stack>
                    )}

                    {/* ── RECURSOS/DOCUMENTOS ─────────────────────── */}
                    {activeTab === 'documentos' && (
                        <Stack gap="5" maxW="3xl">
                            <Flex alignItems="center" gap="2">
                                <Flex w="7" h="7" borderRadius="md" bg="brand.subtle" color="brand.fg" alignItems="center" justifyContent="center">
                                    <Box as={Shield} w="4" h="4" />
                                </Flex>
                                <Heading fontSize="lg" fontWeight="semibold" fontFamily="heading" color="fg">
                                    Recursos
                                </Heading>
                            </Flex>

                            {patient.documents.length === 0 ? (
                                <EmptyState
                                    icon={Shield}
                                    title="Sin documentos"
                                    description="Guarda aquí los consentimientos RGPD, informes y documentos del paciente."
                                />
                            ) : (
                                <Box borderRadius="xl" overflow="hidden" borderWidth="1px" borderColor="border.subtle" boxShadow="sm">
                                    <Box bg="brand.solid" px="5" py="3.5">
                                        <Text fontFamily="heading" fontSize="xl" fontWeight="bold" color="white">
                                            Recursos
                                        </Text>
                                    </Box>
                                    <Box borderRightWidth="3px" borderRightColor="brand.solid">
                                        {patient.documents.map((doc, idx) => (
                                            <Flex
                                                key={doc.id}
                                                alignItems="center"
                                                justifyContent="space-between"
                                                gap="3"
                                                px="4"
                                                py="3.5"
                                                borderTopWidth={idx > 0 ? '1px' : undefined}
                                                borderColor="border.subtle"
                                                bg="bg.surface"
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
                                                        <Text fontSize="sm" fontWeight="medium" color="fg" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
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
                                                            bg="indigo.subtle"
                                                            color="indigo.fg"
                                                        >
                                                            RGPD
                                                        </Text>
                                                    )}
                                                    <Box as={Download} w="4" h="4" color="fg.muted" flexShrink={0} />
                                                    <Box
                                                        as="button"
                                                        p="1.5"
                                                        borderRadius="md"
                                                        color="fg.muted"
                                                        _hover={{ color: 'danger.fg', bg: 'danger.subtle' }}
                                                        onClick={() => deleteDocument(doc.id)}
                                                        aria-label="Eliminar documento"
                                                    >
                                                        <Box as={Trash2} w="3.5" h="3.5" />
                                                    </Box>
                                                </Flex>
                                            </Flex>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Stack>
                    )}

                    {/* ── COBROS ──────────────────────────────────── */}
                    {activeTab === 'cobros' && (
                        <Stack gap="5">
                            <Flex alignItems="center" justifyContent="space-between">
                                <Flex alignItems="center" gap="2">
                                    <Flex w="7" h="7" borderRadius="md" bg="brand.subtle" color="brand.fg" alignItems="center" justifyContent="center">
                                        <Box as={Receipt} w="4" h="4" />
                                    </Flex>
                                    <Heading fontSize="lg" fontWeight="semibold" fontFamily="heading" color="fg">
                                        Cobros
                                    </Heading>
                                </Flex>
                                {patient.payments.length > 0 && (
                                    <Text fontSize="sm" color="fg.muted">
                                        Total cobrado{' '}
                                        <Text as="span" color="fg" fontWeight="semibold" fontVariantNumeric="tabular-nums">
                                            {formatCurrency(totalPaid)}
                                        </Text>
                                    </Text>
                                )}
                            </Flex>

                            {patient.payments.length === 0 ? (
                                <EmptyState
                                    icon={Receipt}
                                    title="Sin cobros registrados"
                                    description="Aquí verás el historial de pagos de este paciente."
                                />
                            ) : (
                                <Box borderRadius="xl" overflow="hidden" borderWidth="1px" borderColor="border.subtle" boxShadow="sm">
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
