import {
    Badge,
    Box,
    Card,
    EmptyState,
    Flex,
    Grid,
    Heading,
    HStack,
    Icon,
    SegmentGroup,
    Separator,
    Stack,
    Stat,
    Table,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Head, Link, router } from '@inertiajs/react';
import { Briefcase, LayoutGrid, Pencil, Plus, Table as TableIcon, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import OfferedConsultationsCreateAction from '@/actions/App/Http/Controllers/OfferedConsultations/CreateAction';
import OfferedConsultationsDestroyAction from '@/actions/App/Http/Controllers/OfferedConsultations/DestroyAction';
import OfferedConsultationsEditAction from '@/actions/App/Http/Controllers/OfferedConsultations/EditAction';
import OfferedConsultationsShowAction from '@/actions/App/Http/Controllers/OfferedConsultations/ShowAction';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { MODALITY_LABELS, type OfferedConsultation } from '@/types/offered-consultation';

interface Props {
    consultations: OfferedConsultation[];
}

type View = 'table' | 'gallery';

export default function OfferedConsultationsIndex({ consultations }: Props) {
    const [view, setView] = useState<View>('table');

    const onDelete = (consultation: OfferedConsultation) => {
        if (!confirm(`¿Eliminar "${consultation.name}"?`)) {
            return;
        }
        router.delete(OfferedConsultationsDestroyAction.url({ offered_consultation: consultation.id }));
    };

    const activeCount = consultations.filter((c) => c.is_active).length;

    return (
        <>
            <Head title="Servicios — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="6"
                px={{ base: '6', lg: '8' }}
                pt={{ base: '8', lg: '10' }}
                pb="10"
                maxW="6xl"
                mx="auto"
                w="full"
            >
                {/* Header */}
                <Flex
                    justify="space-between"
                    align="center"
                    gap="4"
                    flexWrap="wrap"
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="2xl"
                    borderLeftWidth="4px"
                    borderLeftColor="brand.solid"
                    px="6"
                    py="5"
                >
                    <Stack gap="1">
                        <Heading as="h1" fontSize="3xl" fontWeight="bold"  letterSpacing="-0.5px">
                            Servicios
                        </Heading>
                        <Text fontSize="sm" color="fg.muted">
                            Define los servicios que ofreces para que tus pacientes puedan reservar.
                        </Text>
                    </Stack>

                    <HStack gap="2">
                        {consultations.length > 0 && (
                            <ViewToggle view={view} onChange={setView} />
                        )}
                        <Button asChild variant="primary" size="md">
                            <Link href={OfferedConsultationsCreateAction.url()}>
                                <Plus />
                                Nuevo servicio
                            </Link>
                        </Button>
                    </HStack>
                </Flex>

                {/* Summary strip */}
                {consultations.length > 0 && (
                    <HStack
                        gap="0"
                        bg="bg.surface"
                        borderWidth="1px"
                        borderColor="border"
                        borderRadius="xl"
                        overflow="hidden"
                        flexWrap="wrap"
                    >
                        <StatCell label="Total" value={consultations.length} />
                        <Separator orientation="vertical" h="full" />
                        <StatCell label="Activos" value={activeCount} palette="green" />
                        <Separator orientation="vertical" h="full" />
                        <StatCell label="Inactivos" value={consultations.length - activeCount} palette="gray" />
                    </HStack>
                )}

                {/* Content */}
                {consultations.length === 0 ? (
                    <Empty />
                ) : view === 'table' ? (
                    <ConsultationsTable consultations={consultations} onDelete={onDelete} />
                ) : (
                    <ConsultationsGallery consultations={consultations} onDelete={onDelete} />
                )}
            </Stack>
        </>
    );
}

function StatCell({ label, value, palette }: { label: string; value: number; palette?: string }) {
    return (
        <Stat.Root
            px="5"
            py="3"
            flex="1"
            colorPalette={palette}
        >
            <Stat.Label
                fontSize="xs"
                fontWeight="medium"
                textTransform="uppercase"
                letterSpacing="wide"
                color="fg.muted"
            >
                {label}
            </Stat.Label>
            <Stat.ValueText fontSize="2xl" fontWeight="bold" color={palette ? 'colorPalette.fg' : 'fg'}>
                {value}
            </Stat.ValueText>
        </Stat.Root>
    );
}

function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
    return (
        <SegmentGroup.Root
            size="sm"
            value={view}
            onValueChange={({ value }) => { if (value) { onChange(value as View); } }}
        >
            <SegmentGroup.Indicator />
            <Tooltip>
                <TooltipTrigger asChild>
                    <SegmentGroup.Item value="table">
                        <SegmentGroup.ItemHiddenInput />
                        <SegmentGroup.ItemText>
                            <Icon as={TableIcon} boxSize="4" />
                        </SegmentGroup.ItemText>
                    </SegmentGroup.Item>
                </TooltipTrigger>
                <TooltipContent>Vista tabla</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SegmentGroup.Item value="gallery">
                        <SegmentGroup.ItemHiddenInput />
                        <SegmentGroup.ItemText>
                            <Icon as={LayoutGrid} boxSize="4" />
                        </SegmentGroup.ItemText>
                    </SegmentGroup.Item>
                </TooltipTrigger>
                <TooltipContent>Vista galería</TooltipContent>
            </Tooltip>
        </SegmentGroup.Root>
    );
}

function Empty() {
    return (
        <Box
            bg="bg.surface"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="border"
            borderStyle="dashed"
            py="16"
        >
            <EmptyState.Root>
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <Icon as={Briefcase} boxSize="8" color="fg.muted" />
                    </EmptyState.Indicator>
                    <VStack textAlign="center" gap="1">
                        <EmptyState.Title fontSize="lg" color="fg">
                            Aún no tienes servicios
                        </EmptyState.Title>
                        <EmptyState.Description fontSize="sm" color="fg.muted">
                            Crea tu primer servicio para que los pacientes puedan reservar contigo.
                        </EmptyState.Description>
                    </VStack>
                    <Button asChild variant="primary" mt="2">
                        <Link href={OfferedConsultationsCreateAction.url()}>
                            <Plus />
                            Crear servicio
                        </Link>
                    </Button>
                </EmptyState.Content>
            </EmptyState.Root>
        </Box>
    );
}

interface ListProps {
    consultations: OfferedConsultation[];
    onDelete: (c: OfferedConsultation) => void;
}

function ConsultationsTable({ consultations, onDelete }: ListProps) {
    return (
        <Box bg="bg.surface" borderRadius="2xl" borderWidth="1px" borderColor="border.strong" overflow="hidden">
            <Table.Root
                variant="line"
                css={{
                    '& th, & td': {
                        borderColor: 'border.strong',
                    },
                    '& th:not(:last-child), & td:not(:last-child)': {
                        borderRightWidth: '1px',
                    },
                }}
            >
                <Table.Header>
                    <Table.Row bg="brand.solid" color="white">
                        <Table.ColumnHeader color="white">Servicio</Table.ColumnHeader>
                        <Table.ColumnHeader color="white">Modalidad</Table.ColumnHeader>
                        <Table.ColumnHeader color="white" textAlign="end">Duración</Table.ColumnHeader>
                        <Table.ColumnHeader color="white" textAlign="end">Precio</Table.ColumnHeader>
                        <Table.ColumnHeader color="white">Estado</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end" w="12" />
                    </Table.Row>
                </Table.Header>
                <Table.Body borderColor="border.strong">
                    {consultations.map((c) => (
                        <Table.Row key={c.id} _hover={{ bg: 'bg.subtle' }} transition="background 0.12s" >
                            <Table.Cell>
                                <HStack gap="3">
                                    <Box w="3" h="3" borderRadius="full" bg={c.color ?? 'border'} flexShrink={0} />
                                    <Stack gap="0">
                                        <Link href={OfferedConsultationsShowAction.url({ offered_consultation: c.id })}>
                                            <Text
                                                fontWeight="semibold"
                                                color="fg"
                                                _hover={{ color: 'brand.solid' }}
                                                transition="color 0.12s"
                                                m="0"
                                                mt="3"
                                            >
                                                {c.name}
                                            </Text>
                                        </Link>
                                        {c.description && (
                                            <Text fontSize="xs" color="fg.muted" lineClamp={1} mt="1">
                                                {c.description}
                                            </Text>
                                        )}
                                    </Stack>
                                </HStack>
                            </Table.Cell>
                            <Table.Cell>
                                <Badge variant="subtle" colorPalette="gray">
                                    {MODALITY_LABELS[c.modality]}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                                <Text fontSize="sm" color="fg.muted">{c.duration_minutes} min</Text>
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                                <Text fontSize="sm" fontWeight="medium" color="fg">
                                    {c.price ? `${Number(c.price).toFixed(2)} €` : '—'}
                                </Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Badge variant="subtle" colorPalette={c.is_active ? 'green' : 'gray'}>
                                    {c.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                                <HStack gap="1" justify="end">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={OfferedConsultationsEditAction.url({ offered_consultation: c.id })}>
                                            <Pencil />
                                            Editar
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(c)}>
                                        <Trash2 />
                                        Borrar
                                    </Button>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
}


function ConsultationsGallery({ consultations, onDelete }: ListProps) {
    return (
        <Grid gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="4">
            {consultations.map((c) => (
                <Card.Root
                    key={c.id}
                    variant="outline"
                    transition="all 0.15s"
                    _hover={{ boxShadow: 'md', borderColor: 'brand.solid' }}
                >
                    <Card.Body gap="3" pb="3">
                        <Flex align="center" gap="3">
                            <Box w="3.5" h="3.5" borderRadius="full" bg={c.color ?? 'border'} flexShrink={0} />
                            <Link
                                href={OfferedConsultationsShowAction.url({ offered_consultation: c.id })}
                                style={{ flex: 1, minWidth: 0 }}
                            >
                                <Heading
                                    as="h3"
                                    fontSize="md"
                                    fontWeight="semibold"
                                    color="fg"
                                    lineClamp={1}
                                    _hover={{ color: 'brand.solid' }}
                                    transition="color 0.12s"
                                >
                                    {c.name}
                                </Heading>
                            </Link>
                            <Badge
                                variant="subtle"
                                colorPalette={c.is_active ? 'green' : 'gray'}
                                flexShrink={0}
                            >
                                {c.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </Flex>

                        {c.description && (
                            <Text fontSize="sm" color="fg.muted" lineClamp={2}>
                                {c.description}
                            </Text>
                        )}

                        <HStack gap="2" flexWrap="wrap">
                            <Badge variant="subtle" colorPalette="gray" size="sm">
                                {MODALITY_LABELS[c.modality]}
                            </Badge>
                            <Badge variant="subtle" colorPalette="gray" size="sm">
                                {c.duration_minutes} min
                            </Badge>
                            {c.price && (
                                <Badge variant="subtle" colorPalette="brand" size="sm">
                                    {Number(c.price).toFixed(2)} €
                                </Badge>
                            )}
                        </HStack>
                    </Card.Body>

                    <Card.Footer pt="0" gap="2">
                        <Button asChild variant="secondary" size="sm" flex="1">
                            <Link href={OfferedConsultationsEditAction.url({ offered_consultation: c.id })}>
                                <Pencil />
                                Editar
                            </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(c)}>
                            <Trash2 />
                            Borrar
                        </Button>
                    </Card.Footer>
                </Card.Root>
            ))}
        </Grid>
    );
}

OfferedConsultationsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
