import { Badge, Box, Card, Flex, Heading, HStack, Separator, Stack, Table, Text } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';
import type { ReactNode } from 'react';
import PortalInvoiceDownloadAction from '@/actions/App/Http/Controllers/Portal/Invoice/DownloadPdfAction';
import PortalInvoiceIndexAction from '@/actions/App/Http/Controllers/Portal/Invoice/IndexAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraLink = chakra(Link);

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unit_price: string;
    total: string;
}

interface Workspace {
    id: number;
    name: string;
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
    items: InvoiceItem[];
    workspace: Workspace | null;
}

interface Props {
    invoice: Invoice;
}

const fmt = (v: string | number) =>
    new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v)) + ' €';

const fmtDate = (d: string | null | undefined) =>
    d ? new Intl.DateTimeFormat('es-ES').format(new Date(d)) : '—';

const STATUS_PALETTE: Record<string, string> = {
    paid: 'green',
    sent: 'blue',
    draft: 'gray',
    overdue: 'red',
    cancelled: 'red',
};

export default function PatientInvoiceShow({ invoice }: Props) {
    return (
        <>
            <Head title={`Factura ${invoice.invoice_number}`} />

            <Stack gap="8" p={{ base: '6', lg: '8' }} maxW="3xl" mx="auto">
                <Box>
                    <ChakraLink
                        href={PortalInvoiceIndexAction.url()}
                        display="inline-flex"
                        alignItems="center"
                        gap="2"
                        fontSize="sm"
                        color="fg.muted"
                        mb="4"
                        _hover={{ color: 'fg' }}
                    >
                        <Box as={ArrowLeft} w="4" h="4" />
                        Volver a facturas
                    </ChakraLink>
                    <Heading as="h1" fontSize="2xl" color="fg">
                        Factura {invoice.invoice_number}
                    </Heading>
                </Box>

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
                                    colorPalette={STATUS_PALETTE[invoice.status] ?? 'gray'}
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
                                <Text fontWeight="medium">{invoice.workspace?.name ?? '—'}</Text>
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

                        {invoice.notes && (
                            <Box p="3" borderRadius="md" bg="bg.muted" borderLeftWidth="3px" borderLeftColor="brand.solid">
                                <Text fontSize="sm" color="fg.muted">{invoice.notes}</Text>
                            </Box>
                        )}
                    </Card.Body>
                </Card.Root>

                <Flex justifyContent="flex-end">
                    <Button asChild variant="secondary">
                        <ChakraLink href={PortalInvoiceDownloadAction.url(invoice.id)}>
                            <Box as={Download} w="4" h="4" />
                            Descargar PDF
                        </ChakraLink>
                    </Button>
                </Flex>
            </Stack>
        </>
    );
}

PatientInvoiceShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
