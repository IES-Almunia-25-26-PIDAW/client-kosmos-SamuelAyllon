import { Badge, Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { Download, Receipt } from 'lucide-react';
import type { ReactNode } from 'react';
import DownloadPdfAction from '@/actions/App/Http/Controllers/Portal/Invoice/DownloadPdfAction';
import ShowAction from '@/actions/App/Http/Controllers/Portal/Invoice/ShowAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

const ChakraLink = chakra(Link);

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unit_price: string;
}

interface InvoiceRow {
    id: number;
    invoice_number: string;
    status: string;
    issued_at: string;
    due_at: string | null;
    paid_at: string | null;
    total: string;
    pdf_path: string | null;
    items: InvoiceItem[];
}

interface Paginated<T> {
    data: T[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    invoices: Paginated<InvoiceRow>;
}

const STATUS_CONFIG: Record<string, { label: string; palette: string }> = {
    draft: { label: 'Borrador', palette: 'gray' },
    sent: { label: 'Enviada', palette: 'blue' },
    paid: { label: 'Pagada', palette: 'green' },
    overdue: { label: 'Vencida', palette: 'red' },
    cancelled: { label: 'Cancelada', palette: 'gray' },
};

const formatDate = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso));

const formatAmount = (amount: string): string =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(parseFloat(amount));

export default function PatientInvoicesIndex({ invoices }: Props) {
    const rows = invoices.data;

    return (
        <>
            <Head title="Mis facturas — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="8"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="5xl"
                mx="auto"
                w="full"
            >
                <Stack gap="1">
                    <Heading as="h1" fontSize="4xl" fontWeight="bold" color="fg" letterSpacing="-0.48px">
                        Mis facturas
                    </Heading>
                    <Text fontSize="md" color="fg.muted">
                        {rows.length === 0
                            ? 'Aún no tienes facturas.'
                            : `${rows.length} factura${rows.length === 1 ? '' : 's'} en esta página`}
                    </Text>
                </Stack>

                {rows.length === 0 ? (
                    <Box
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="12"
                        textAlign="center"
                    >
                        <Box as={Receipt} w="10" h="10" mx="auto" mb="3" color="fg.subtle" aria-hidden />
                        <Text fontSize="sm" color="fg.muted">
                            Cuando tu profesional emita una factura aparecerá aquí.
                        </Text>
                    </Box>
                ) : (
                    <Stack gap="4" role="list">
                        {rows.map((invoice) => {
                            const cfg = STATUS_CONFIG[invoice.status] ?? { label: invoice.status, palette: 'gray' };

                            return (
                                <Flex
                                    key={invoice.id}
                                    role="listitem"
                                    bg="bg.surface"
                                    borderRadius="2xl"
                                    borderWidth="1px"
                                    borderColor="border"
                                    boxShadow="sm"
                                    p="6"
                                    gap="5"
                                    alignItems={{ base: 'stretch', md: 'center' }}
                                    flexDirection={{ base: 'column', md: 'row' }}
                                    justifyContent="space-between"
                                >
                                    <Stack gap="2" flex="1" minW={0}>
                                        <Flex alignItems="center" gap="2" flexWrap="wrap">
                                            <Heading as="h2" fontSize="md" fontWeight="semibold" color="fg">
                                                {invoice.invoice_number}
                                            </Heading>
                                            <Badge
                                                variant="subtle"
                                                colorPalette={cfg.palette}
                                                borderRadius="full"
                                                px="2.5"
                                                py="0.5"
                                                fontSize="2xs"
                                                fontWeight="semibold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                            >
                                                {cfg.label}
                                            </Badge>
                                        </Flex>

                                        <Flex gap="4" flexWrap="wrap" color="fg.muted" fontSize="sm">
                                            <Text>Emitida el {formatDate(invoice.issued_at)}</Text>
                                            {invoice.due_at && (
                                                <Text>Vence el {formatDate(invoice.due_at)}</Text>
                                            )}
                                            {invoice.paid_at && (
                                                <Text>Pagada el {formatDate(invoice.paid_at)}</Text>
                                            )}
                                        </Flex>

                                        <Text fontSize="lg" fontWeight="bold" color="fg">
                                            {formatAmount(invoice.total)}
                                        </Text>
                                    </Stack>

                                    <Flex gap="2" flexShrink={0} flexWrap="wrap">
                                        <Button asChild variant="secondary" size="sm">
                                            <ChakraLink href={ShowAction.url(invoice.id)}>Ver detalle</ChakraLink>
                                        </Button>
                                        {invoice.pdf_path && (
                                            <Button asChild variant="ghost" size="sm" aria-label="Descargar PDF">
                                                <ChakraLink href={DownloadPdfAction.url(invoice.id)}>
                                                    <Box as={Download} w="4" h="4" aria-hidden />
                                                    PDF
                                                </ChakraLink>
                                            </Button>
                                        )}
                                    </Flex>
                                </Flex>
                            );
                        })}
                    </Stack>
                )}

                {(invoices.prev_page_url || invoices.next_page_url) && (
                    <Flex justifyContent="center" gap="3">
                        {invoices.prev_page_url && (
                            <Button asChild variant="secondary" size="sm">
                                <Link href={invoices.prev_page_url}>Anterior</Link>
                            </Button>
                        )}
                        {invoices.next_page_url && (
                            <Button asChild variant="secondary" size="sm">
                                <Link href={invoices.next_page_url}>Siguiente</Link>
                            </Button>
                        )}
                    </Flex>
                )}
            </Stack>
        </>
    );
}

PatientInvoicesIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
