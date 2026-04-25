import { Badge, Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, FileText, Mail, Sparkles } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    due_date: string;
    concept: string;
    payment_method: string;
    [key: string]: string;
}

type StepId = 1 | 2 | 3;

const STEPS: Array<{ id: StepId; title: string; description: string }> = [
    { id: 1, title: 'Notas y resumen IA', description: 'Revisa el resumen generado y añade notas o acuerdos.' },
    { id: 2, title: 'Factura', description: 'Revisa la factura y registra el cobro si aplica.' },
    { id: 3, title: 'Confirmar envío', description: 'Envía factura y acuerdos al paciente por email.' },
];

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
                            {isDone ? <Box as={Check} w="4" h="4" /> : step.id}
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

function Card({ children, ...rest }: { children: ReactNode; [key: string]: unknown }) {
    return (
        <Box
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border"
            bg="bg.surface"
            p="5"
            boxShadow="sm"
            {...rest}
        >
            {children}
        </Box>
    );
}

function formatCurrency(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
        return '—';
    }
    const n = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (Number.isNaN(n)) {
        return '—';
    }
    return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

export default function PostSession({ patient, lastAppointment, lastInvoice }: Props) {
    const [currentStep, setCurrentStep] = useState<StepId>(1);
    const [noteSaved, setNoteSaved] = useState(false);
    const [agreementSaved, setAgreementSaved] = useState(false);
    const [paymentSaved, setPaymentSaved] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const noteForm = useForm<NoteForm>({ content: '', type: 'session_note' });
    const agreementForm = useForm<AgreementForm>({ content: '' });
    const paymentForm = useForm<PaymentForm>({
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        concept: 'Sesión de psicología',
        payment_method: '',
    });

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        noteForm.post(`/patients/${patient.id}/notes`, {
            onSuccess: () => {
                noteForm.reset();
                setNoteSaved(true);
            },
        });
    };

    const submitAgreement = (e: React.FormEvent) => {
        e.preventDefault();
        agreementForm.post(`/patients/${patient.id}/agreements`, {
            onSuccess: () => {
                agreementForm.reset();
                setAgreementSaved(true);
            },
        });
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(`/patients/${patient.id}/payments`, {
            onSuccess: () => {
                paymentForm.reset();
                setPaymentSaved(true);
            },
        });
    };

    const goNext = () => setCurrentStep((s) => (s < 3 ? ((s + 1) as StepId) : s));
    const goBack = () => setCurrentStep((s) => (s > 1 ? ((s - 1) as StepId) : s));

    const confirmAndSend = () => {
        if (lastAppointment === null) {
            setConfirmed(true);
            return;
        }
        setConfirming(true);
        router.post(
            `/professional/appointments/${lastAppointment.id}/finalize-and-notify`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => setConfirmed(true),
                onFinish: () => setConfirming(false),
            },
        );
    };

    const aiSummary = lastAppointment?.session_recording?.ai_summary ?? null;
    const transcriptionStatus = lastAppointment?.session_recording?.transcription_status ?? null;

    return (
        <>
            <Head title={`Post-sesión: ${patient.project_name} — ClientKosmos`} />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="5xl">
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
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Cerrar sesión
                    </Heading>
                    <Text fontSize="md" color="fg.muted" mt="1">
                        {patient.project_name}
                    </Text>
                </Box>

                <Stepper current={currentStep} />

                {currentStep === 1 && (
                    <Stack gap="6">
                        <Card>
                            <Flex gap="3" align="center" mb="3">
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
                            {aiSummary ? (
                                <Text fontSize="sm" color="fg" whiteSpace="pre-wrap" lineHeight="1.7">
                                    {aiSummary}
                                </Text>
                            ) : (
                                <Text fontSize="sm" color="fg.muted">
                                    {transcriptionStatus === 'rejected_no_consent'
                                        ? 'No se generó resumen: el paciente no otorgó consentimiento de grabación.'
                                        : lastAppointment?.session_recording
                                            ? 'Generando resumen automático… Esta operación puede tardar hasta 30 segundos. Refresca la página si no aparece.'
                                            : 'No hay transcripción disponible para esta sesión.'}
                                </Text>
                            )}
                        </Card>

                        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap="6">
                            <Card>
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
                                                variant="primary"
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
                            </Card>

                            <Card>
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
                                                variant="secondary"
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
                            </Card>
                        </Grid>
                    </Stack>
                )}

                {currentStep === 2 && (
                    <Stack gap="6">
                        <Card>
                            <Flex gap="3" align="center" mb="4">
                                <Box as={FileText} w="5" h="5" color="brand.solid" />
                                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
                                    Factura de la sesión
                                </Heading>
                                {lastInvoice && (
                                    <Badge
                                        ml="auto"
                                        colorPalette={lastInvoice.status === 'draft' ? 'yellow' : 'green'}
                                        variant="subtle"
                                    >
                                        {lastInvoice.status}
                                    </Badge>
                                )}
                            </Flex>
                            {lastInvoice ? (
                                <Stack gap="3">
                                    <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap="4">
                                        <Box>
                                            <Text fontSize="xs" color="fg.muted">Número</Text>
                                            <Text fontSize="sm" fontWeight="semibold" color="fg">{lastInvoice.invoice_number}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="fg.muted">Subtotal</Text>
                                            <Text fontSize="sm" fontWeight="semibold" color="fg">{formatCurrency(lastInvoice.subtotal)}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="fg.muted">IVA ({lastInvoice.tax_rate}%)</Text>
                                            <Text fontSize="sm" fontWeight="semibold" color="fg">{formatCurrency(lastInvoice.tax_amount)}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="xs" color="fg.muted">Total</Text>
                                            <Text fontSize="sm" fontWeight="semibold" color="fg">{formatCurrency(lastInvoice.total)}</Text>
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
                                    <ChakraLink href={`/invoices/${lastInvoice.id}`} alignSelf="flex-start">
                                        <Button variant="secondary" size="sm">Revisar factura completa</Button>
                                    </ChakraLink>
                                </Stack>
                            ) : (
                                <Text fontSize="sm" color="fg.muted">
                                    Aún no se ha generado factura para esta sesión. Puedes registrar el cobro abajo
                                    y generar la factura desde la ficha del paciente.
                                </Text>
                            )}
                        </Card>

                        <Card>
                            <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg" mb="4">
                                Registrar cobro
                            </Heading>
                            <Box as="form" onSubmit={submitPayment}>
                                <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="4">
                                    <Stack gap="1.5">
                                        <Label>Importe (€)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={paymentForm.data.amount}
                                            onChange={(e) => paymentForm.setData('amount', e.target.value)}
                                            placeholder="60.00"
                                            h="10"
                                        />
                                    </Stack>
                                    <Stack gap="1.5">
                                        <Label>Fecha vencimiento</Label>
                                        <Input
                                            type="date"
                                            value={paymentForm.data.due_date}
                                            onChange={(e) => paymentForm.setData('due_date', e.target.value)}
                                            h="10"
                                        />
                                    </Stack>
                                    <Stack gap="1.5">
                                        <Label>Método de pago</Label>
                                        <chakra.select
                                            value={paymentForm.data.payment_method}
                                            onChange={(e) => paymentForm.setData('payment_method', e.target.value)}
                                            w="full"
                                            h="10"
                                            px="3"
                                            bg="bg.surface"
                                            borderWidth="1px"
                                            borderColor="border"
                                            borderRadius="md"
                                            color="fg"
                                            fontSize="md"
                                            _focusVisible={{
                                                outline: 'none',
                                                borderColor: 'brand.solid',
                                                boxShadow: '0 0 0 3px var(--ck-colors-brand-muted)',
                                            }}
                                        >
                                            <option value="">Sin especificar</option>
                                            <option value="cash">Efectivo</option>
                                            <option value="bizum">Bizum</option>
                                            <option value="transfer">Transferencia</option>
                                            <option value="card">Tarjeta</option>
                                        </chakra.select>
                                    </Stack>
                                    <Flex alignItems="flex-end">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            w="full"
                                            h="10"
                                            loading={paymentForm.processing}
                                            disabled={!paymentForm.data.amount || !paymentForm.data.due_date}
                                        >
                                            Registrar cobro
                                        </Button>
                                    </Flex>
                                </Grid>
                                {paymentSaved && (
                                    <Text fontSize="xs" color="success.fg" mt="3">
                                        Cobro registrado.
                                    </Text>
                                )}
                            </Box>
                        </Card>
                    </Stack>
                )}

                {currentStep === 3 && (
                    <Card>
                        <Flex gap="3" align="center" mb="4">
                            <Box as={Mail} w="5" h="5" color="brand.solid" />
                            <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
                                Confirmar envío al paciente
                            </Heading>
                        </Flex>
                        <Stack gap="4">
                            <Text fontSize="sm" color="fg.muted">
                                Al confirmar se enviará al paciente un correo con:
                            </Text>
                            <Stack gap="2" pl="4">
                                <Flex gap="2" align="center">
                                    <Box as={Check} w="4" h="4" color="success.fg" />
                                    <Text fontSize="sm" color="fg">
                                        {lastInvoice
                                            ? `Factura ${lastInvoice.invoice_number} (${formatCurrency(lastInvoice.total)})`
                                            : 'Sin factura asociada a esta sesión'}
                                    </Text>
                                </Flex>
                                <Flex gap="2" align="center">
                                    <Box as={Check} w="4" h="4" color="success.fg" />
                                    <Text fontSize="sm" color="fg">
                                        Acuerdos registrados en esta sesión (si los hay)
                                    </Text>
                                </Flex>
                                <Flex gap="2" align="center">
                                    <Box as={Check} w="4" h="4" color="success.fg" />
                                    <Text fontSize="sm" color="fg">
                                        Enlace al portal del paciente con el resumen de la sesión
                                    </Text>
                                </Flex>
                            </Stack>
                            {confirmed ? (
                                <Box
                                    p="3"
                                    borderRadius="md"
                                    bg="success.subtle"
                                    borderLeftWidth="3px"
                                    borderLeftColor="success.solid"
                                >
                                    <Text fontSize="sm" color="success.fg" fontWeight="semibold">
                                        Envío confirmado. El paciente recibirá los correos en breve.
                                    </Text>
                                </Box>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={confirmAndSend}
                                    alignSelf="flex-start"
                                    loading={confirming}
                                    disabled={lastAppointment === null}
                                >
                                    Confirmar y enviar
                                </Button>
                            )}
                        </Stack>
                    </Card>
                )}

                <Flex
                    justify="space-between"
                    align="center"
                    pt="4"
                    borderTopWidth="1px"
                    borderColor="border.subtle"
                    gap="3"
                    flexWrap="wrap"
                >
                    <Button variant="secondary" onClick={goBack} disabled={currentStep === 1}>
                        Atrás
                    </Button>
                    <Flex gap="3" ml="auto">
                        <ChakraLink href={`/patients/${patient.id}`}>
                            <Button variant="secondary">Guardar y salir</Button>
                        </ChakraLink>
                        {currentStep < 3 ? (
                            <Button variant="primary" onClick={goNext}>
                                Siguiente
                            </Button>
                        ) : (
                            <ChakraLink href={`/patients/${patient.id}`}>
                                <Button variant="primary" disabled={!confirmed}>
                                    Finalizar
                                </Button>
                            </ChakraLink>
                        )}
                    </Flex>
                </Flex>
            </Stack>
        </>
    );
}

PostSession.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
