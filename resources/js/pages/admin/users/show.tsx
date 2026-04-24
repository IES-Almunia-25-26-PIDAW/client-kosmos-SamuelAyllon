import { Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { KPICard } from '@/components/patient/kpi-card';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { Auth } from '@/types';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Admin/DashboardIndexAction';

const ChakraLink = chakra(Link);

interface UserDetail {
    id: number;
    name: string;
    email: string;
    practice_name: string | null;
    specialty: string | null;
    city: string | null;
    patients_count: number;
    sessions_count: number;
    paid_amount: number;
    created_at: string;
}

interface Props {
    user: UserDetail;
}

export default function AdminUserShow({ user }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const isSelf = user.id === auth.user.id;

    const handleDelete = () => {
        if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
        router.delete(`/admin/users/${user.id}`);
    };

    const formatDate = (d: string) =>
        new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));

    return (
        <>
            <Head title={`${user.name} — Admin — ClientKosmos`} />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="4xl">
                <Flex alignItems="flex-start" justifyContent="space-between">
                    <Box>
                        <ChakraLink
                            href={DashboardIndexAction.url()}
                            display="inline-flex"
                            alignItems="center"
                            gap="2"
                            fontSize="sm"
                            color="fg.muted"
                            _hover={{ color: 'fg' }}
                            mb="4"
                        >
                            <ArrowLeft size={16} />
                            Volver a usuarios
                        </ChakraLink>
                        <Heading as="h1" fontSize="3xl" color="fg">
                            {user.name}
                        </Heading>
                        <Text mt="1" fontSize="md" color="fg.muted">
                            {user.email}
                        </Text>
                    </Box>

                    {!isSelf && (
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 size={14} />
                            Eliminar usuario
                        </Button>
                    )}
                </Flex>

                <Grid gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="4">
                    <KPICard label="Pacientes" value={user.patients_count} />
                    <KPICard label="Sesiones" value={user.sessions_count} />
                    <KPICard label="Facturado" value={`€${Number(user.paid_amount ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} />
                    <KPICard label="Alta" value={formatDate(user.created_at)} />
                </Grid>

                <Stack
                    gap="4"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="border"
                    bg="bg.surface"
                    p="6"
                    boxShadow="sm"
                >
                    <Heading as="h2" fontSize="xl" color="fg">
                        Información
                    </Heading>
                    <Grid gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="3">
                        {user.practice_name && (
                            <Box>
                                <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                    Consulta
                                </Text>
                                <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                    {user.practice_name}
                                </Text>
                            </Box>
                        )}
                        {user.specialty && (
                            <Box>
                                <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                    Especialidad
                                </Text>
                                <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                    {user.specialty}
                                </Text>
                            </Box>
                        )}
                        {user.city && (
                            <Box>
                                <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                    Ciudad
                                </Text>
                                <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                    {user.city}
                                </Text>
                            </Box>
                        )}
                    </Grid>
                </Stack>
            </Stack>
        </>
    );
}

AdminUserShow.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
