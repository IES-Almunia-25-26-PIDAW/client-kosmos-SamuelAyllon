import {
    Badge,
    Box,
    Button,
    Card,
    Field,
    Flex,
    Grid,
    Heading,
    Input,
    NativeSelect,
    Skeleton,
    Stack,
    Text,
    Textarea,
    chakra,
} from '@chakra-ui/react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { ArrowLeft, Check, ExternalLink, FileText, PencilLine, Sparkles } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import AgreementStoreAction from '@/actions/App/Http/Controllers/Agreement/StoreAction';
import FinalizeAndNotifyAction from '@/actions/App/Http/Controllers/Appointment/FinalizeAndNotifyAction';
import InvoiceEditAction from '@/actions/App/Http/Controllers/Invoice/EditAction';
import InvoiceReviewAction from '@/actions/App/Http/Controllers/Invoice/ReviewAction';
import InvoiceStoreAction from '@/actions/App/Http/Controllers/Invoice/StoreAction';
import NoteStoreAction from '@/actions/App/Http/Controllers/Note/StoreAction';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';
import AppLayout from '@/layouts/app-layout';
import type { Patient } from '@/types';

const ChakraLink = chakra(Link);

type LastAppointment = {
    id: number;
    starts_at: string;
    session_recording: {
        id: number;
        ai_summary: string | null;
        summarized_at: string | null;
        transcription_status: string | null;
    } | null;
} | null;

type LastInvoice = {
    id: number;
    invoice_number: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issued_at: string | null;
    due_at: string | null;
    subtotal: number | string;
    tax_rate: number | string;
    tax_amount: number | string;
    total: number | string;
    payment_method: string | null;
} | null;

interface Props {
    patient: Patient;
    lastAppointment: LastAppointment;
    lastInvoice: LastInvoice;
}

interface NoteForm {
    content: string;
    type: string;
    [key: string]: string;
}

interface AgreementForm {
    content: string;
    [key: string]: string;
}

interface PaymentForm {
    amount: string;
    due_at: string;
    notes: string;
    payment_method: string;
    appointment_id: string;
    [key: string]: string;
}

type StepId = 1 | 2;

const STEPS: Array<{ id: StepId; title: string; description: string }> = [
    { id: 1, title: 'Notas y resumen IA', description: 'Revisa el resumen generado y añade notas o acuerdos.' },
    { id: 2, title: 'Factura', description: 'Revisa la factura y registra el cobro si aplica.' },
];

const INVOICE_PALETTE: Record<string, string> = {
    draft: 'yellow',
    sent: 'blue',
    paid: 'green',
    overdue: 'red',
    cancelled: 'gray',
};

const INVOICE_LABEL: Record<string, string> = {
    draft: 'Borrador',
    sent: 'Enviada',
    paid: 'Pagada',
    overdue: 'Vencida',
    cancelled: 'Cancelada',
};

function Stepper({ current }: { current: StepId }) {
    return (
        <Flex gap="4" align="stretch" wrap="wrap">
            {STEPS.map((step) => {
                const isActive = step.id === current;
                const isDone = step.id < current;
                return (
                    <Flex
                        key={step.id}
                        flex="1"
                        minW="220px"
                        gap="3"
                        align="flex-start"
                        p="3"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={isActive ? 'brand.solid' : 'border'}
                        bg={isActive ? 'brand.muted' : 'bg.surface'}
                    >
                        <Flex
                            w="8"
                            h="8"
                            flexShrink="0"
                            align="center"
                            justify="center"
                            borderRadius="full"
                            bg={isDone || isActive ? 'brand.solid' : 'bg.muted'}
                            color={isDone || isActive ? 'brand.contrast' : 'fg.muted'}
                            fontWeight="semibold"
                            fontSize="sm"
                        >
                            {isDone ? <Check size={16} /> : step.id}
                        </Flex>
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" color="fg">
                                {step.title}
                            </Text>
                            <Text fontSize="xs" color="fg.muted" mt="0.5">
                                {step.description}
                            </Text>
                        </Box>
                    </Flex>
                );
            })}
        </Flex>
    );
}

function formatCurrency(value: number | string | null | undefined): string {
    if (value === null || value === undefined) return '—';
    const n = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (Number.isNaN(n)) return '—';
    return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

export default function PostSession({ patient, lastAppointment, lastInvoice }: Props) {
    const [currentStep, setCurrentStep] = useState<StepId>(1);
    const [noteSaved, setNoteSaved] = useState(false);
    const [agreementSaved, setAgreementSaved] = useState(false);
    const [finishing, setFinishing] = useState(false);

    const patientLabel = patient.name ?? patient.project_name ?? 'Paciente';

    const noteForm = useForm<NoteForm>({ content: '', type: 'session_note' });
    const agreementForm = useForm<AgreementForm>({ content: '' });
    const paymentForm = useForm<PaymentForm>({
        amount: '',
        due_at: new Date().toISOString().split('T')[0],
        notes: 'Sesión de psicología',
        payment_method: '',
        appointment_id: lastAppointment ? String(lastAppointment.id) : '',
    });

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        noteForm.post(NoteStoreAction.url(patient.id), {
            onSuccess: () => { noteForm.reset(); setNoteSaved(true); },
        });
    };

    const submitAgreement = (e: React.FormEvent) => {
        e.preventDefault();
        agreementForm.post(AgreementStoreAction.url(patient.id), {
            onSuccess: () => { agreementForm.reset(); setAgreementSaved(true); },
        });
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(InvoiceStoreAction.url(patient.id));
    };

    const goNext = () => setCurrentStep((s) => (s < 2 ? ((s + 1) as StepId) : s));
    const goBack = () => setCurrentStep((s) => (s > 1 ? ((s - 1) as StepId) : s));

    const finishAndExit = () => {
        if (lastAppointment === null) {
            router.visit(PatientShowAction.url(patient.id));
            return;
        }
        setFinishing(true);
        router.post(
            FinalizeAndNotifyAction.url(lastAppointment.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => router.visit(PatientShowAction.url(patient.id)),
                onFinish: () => setFinishing(false),
            },
        );
    };

    const aiSummary = lastAppointment?.session_recording?.ai_summary ?? null;
    const transcriptionStatus = lastAppointment?.session_recording?.transcription_status ?? null;

    useEcho(
        lastAppointment ? `appointment.${lastAppointment.id}` : 'appointment.none',
        '.session.summarized',
        () => { if (lastAppointment) router.reload({ only: ['lastAppointment'] }); },
    );

    const summaryStatus: 'ready' | 'pending' | 'failed' = aiSummary
        ? 'ready'
        : transcriptionStatus === 'rejected_no_consent'
            ? 'failed'
            : 'pending';

    return (
        <>
            <Head title={`Post-sesión: ${patientLabel} — ClientKosmos`} />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="5xl" mx="auto" w="full">
                {/* Header */}
                <Box>
                    <ChakraLink
                        href={PatientShowAction.url(patient.id)}
                        display="inline-flex"
                        alignItems="center"
                        gap="2"
                        fontSize="sm"
                        color="fg.muted"
                        mb="4"
                        _hover={{ color: 'fg' }}
                    >
                        <ArrowLeft size={16} />
                        Volver a {patientLabel}
                    </ChakraLink>
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Cerrar sesión
                    </Heading>
                    <Text fontSize="md" color="fg.muted" mt="1">
                        {patientLabel}
                    </Text>
                </Box>

                <Stepper current={currentStep} />

                {/* Step 1 — Notas y resumen */}
                {currentStep === 1 && (
                    <Stack gap="6">
                        <Card.Root>
                            <Card.Body p="5">
                                <Flex gap="3" align="center" mb="4">
                                    <Box as={Sparkles} w="5" h="5" color="brand.solid" />
                                    <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
                                        Resumen IA de la sesión
                                    </Heading>
                                    {aiSummary && (
                                        <Badge colorPalette="brand" variant="subtle" ml="auto">
                                            Generado
                                        </Badge>
                                    )}
                                </Flex>

                                {summaryStatus === 'ready' && (
                                    <Text fontSize="sm" color="fg" whiteSpace="pre-wrap" lineHeight="1.7">
                                        {aiSummary}
                                    </Text>
                                )}
                                {summaryStatus === 'pending' && (
                                    <Stack gap="3">
                                        <Text fontSize="sm" color="fg.muted">
                                            {lastAppointment?.session_recording
                                                ? 'Generando resumen automático… Puede tardar hasta 30 segundos.'
                                                : 'No hay transcripción disponible para esta sesión.'}
                                        </Text>
                                        {lastAppointment?.session_recording && (
                                            <Stack gap="2">
                                                <Skeleton height="4" />
                                                <Skeleton height="4" width="85%" />
                                                <Skeleton height="4" />
                                                <Skeleton height="4" width="70%" />
                                            </Stack>
                                        )}
                                    </Stack>
                                )}
                                {summaryStatus === 'failed' && (
                                    <Text fontSize="sm" color="fg.muted">
                                        No se generó resumen: el paciente no otorgó consentimiento de grabación.
                                    </Text>
                                )}
                            </Card.Body>
                        </Card.Root>

                        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap="6">
                            <Card.Root>
                                <Card.Body p="5">
                                    <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="4">
                                        Nota de sesión
                                    </Heading>
                                    <Box as="form" onSubmit={submitNote}>
                                        <Stack gap="3">
                                            <Textarea
                                                value={noteForm.data.content}
                                                onChange={(e) => noteForm.setData('content', e.target.value)}
                                                placeholder="¿Qué has trabajado en esta sesión? Observaciones clave, avances, puntos a seguir…"
                                                minH="120px"
                                                resize="vertical"
                                            />
                                            <Flex justify="space-between" align="center">
                                                {noteSaved && (
                                                    <Text fontSize="xs" color="success.fg">
                                                        Nota guardada.
                                                    </Text>
                                                )}
                                                <Button
                                                    type="submit"
                                                    colorPalette="brand"
                                                    variant="solid"
                                                    size="sm"
                                                    ml="auto"
                                                    loading={noteForm.processing}
                                                    disabled={!noteForm.data.content}
                                                >
                                                    Guardar nota
                                                </Button>
                                            </Flex>
                                        </Stack>
                                    </Box>
                                </Card.Body>
                            </Card.Root>

                            <Card.Root>
                                <Card.Body p="5">
                                    <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="4">
                                        Acuerdo de la sesión
                                    </Heading>
                                    <Box as="form" onSubmit={submitAgreement}>
                                        <Stack gap="3">
                                            <Textarea
                                                value={agreementForm.data.content}
                                                onChange={(e) => agreementForm.setData('content', e.target.value)}
                                                placeholder="¿Qué se acordó hacer antes de la próxima sesión? Tarea, compromiso, reflexión…"
                                                minH="120px"
                                                resize="vertical"
                                            />
                                            <Flex justify="space-between" align="center">
                                                {agreementSaved && (
                                                    <Text fontSize="xs" color="success.fg">
                                                        Acuerdo guardado.
                                                    </Text>
                                                )}
                                                <Button
                                                    type="submit"
                                                    variant="outline"
                                                    size="sm"
                                                    ml="auto"
                                                    loading={agreementForm.processing}
                                                    disabled={!agreementForm.data.content}
                                                >
                                                    Registrar acuerdo
                                                </Button>
                                            </Flex>
                                        </Stack>
                                    </Box>
                                </Card.Body>
                            </Card.Root>
                        </Grid>
                    </Stack>
                )}

                {/* Step 2 — Factura */}
                {currentStep === 2 && (
                    <Stack gap="6">
                        {/* Invoice display */}
                        <Card.Root>
                            <Card.Body p="5">
                                <Flex gap="3" align="center" mb="4">
                                    <Box as={FileText} w="5" h="5" color="brand.solid" />
                                    <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
                                        Factura de la sesión
                                    </Heading>
                                    {lastInvoice && (
                                        <Badge
                                            ml="auto"
                                            colorPalette={INVOICE_PALETTE[lastInvoice.status] ?? 'gray'}
                                            variant="subtle"
                                        >
                                            {INVOICE_LABEL[lastInvoice.status] ?? lastInvoice.status}
                                        </Badge>
                                    )}
                                </Flex>

                                {lastInvoice ? (
                                    <Stack gap="4">
                                        <Grid
                                            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
                                            gap="4"
                                        >
                                            <Box>
                                                <Text fontSize="xs" color="fg.muted">Número</Text>
                                                <Text fontSize="sm" fontWeight="semibold" color="fg">
                                                    {lastInvoice.invoice_number}
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="xs" color="fg.muted">Subtotal</Text>
                                                <Text fontSize="sm" fontWeight="semibold" color="fg">
                                                    {formatCurrency(lastInvoice.subtotal)}
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="xs" color="fg.muted">
                                                    IVA ({lastInvoice.tax_rate}%)
                                                </Text>
                                                <Text fontSize="sm" fontWeight="semibold" color="fg">
                                                    {formatCurrency(lastInvoice.tax_amount)}
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="xs" color="fg.muted">Total</Text>
                                                <Text fontSize="sm" fontWeight="semibold" color="fg">
                                                    {formatCurrency(lastInvoice.total)}
                                                </Text>
                                            </Box>
                                        </Grid>

                                        <Box
                                            p="3"
                                            borderRadius="md"
                                            bg="bg.muted"
                                            borderLeftWidth="3px"
                                            borderLeftColor="brand.solid"
                                        >
                                            <Text fontSize="xs" color="fg.muted">
                                                Operación exenta de IVA conforme al art. 20.1.3º de la Ley 37/1992 del IVA
                                                (servicios de asistencia sanitaria prestados por profesionales psicólogos).
                                            </Text>
                                        </Box>

                                        <Flex gap="3" flexWrap="wrap">
                                            {lastInvoice.status === 'draft' && (
                                                <ChakraLink href={InvoiceEditAction.url(lastInvoice.id)}>
                                                    <Button colorPalette="brand" variant="solid" size="sm">
                                                        <PencilLine />
                                                        Editar factura
                                                    </Button>
                                                </ChakraLink>
                                            )}
                                            <ChakraLink href={InvoiceReviewAction.url(lastInvoice.id)}>
                                                <Button variant="outline" size="sm">
                                                    <ExternalLink />
                                                    Ver factura completa
                                                </Button>
                                            </ChakraLink>
                                        </Flex>
                                    </Stack>
                                ) : (
                                    <Text fontSize="sm" color="fg.muted">
                                        Aún no hay factura para esta sesión. Usa el formulario de abajo para registrar el cobro y generarla.
                                    </Text>
                                )}
                            </Card.Body>
                        </Card.Root>

                        {/* Payment form — only shown when no invoice exists */}
                        {!lastInvoice && (
                            <Card.Root>
                                <Card.Body p="5">
                                    <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="4">
                                        Registrar cobro
                                    </Heading>
                                    <Box as="form" onSubmit={submitPayment}>
                                        <Grid
                                            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                                            gap="4"
                                        >
                                            <Field.Root invalid={!!paymentForm.errors.amount}>
                                                <Field.Label fontSize="sm">Importe (€)</Field.Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={paymentForm.data.amount}
                                                    onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                                    placeholder="60.00"
                                                />
                                                {paymentForm.errors.amount && (
                                                    <Field.ErrorText>{paymentForm.errors.amount}</Field.ErrorText>
                                                )}
                                            </Field.Root>

                                            <Field.Root invalid={!!paymentForm.errors.due_at}>
                                                <Field.Label fontSize="sm">Fecha vencimiento</Field.Label>
                                                <Input
                                                    type="date"
                                                    value={paymentForm.data.due_at}
                                                    onChange={(e) => paymentForm.setData('due_at', e.target.value)}
                                                />
                                                {paymentForm.errors.due_at && (
                                                    <Field.ErrorText>{paymentForm.errors.due_at}</Field.ErrorText>
                                                )}
                                            </Field.Root>

                                            <Field.Root invalid={!!paymentForm.errors.payment_method}>
                                                <Field.Label fontSize="sm">Método de pago</Field.Label>
                                                <NativeSelect.Root>
                                                    <NativeSelect.Field
                                                        value={paymentForm.data.payment_method}
                                                        onChange={(e) =>
                                                            paymentForm.setData('payment_method', e.target.value)
                                                        }
                                                    >
                                                        <option value="">Sin especificar</option>
                                                        <option value="cash">Efectivo</option>
                                                        <option value="bizum">Bizum</option>
                                                        <option value="transfer">Transferencia</option>
                                                        <option value="card">Tarjeta</option>
                                                    </NativeSelect.Field>
                                                    <NativeSelect.Indicator />
                                                </NativeSelect.Root>
                                                {paymentForm.errors.payment_method && (
                                                    <Field.ErrorText>{paymentForm.errors.payment_method}</Field.ErrorText>
                                                )}
                                            </Field.Root>

                                            <Flex alignItems="flex-end">
                                                <Button
                                                    type="submit"
                                                    colorPalette="brand"
                                                    variant="solid"
                                                    w="full"
                                                    loading={paymentForm.processing}
                                                    disabled={!paymentForm.data.amount || !paymentForm.data.due_at}
                                                >
                                                    Registrar cobro
                                                </Button>
                                            </Flex>
                                        </Grid>
                                    </Box>
                                </Card.Body>
                            </Card.Root>
                        )}
                    </Stack>
                )}

                {/* Navigation */}
                <Flex
                    justify="space-between"
                    align="center"
                    pt="4"
                    borderTopWidth="1px"
                    borderColor="border.subtle"
                    gap="3"
                    flexWrap="wrap"
                >
                    <Button variant="outline" onClick={goBack} disabled={currentStep === 1}>
                        Atrás
                    </Button>
                    <Flex gap="3" ml="auto">
                        {currentStep < 2 ? (
                            <Button colorPalette="brand" variant="solid" onClick={goNext}>
                                Siguiente
                            </Button>
                        ) : (
                            <Button colorPalette="brand" variant="solid" onClick={finishAndExit} loading={finishing}>
                                Finalizar
                            </Button>
                        )}
                    </Flex>
                </Flex>
            </Stack>
        </>
    );
}

PostSession.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
