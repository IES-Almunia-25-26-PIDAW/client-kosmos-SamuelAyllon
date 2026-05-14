import { Badge, Box, Button as ChakraButton, chakra, Flex, Grid, Heading, Icon, Stack, Text } from '@chakra-ui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Building2,
    CalendarCheck,
    CalendarDays,
    Check,
    CheckCircle2,
    Clock,
    Euro,
    FileText,
    MapPin,
    ShieldCheck,
    Sparkles,
    Trash2,
    UserCircle,
    Users,
    X,
} from 'lucide-react';
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

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('');

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

    const statusBadge: Record<VerificationStatus, { label: string; colorPalette: string; icon: typeof CheckCircle2 }> = {
        verified: { label: 'Verificado', colorPalette: 'green', icon: CheckCircle2 },
        pending: { label: 'Pendiente', colorPalette: 'yellow', icon: Clock },
        rejected: { label: 'Rechazado', colorPalette: 'red', icon: X },
        unverified: { label: 'Sin verificar', colorPalette: 'gray', icon: ShieldCheck },
    };

    const formattedPaid = `€${Number(user.paid_amount ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;

    const profile = user.professional_profile;
    const status = profile?.verification_status;
    const statusInfo = status ? statusBadge[status] : null;

    return (
        <>
            <Head title={`${user.name} — Admin — ClientKosmos`} />

            <Stack gap="6" p={{ base: '6', lg: '8' }} maxW="4xl">
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
                        transition="colors"
                    >
                        <ArrowLeft size={16} />
                        Volver a usuarios
                    </ChakraLink>

                    <Flex alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap="4">
                        <Flex alignItems="center" gap="4" minW="0">
                            <Flex
                                alignItems="center"
                                justifyContent="center"
                                w="14"
                                h="14"
                                borderRadius="full"
                                bg="brand.subtle"
                                color="brand.solid"
                                borderWidth="1px"
                                borderColor="brand.emphasized"
                                fontSize="md"
                                fontWeight="semibold"
                                flexShrink={0}
                            >
                                {getInitials(user.name) || <Icon as={UserCircle} boxSize="6" />}
                            </Flex>
                            <Box minW="0">
                                <Flex alignItems="center" gap="2" flexWrap="wrap">
                                    <Heading as="h1" fontSize="2xl" color="fg" lineHeight="1.2">
                                        {user.name}
                                    </Heading>
                                    {statusInfo && (
                                        <Badge
                                            variant="subtle"
                                            colorPalette={statusInfo.colorPalette}
                                            px="2.5"
                                            py="0.5"
                                            fontSize="xs"
                                            fontWeight="medium"
                                            borderRadius="full"
                                            display="inline-flex"
                                            alignItems="center"
                                            gap="1"
                                        >
                                            <Icon as={statusInfo.icon} boxSize="3" />
                                            {statusInfo.label}
                                        </Badge>
                                    )}
                                </Flex>
                                <Text mt="1" fontSize="sm" color="fg.muted">
                                    {user.email}
                                </Text>
                            </Box>
                        </Flex>

                        {!isSelf && (
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                                <Trash2 size={14} />
                                Eliminar usuario
                            </Button>
                        )}
                    </Flex>
                </Box>

                <Grid gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="4">
                    <KPICard label="Pacientes" value={user.patients_count} icon={Users} />
                    <KPICard label="Sesiones" value={user.sessions_count} icon={CalendarCheck} />
                    <KPICard label="Facturado" value={formattedPaid} icon={Euro} />
                    <KPICard label="Alta" value={formatDate(user.created_at)} icon={CalendarDays} />
                </Grid>

                {profile && statusInfo && (
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
                            <Flex alignItems="center" gap="2">
                                <Icon as={ShieldCheck} boxSize="5" color="brand.solid" />
                                <Heading as="h2" fontSize="lg" color="fg">
                                    Verificación profesional
                                </Heading>
                            </Flex>
                            <Badge
                                variant="subtle"
                                colorPalette={statusInfo.colorPalette}
                                px="3"
                                py="1"
                                fontSize="sm"
                                fontWeight="medium"
                                borderRadius="md"
                                display="inline-flex"
                                alignItems="center"
                                gap="1.5"
                            >
                                <Icon as={statusInfo.icon} boxSize="3.5" />
                                {statusInfo.label}
                            </Badge>
                        </Flex>

                        <Grid gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                            {profile.collegiate_number && (
                                <DataField icon={Award} label="Nº Colegiado" value={profile.collegiate_number} />
                            )}
                            {profile.license_number && (
                                <DataField icon={FileText} label="Nº Licencia" value={profile.license_number} />
                            )}
                            {profile.specialties.length > 0 && (
                                <DataField
                                    icon={Sparkles}
                                    label="Especialidades"
                                    value={profile.specialties.join(', ')}
                                />
                            )}
                            {profile.verified_at && (
                                <DataField
                                    icon={CheckCircle2}
                                    label="Verificado el"
                                    value={formatDate(profile.verified_at)}
                                />
                            )}
                            {profile.bio && (
                                <Box gridColumn={{ sm: '1 / -1' }}>
                                    <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" mb="1">
                                        Bio
                                    </Text>
                                    <Text as="dd" fontSize="sm" color="fg" lineHeight="1.6">
                                        {profile.bio}
                                    </Text>
                                </Box>
                            )}
                        </Grid>

                        <Flex
                            gap="2"
                            pt="3"
                            borderTopWidth="1px"
                            borderColor="border.subtle"
                            flexWrap="wrap"
                        >
                            <ChakraButton
                                variant="outline"
                                size="sm"
                                colorPalette="green"
                                onClick={() => handleVerify('verified')}
                                disabled={status === 'verified'}
                            >
                                <Icon as={Check} boxSize="3.5" />
                                Verificar
                            </ChakraButton>
                            <ChakraButton
                                variant="outline"
                                size="sm"
                                colorPalette="red"
                                onClick={() => handleVerify('rejected')}
                                disabled={status === 'rejected'}
                            >
                                <Icon as={X} boxSize="3.5" />
                                Rechazar
                            </ChakraButton>
                        </Flex>
                    </Stack>
                )}

                {(user.practice_name || user.specialty || user.city) && (
                    <Stack
                        gap="4"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="6"
                        boxShadow="sm"
                    >
                        <Flex alignItems="center" gap="2">
                            <Icon as={Building2} boxSize="5" color="brand.solid" />
                            <Heading as="h2" fontSize="lg" color="fg">
                                Información
                            </Heading>
                        </Flex>
                        <Grid gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                            {user.practice_name && (
                                <DataField icon={Building2} label="Consulta" value={user.practice_name} />
                            )}
                            {user.specialty && (
                                <DataField icon={Sparkles} label="Especialidad" value={user.specialty} />
                            )}
                            {user.city && (
                                <DataField icon={MapPin} label="Ciudad" value={user.city} />
                            )}
                        </Grid>
                    </Stack>
                )}
            </Stack>
        </>
    );
}

interface DataFieldProps {
    icon: typeof CheckCircle2;
    label: string;
    value: string;
}

function DataField({ icon, label, value }: DataFieldProps) {
    return (
        <Flex gap="3" alignItems="flex-start">
            <Flex
                alignItems="center"
                justifyContent="center"
                w="8"
                h="8"
                borderRadius="md"
                bg="bg.muted"
                color="fg.muted"
                flexShrink={0}
            >
                <Icon as={icon} boxSize="4" />
            </Flex>
            <Box minW="0">
                <Text as="dt" fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                    {label}
                </Text>
                <Text as="dd" fontSize="sm" color="fg" mt="0.5" fontWeight="medium">
                    {value}
                </Text>
            </Box>
        </Flex>
    );
}

AdminUserShow.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
