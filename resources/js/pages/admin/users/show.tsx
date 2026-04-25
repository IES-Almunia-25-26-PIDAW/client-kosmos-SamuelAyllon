import { Badge, Box, Button as ChakraButton, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Admin/DashboardIndexAction';
import { KPICard } from '@/components/patient/kpi-card';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { Auth } from '@/types';

const ChakraLink = chakra(Link);

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

interface ProfessionalProfile {
    license_number: string | null;
    collegiate_number: string | null;
    specialties: string[];
    bio: string | null;
    verification_status: VerificationStatus;
    verified_at: string | null;
}

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
    professional_profile: ProfessionalProfile | null;
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

    const handleVerify = (status: 'verified' | 'rejected') => {
        router.patch(`/admin/users/${user.id}/verify`, { status });
    };

    const formatDate = (d: string) =>
        new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));

    const statusBadge: Record<VerificationStatus, { label: string; colorPalette: string }> = {
        verified: { label: 'Verificado', colorPalette: 'green' },
        pending: { label: 'Pendiente', colorPalette: 'yellow' },
        rejected: { label: 'Rechazado', colorPalette: 'red' },
        unverified: { label: 'Sin verificar', colorPalette: 'gray' },
    };

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

                {user.professional_profile && (
                    <Stack
                        gap="4"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="6"
                        boxShadow="sm"
                    >
                        <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="3">
                            <Heading as="h2" fontSize="xl" color="fg">
                                Verificación profesional
                            </Heading>
                            <Badge
                                variant="subtle"
                                colorPalette={statusBadge[user.professional_profile.verification_status].colorPalette}
                                px="3"
                                py="1"
                                fontSize="sm"
                                fontWeight="medium"
                                borderRadius="md"
                            >
                                {statusBadge[user.professional_profile.verification_status].label}
                            </Badge>
                        </Flex>

                        <Grid gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="3">
                            {user.professional_profile.collegiate_number && (
                                <Box>
                                    <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                        Nº Colegiado
                                    </Text>
                                    <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                        {user.professional_profile.collegiate_number}
                                    </Text>
                                </Box>
                            )}
                            {user.professional_profile.license_number && (
                                <Box>
                                    <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                        Nº Licencia
                                    </Text>
                                    <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                        {user.professional_profile.license_number}
                                    </Text>
                                </Box>
                            )}
                            {user.professional_profile.specialties.length > 0 && (
                                <Box>
                                    <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                        Especialidades
                                    </Text>
                                    <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                        {user.professional_profile.specialties.join(', ')}
                                    </Text>
                                </Box>
                            )}
                            {user.professional_profile.bio && (
                                <Box gridColumn={{ sm: '1 / -1' }}>
                                    <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                        Bio
                                    </Text>
                                    <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                        {user.professional_profile.bio}
                                    </Text>
                                </Box>
                            )}
                            {user.professional_profile.verified_at && (
                                <Box>
                                    <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                        Verificado el
                                    </Text>
                                    <Text as="dd" fontSize="sm" color="fg" mt="0.5">
                                        {formatDate(user.professional_profile.verified_at)}
                                    </Text>
                                </Box>
                            )}
                        </Grid>

                        <Flex gap="3">
                            <ChakraButton
                                variant="outline"
                                size="sm"
                                colorPalette="green"
                                onClick={() => handleVerify('verified')}
                                disabled={user.professional_profile.verification_status === 'verified'}
                            >
                                Verificar
                            </ChakraButton>
                            <ChakraButton
                                variant="outline"
                                size="sm"
                                colorPalette="red"
                                onClick={() => handleVerify('rejected')}
                                disabled={user.professional_profile.verification_status === 'rejected'}
                            >
                                Rechazar
                            </ChakraButton>
                        </Flex>
                    </Stack>
                )}

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
