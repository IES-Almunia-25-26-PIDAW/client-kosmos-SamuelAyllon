import { Alert, Box, Card, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import UpdateAction from '@/actions/App/Http/Controllers/Invoice/UpdateAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unit_price: string;
    total: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    status: string;
    issued_at: string | null;
    due_at: string | null;
    subtotal: string;
    total: string;
    notes: string | null;
    payment_method: string | null;
    patient: User | null;
    professional: User | null;
    items: InvoiceItem[];
}

interface Props {
    invoice: Invoice;
}

const toDateInputValue = (d: string | null): string => {
    if (!d) return '';
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toISOString().slice(0, 10);
};

export default function InvoiceEdit({ invoice }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        amount: invoice.subtotal,
        due_at: toDateInputValue(invoice.due_at),
        payment_method: invoice.payment_method ?? '',
        notes: invoice.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(UpdateAction.url(invoice.id));
    };

    return (
        <>
            <Head title={`Editar factura ${invoice.invoice_number}`} />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="3xl" mx="auto">
                <Box>
                    <Heading as="h1" fontSize="2xl" color="fg">
                        Editar factura
                    </Heading>
                    <Text mt="1" fontSize="sm" color="fg.muted">
                        {invoice.invoice_number} — {invoice.patient?.name ?? 'Paciente'}
                    </Text>
                </Box>

                <Alert.Root status="info" variant="subtle" borderRadius="md">
                    <Alert.Indicator />
                    <Alert.Description fontSize="sm">
                        Solo se pueden editar facturas en borrador. Una vez enviada, los datos quedan fijados.
                    </Alert.Description>
                </Alert.Root>

                <Card.Root>
                    <Card.Body>
                        <Box as="form" onSubmit={submit}>
                            <Stack gap="5">
                                <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                                    <Stack gap="1.5">
                                        <Label htmlFor="amount">
                                            Importe (€) <Box as="span" color="danger.solid">*</Box>
                                        </Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            h="10"
                                            required
                                        />
                                        {errors.amount && (
                                            <Text fontSize="xs" color="danger.solid">{errors.amount}</Text>
                                        )}
                                    </Stack>

                                    <Stack gap="1.5">
                                        <Label htmlFor="due_at">
                                            Vencimiento <Box as="span" color="danger.solid">*</Box>
                                        </Label>
                                        <Input
                                            id="due_at"
                                            type="date"
                                            value={data.due_at}
                                            onChange={(e) => setData('due_at', e.target.value)}
                                            h="10"
                                            required
                                        />
                                        {errors.due_at && (
                                            <Text fontSize="xs" color="danger.solid">{errors.due_at}</Text>
                                        )}
                                    </Stack>
                                </Grid>

                                <Stack gap="1.5">
                                    <Label htmlFor="payment_method">Método de pago</Label>
                                    <select
                                        id="payment_method"
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        style={{
                                            height: '2.5rem',
                                            paddingInline: '0.75rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid var(--chakra-colors-border)',
                                            background: 'var(--chakra-colors-bg-surface)',
                                            color: 'var(--chakra-colors-fg)',
                                        }}
                                    >
                                        <option value="">— Sin especificar —</option>
                                        <option value="cash">Efectivo</option>
                                        <option value="bizum">Bizum</option>
                                        <option value="transfer">Transferencia</option>
                                        <option value="card">Tarjeta</option>
                                        <option value="stripe">Stripe</option>
                                        <option value="other">Otro</option>
                                    </select>
                                    {errors.payment_method && (
                                        <Text fontSize="xs" color="danger.solid">{errors.payment_method}</Text>
                                    )}
                                </Stack>

                                <Stack gap="1.5">
                                    <Label htmlFor="notes">Notas</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        minH="100px"
                                        resize="vertical"
                                    />
                                    {errors.notes && (
                                        <Text fontSize="xs" color="danger.solid">{errors.notes}</Text>
                                    )}
                                </Stack>

                                <Flex gap="3" justifyContent="flex-end">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => window.history.back()}
                                        disabled={processing}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="primary" loading={processing}>
                                        Guardar cambios
                                    </Button>
                                </Flex>
                            </Stack>
                        </Box>
                    </Card.Body>
                </Card.Root>
            </Stack>
        </>
    );
}

InvoiceEdit.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
