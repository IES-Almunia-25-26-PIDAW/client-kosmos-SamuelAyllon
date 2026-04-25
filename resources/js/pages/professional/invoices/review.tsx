import { Alert, Badge, Box, Card, Flex, Heading, HStack, Separator, Stack, Table, Text } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import type { ReactNode } from 'react';
import SendAction from '@/actions/App/Http/Controllers/Invoice/SendAction';
import { Button } from '@/components/ui/button';
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
    tax_rate: string;
    tax_amount: string;
    total: string;
    notes: string | null;
    pdf_path: string | null;
    patient: User | null;
    professional: User | null;
    items: InvoiceItem[];
}

interface Props {
    invoice: Invoice;
}

const fmt = (v: string | number) =>
    new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v)) + ' €';

const fmtDate = (d: string | null | undefined) =>
    d ? new Intl.DateTimeFormat('es-ES').format(new Date(d)) : '—';

export default function InvoiceReview({ invoice }: Props) {
    const isSent = invoice.status === 'sent' || invoice.status === 'paid';

    const handleSend = () => {
        router.post(SendAction.url(invoice.id), {}, {
            onSuccess: () => {},
        });
    };

    return (
        <>
            <Head title={`Revisar factura ${invoice.invoice_number}`} />

            <Stack gap="8" p={{ base: '6', lg: '8' }} maxW="3xl" mx="auto">
                <Box>
                    <Heading as="h1" fontSize="2xl" color="fg">
                        Revisar factura
                    </Heading>
                    <Text mt="1" fontSize="sm" color="fg.muted">
                        Revisa los datos antes de enviar al paciente.
                    </Text>
                </Box>

                <Alert.Root status="warning" variant="subtle" borderRadius="md">
                    <Alert.Indicator />
                    <Alert.Description fontSize="sm">
                        <Text fontWeight="semibold">Operación exenta de IVA — art. 20.Uno.3º LIVA</Text>
                        <Text color="fg.muted" fontSize="xs" mt="0.5">
                            Los servicios de asistencia psicológica prestados por profesional colegiado están exentos de IVA.
                            La factura no incluirá IVA y debe indicar expresamente la base legal de la exención.
                        </Text>
                    </Alert.Description>
                </Alert.Root>

                <Card.Root>
                    <Card.Body gap="6">
                        <HStack justifyContent="space-between" flexWrap="wrap" gap="4">
                            <Stack gap="0.5">
                                <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="semibold">
                                    Nº Factura
                                </Text>
                                <Text fontSize="lg" fontWeight="bold" fontFamily="mono">
                                    {invoice.invoice_number}
                                </Text>
                            </Stack>
                            <Stack gap="0.5" textAlign="right">
                                <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="semibold">
                                    Estado
                                </Text>
                                <Badge
                                    colorPalette={
                                        invoice.status === 'paid' ? 'green' :
                                        invoice.status === 'sent' ? 'blue' :
                                        invoice.status === 'draft' ? 'gray' : 'red'
                                    }
                                    variant="subtle"
                                >
                                    {invoice.status}
                                </Badge>
                            </Stack>
                        </HStack>

                        <Separator />

                        <HStack gap="8" flexWrap="wrap">
                            <Stack gap="0.5" flex="1">
                                <Text fontSize="xs" color="fg.muted" fontWeight="semibold" textTransform="uppercase">
                                    Emisor
                                </Text>
                                <Text fontWeight="medium">{invoice.professional?.name}</Text>
                                <Text fontSize="sm" color="fg.muted">{invoice.professional?.email}</Text>
                            </Stack>
                            <Stack gap="0.5" flex="1">
                                <Text fontSize="xs" color="fg.muted" fontWeight="semibold" textTransform="uppercase">
                                    Receptor
                                </Text>
                                <Text fontWeight="medium">{invoice.patient?.name}</Text>
                                <Text fontSize="sm" color="fg.muted">{invoice.patient?.email}</Text>
                            </Stack>
                            <Stack gap="0.5" flex="1">
                                <Text fontSize="xs" color="fg.muted" fontWeight="semibold" textTransform="uppercase">
                                    Fechas
                                </Text>
                                <Text fontSize="sm">Emisión: {fmtDate(invoice.issued_at)}</Text>
                                <Text fontSize="sm">Vencimiento: {fmtDate(invoice.due_at)}</Text>
                            </Stack>
                        </HStack>

                        <Separator />

                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Descripción</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="right">Uds.</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="right">Precio ud.</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="right">Total</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {invoice.items.map((item) => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.description}</Table.Cell>
                                        <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
                                        <Table.Cell textAlign="right">{fmt(item.unit_price)}</Table.Cell>
                                        <Table.Cell textAlign="right">{fmt(item.total)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>

                        <Flex justifyContent="flex-end">
                            <Stack gap="1.5" minW="40" textAlign="right">
                                <HStack justifyContent="space-between">
                                    <Text fontSize="sm" color="fg.muted">Base imponible</Text>
                                    <Text fontSize="sm">{fmt(invoice.subtotal)}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text fontSize="sm" color="fg.muted">IVA ({invoice.tax_rate}%)</Text>
                                    <Text fontSize="sm">{fmt(invoice.tax_amount)}</Text>
                                </HStack>
                                <Separator />
                                <HStack justifyContent="space-between">
                                    <Text fontWeight="bold">Total</Text>
                                    <Text fontWeight="bold" fontSize="lg">{fmt(invoice.total)}</Text>
                                </HStack>
                            </Stack>
                        </Flex>
                    </Card.Body>
                </Card.Root>

                <HStack justifyContent="flex-end" gap="3">
                    <Button variant="outline" onClick={() => router.visit(`/invoices/${invoice.id}`)}>
                        Volver
                    </Button>
                    <Button
                        variant="primary"
                        disabled={isSent}
                        onClick={handleSend}
                    >
                        {isSent ? 'Factura ya enviada' : 'Generar PDF y enviar al paciente'}
                    </Button>
                </HStack>
            </Stack>
        </>
    );
}

InvoiceReview.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
