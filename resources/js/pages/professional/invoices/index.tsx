import { Box, Flex, Heading, Stack, Table, Text, chakra } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import { Receipt } from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/empty-state';
import { KPICard } from '@/components/patient/kpi-card';
import { StatusBadge } from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import { index as invoicesIndex } from '@/routes/invoices';
import type { Payment } from '@/types';

interface Stats {
    total_paid: number;
    total_pending: number;
    total_overdue: number;
}

interface PaginatedPayments {
    data: Payment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    payments: PaginatedPayments;
    stats: Stats;
    filters: { status?: string; patient_id?: string };
}

const formatDate = (d: string | null | undefined) =>
    d ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d)) : '—';

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Cobrado',
    overdue: 'Vencido',
    claimed: 'Reclamado',
};

const FILTER_OPTIONS = ['', 'paid', 'pending', 'overdue', 'claimed'] as const;

export default function BillingIndex({ payments, stats, filters }: Props) {
    return (
        <>
            <Head title="Cobros — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }}>
                <Box>
                    <Heading as="h1" fontSize="3xl" color="fg">Cobros</Heading>
                    <Text mt="1" fontSize="md" color="fg.muted">
                        Control de pagos y estado de cobros de todos tus pacientes
                    </Text>
                </Box>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap="4">
                    <KPICard
                        label="Cobrado este mes"
                        value={`€${stats.total_paid.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                    />
                    <KPICard
                        label="Pendiente de cobro"
                        value={`€${stats.total_pending.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                    />
                    <KPICard
                        label="Vencido sin cobrar"
                        value={`€${stats.total_overdue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                    />
                </Box>

                <Flex gap="2" flexWrap="wrap">
                    {FILTER_OPTIONS.map((s) => {
                        const isActive = (filters.status ?? '') === s;
                        return (
                            <chakra.button
                                key={s}
                                onClick={() => router.get(invoicesIndex.url(), { status: s || undefined }, { preserveState: true })}
                                px="3"
                                py="1.5"
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="medium"
                                transition="colors"
                                bg={isActive ? 'brand.solid' : 'bg.muted'}
                                color={isActive ? 'brand.contrast' : 'fg.muted'}
                                _hover={!isActive ? { bg: 'border' } : undefined}
                            >
                                {s === '' ? 'Todos' : statusLabels[s]}
                            </chakra.button>
                        );
                    })}
                </Flex>

                {payments.data.length === 0 ? (
                    <EmptyState
                        icon={Receipt}
                        title="Sin cobros"
                        description="Cuando registres cobros desde las sesiones de tus pacientes, aparecerán aquí."
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
                            <Table.Header bg="bg.muted">
                                <Table.Row borderBottomWidth="1px" borderColor="border.subtle">
                                    <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Paciente</Table.ColumnHeader>
                                    <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Concepto</Table.ColumnHeader>
                                    <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Vencimiento</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="right" fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Importe</Table.ColumnHeader>
                                    <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Estado</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {payments.data.map((payment) => (
                                    <Table.Row key={payment.id} _hover={{ bg: 'bg.muted' }} transition="colors">
                                        <Table.Cell color="fg" fontWeight="medium">
                                            {payment.patient?.project_name ?? '—'}
                                        </Table.Cell>
                                        <Table.Cell color="fg.muted">
                                            {payment.concept ?? 'Sesión'}
                                        </Table.Cell>
                                        <Table.Cell color="fg.muted">
                                            {formatDate(payment.due_date)}
                                        </Table.Cell>
                                        <Table.Cell textAlign="right" fontWeight="medium" color="fg" fontVariantNumeric="tabular-nums">
                                            €{Number(payment.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <StatusBadge
                                                status={payment.status as 'paid' | 'pending' | 'overdue'}
                                                variant="subtle"
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>

                        {payments.last_page > 1 && (
                            <Flex
                                alignItems="center"
                                justifyContent="space-between"
                                px="4"
                                py="3"
                                borderTopWidth="1px"
                                borderColor="border.subtle"
                                bg="bg.muted"
                            >
                                <Text fontSize="xs" color="fg.muted">
                                    {payments.total} cobros · Página {payments.current_page} de {payments.last_page}
                                </Text>
                                <Flex gap="1">
                                    {payments.links.map((link, i) => (
                                        <chakra.button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            px="3"
                                            py="1"
                                            fontSize="xs"
                                            borderRadius="sm"
                                            transition="colors"
                                            bg={link.active ? 'brand.solid' : 'transparent'}
                                            color={link.active ? 'brand.contrast' : link.url ? 'fg.muted' : 'fg.subtle'}
                                            cursor={link.url ? 'pointer' : 'not-allowed'}
                                            _hover={!link.active && link.url ? { bg: 'border' } : undefined}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </Flex>
                            </Flex>
                        )}
                    </Box>
                )}
            </Stack>
        </>
    );
}

BillingIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
