import { Box, Flex, Grid, Heading, Stack } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import { UserPlus, Search } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import CreateAction from '@/actions/App/Http/Controllers/Patient/CreateAction';
import { EmptyState } from '@/components/empty-state';
import { PatientCard } from '@/components/patient/patient-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Patient } from '@/types';

interface Props {
    patients: Patient[];
}

type ClinicalFilter = 'all' | 'active' | 'inactive' | 'discharged';

const filterLabels: { key: ClinicalFilter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'active', label: 'Activos' },
    { key: 'inactive', label: 'Inactivos' },
    { key: 'discharged', label: 'Alta' },
];

export default function PatientsIndex({ patients }: Props) {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<ClinicalFilter>('all');

    const filtered = patients.filter((p) => {
        const term = search.toLowerCase();
        const name = (p.name ?? p.project_name ?? '').toLowerCase();
        const email = (p.email ?? '').toLowerCase();
        const matchesSearch = term === '' || name.includes(term) || email.includes(term);

        const matchesFilter = activeFilter === 'all' || p.status === activeFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <Head title="Pacientes — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }}>

                <Flex alignItems="center" justifyContent="space-between">
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Pacientes
                    </Heading>
                    <Button variant="primary" onClick={() => router.visit(CreateAction.url())}>
                        <Box as={UserPlus} w="4" h="4" mr="2" />
                        Añadir paciente
                    </Button>
                </Flex>

                <Flex direction={{ base: 'column', sm: 'row' }} gap="3" alignItems={{ sm: 'center' }}>
                    <Box position="relative" flex="1">
                        <Box
                            as={Search}
                            w="4"
                            h="4"
                            position="absolute"
                            left="3"
                            top="50%"
                            transform="translateY(-50%)"
                            color="fg.muted"
                            pointerEvents="none"
                        />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar paciente…"
                            pl="9"
                            h="10"
                        />
                    </Box>
                    <Flex flexWrap="wrap" gap="2">
                        {filterLabels.map((f) => {
                            const isActive = activeFilter === f.key;
                            return (
                                <Box
                                    as="button"
                                    key={f.key}
                                    onClick={() => setActiveFilter(f.key)}
                                    px="3"
                                    py="1.5"
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="medium"
                                    transition="colors 0.2s"
                                    bg={isActive ? 'brand.solid' : 'bg.subtle'}
                                    color={isActive ? 'brand.contrast' : 'fg.muted'}
                                    _hover={isActive ? undefined : { bg: 'border' }}
                                >
                                    {f.label}
                                </Box>
                            );
                        })}
                    </Flex>
                </Flex>

                {filtered.length === 0 ? (
                    <EmptyState
                        icon={UserPlus}
                        title={patients.length === 0 ? 'Tu consulta empieza aquí' : 'Sin resultados'}
                        description={
                            patients.length === 0
                                ? 'Añade tu primer paciente para comenzar a gestionar tus sesiones.'
                                : 'Prueba con otro término de búsqueda o cambia el filtro activo.'
                        }
                        action={patients.length === 0 ? {
                            label: 'Añadir paciente',
                            onClick: () => router.visit(CreateAction.url()),
                        } : undefined}
                    />
                ) : (
                    <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="4">
                        {filtered.map((patient) => (
                            <PatientCard key={patient.id} patient={patient} />
                        ))}
                    </Grid>
                )}
            </Stack>
        </>
    );
}

PatientsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
