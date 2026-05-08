import {
    Badge,
    Box,
    Flex,
    Grid,
    Heading,
    HStack,
    Stack,
    Table,
    Text,
} from '@chakra-ui/react';
import { Head, Link, router } from '@inertiajs/react';
import { LayoutGrid, Plus, Table as TableIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import OfferedConsultationsCreateAction from '@/actions/App/Http/Controllers/OfferedConsultations/CreateAction';
import OfferedConsultationsDestroyAction from '@/actions/App/Http/Controllers/OfferedConsultations/DestroyAction';
import OfferedConsultationsEditAction from '@/actions/App/Http/Controllers/OfferedConsultations/EditAction';
import OfferedConsultationsShowAction from '@/actions/App/Http/Controllers/OfferedConsultations/ShowAction';
import { Button } from '@/components/ui/button';
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

    return (
        <>
            <Head title="Servicios — ClientKosmos" />

            <Stack id="main-content" tabIndex={-1} gap="6" px={{ base: '6', lg: '8' }} pt={{ base: '8', lg: '10' }} pb="10" maxW="6xl" mx="auto" w="full">
                <Flex justify="space-between" align="center" gap="4" flexWrap="wrap">
                    <Stack gap="1">
                        <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg" letterSpacing="-0.5px">
                            Servicios
                        </Heading>
                        <Text fontSize="sm" color="fg.muted">
                            Define los servicios que ofreces para que tus pacientes puedan reservar.
                        </Text>
                    </Stack>

                    <HStack gap="2">
                        <ViewToggle view={view} onChange={setView} />
                        <Button asChild variant="primary" size="md">
                            <Link href={OfferedConsultationsCreateAction.url()}>
                                <Box as={Plus} w="4" h="4" aria-hidden />
                                Nuevo servicio
                            </Link>
                        </Button>
                    </HStack>
                </Flex>

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

function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
    return (
        <HStack gap="0" borderWidth="1px" borderColor="border" borderRadius="lg" overflow="hidden">
            <Button
                variant={view === 'table' ? 'primary' : 'ghost'}
                size="sm"
                borderRadius="0"
                onClick={() => onChange('table')}
                aria-label="Vista tabla"
            >
                <Box as={TableIcon} w="4" h="4" aria-hidden />
            </Button>
            <Button
                variant={view === 'gallery' ? 'primary' : 'ghost'}
                size="sm"
                borderRadius="0"
                onClick={() => onChange('gallery')}
                aria-label="Vista galería"
            >
                <Box as={LayoutGrid} w="4" h="4" aria-hidden />
            </Button>
        </HStack>
    );
}

function Empty() {
    return (
        <Box bg="bg.surface" borderRadius="2xl" borderWidth="1px" borderColor="border" p="12" textAlign="center">
            <Heading as="h2" fontSize="lg" color="fg" mb="2">
                Aún no tienes servicios
            </Heading>
            <Text fontSize="sm" color="fg.muted" mb="5">
                Crea tu primer servicio para que los pacientes puedan reservar contigo.
            </Text>
            <Button asChild variant="primary">
                <Link href={OfferedConsultationsCreateAction.url()}>Crear servicio</Link>
            </Button>
        </Box>
    );
}

interface ListProps {
    consultations: OfferedConsultation[];
    onDelete: (c: OfferedConsultation) => void;
}

function ConsultationsTable({ consultations, onDelete }: ListProps) {
    return (
        <Box bg="bg.surface" borderRadius="2xl" borderWidth="1px" borderColor="border" overflow="hidden">
            <Table.Root variant="line">
                <Table.Header bg="bg.subtle">
                    <Table.Row>
                        <Table.ColumnHeader>Servicio</Table.ColumnHeader>
                        <Table.ColumnHeader>Modalidad</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Duración</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Precio</Table.ColumnHeader>
                        <Table.ColumnHeader>Estado</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Acciones</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {consultations.map((c) => (
                        <Table.Row key={c.id}>
                            <Table.Cell>
                                <HStack gap="3">
                                    <Box w="3" h="3" borderRadius="full" bg={c.color ?? 'gray.400'} />
                                    <Stack gap="0">
                                        <Link href={OfferedConsultationsShowAction.url({ offered_consultation: c.id })}>
                                            <Text fontWeight="semibold" color="fg">{c.name}</Text>
                                        </Link>
                                        {c.description && (
                                            <Text fontSize="xs" color="fg.muted" lineClamp={1}>{c.description}</Text>
                                        )}
                                    </Stack>
                                </HStack>
                            </Table.Cell>
                            <Table.Cell>
                                <Badge variant="subtle" colorPalette="gray">{MODALITY_LABELS[c.modality]}</Badge>
                            </Table.Cell>
                            <Table.Cell textAlign="end">{c.duration_minutes} min</Table.Cell>
                            <Table.Cell textAlign="end">{c.price ? `${Number(c.price).toFixed(2)} €` : '—'}</Table.Cell>
                            <Table.Cell>
                                <Badge variant="subtle" colorPalette={c.is_active ? 'green' : 'gray'}>
                                    {c.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                                <HStack gap="1" justify="end">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={OfferedConsultationsEditAction.url({ offered_consultation: c.id })}>Editar</Link>
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(c)}>
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
                <Stack
                    key={c.id}
                    gap="3"
                    bg="bg.surface"
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor="border"
                    p="6"
                    boxShadow="xs"
                    transition="all 0.15s"
                    _hover={{ boxShadow: 'md', borderColor: 'brand.solid' }}
                >
                    <Flex align="center" gap="3">
                        <Box w="4" h="4" borderRadius="full" bg={c.color ?? 'gray.400'} flexShrink={0} />
                        <Heading as="h3" fontSize="lg" color="fg" lineClamp={1} flex="1">
                            {c.name}
                        </Heading>
                        <Badge variant="subtle" colorPalette={c.is_active ? 'green' : 'gray'}>
                            {c.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                    </Flex>
                    {c.description && (
                        <Text fontSize="sm" color="fg.muted" lineClamp={3}>
                            {c.description}
                        </Text>
                    )}
                    <HStack gap="3" fontSize="xs" color="fg.subtle">
                        <Text>{MODALITY_LABELS[c.modality]}</Text>
                        <Text>·</Text>
                        <Text>{c.duration_minutes} min</Text>
                        {c.price && <><Text>·</Text><Text>{Number(c.price).toFixed(2)} €</Text></>}
                    </HStack>
                    <HStack gap="2" pt="2">
                        <Button asChild variant="secondary" size="sm" flex="1">
                            <Link href={OfferedConsultationsEditAction.url({ offered_consultation: c.id })}>Editar</Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(c)}>
                            Borrar
                        </Button>
                    </HStack>
                </Stack>
            ))}
        </Grid>
    );
}

OfferedConsultationsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
