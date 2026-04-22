import { Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { ConsultingSessionType, Patient, Payment } from '@/types';

const ChakraLink = chakra(Link);

interface Props {
    patient: Patient;
    lastSession: ConsultingSessionType | null;
    lastPayment: Payment | null;
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

export default function PostSession({ patient }: Props) {
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
        noteForm.post(`/patients/${patient.id}/notes`, { onSuccess: () => noteForm.reset() });
    };

    const submitAgreement = (e: React.FormEvent) => {
        e.preventDefault();
        agreementForm.post(`/patients/${patient.id}/agreements`, { onSuccess: () => agreementForm.reset() });
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        paymentForm.post(`/patients/${patient.id}/payments`, { onSuccess: () => paymentForm.reset() });
    };

    return (
        <>
            <Head title={`Post-sesión: ${patient.project_name} — ClientKosmos`} />

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
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Cerrar sesión
                    </Heading>
                    <Text fontSize="md" color="fg.muted" mt="1">
                        {patient.project_name}
                    </Text>
                </Box>

                <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap="6">

                    <Box
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="5"
                        boxShadow="sm"
                    >
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
                                <Button type="submit" variant="primary" size="sm" loading={noteForm.processing} disabled={!noteForm.data.content}>
                                    Guardar nota
                                </Button>
                            </Stack>
                        </Box>
                    </Box>

                    <Box
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="5"
                        boxShadow="sm"
                    >
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
                                <Button type="submit" variant="secondary" size="sm" loading={agreementForm.processing} disabled={!agreementForm.data.content}>
                                    Registrar acuerdo
                                </Button>
                            </Stack>
                        </Box>
                    </Box>

                    <Box
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="5"
                        boxShadow="sm"
                        gridColumn={{ lg: 'span 2' }}
                    >
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
                        </Box>
                    </Box>
                </Grid>

                <Flex justifyContent="flex-end" pt="4" borderTopWidth="1px" borderColor="border.subtle">
                    <ChakraLink href={`/patients/${patient.id}`}>
                        <Button variant="secondary">Terminar y volver al paciente</Button>
                    </ChakraLink>
                </Flex>
            </Stack>
        </>
    );
}

PostSession.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
