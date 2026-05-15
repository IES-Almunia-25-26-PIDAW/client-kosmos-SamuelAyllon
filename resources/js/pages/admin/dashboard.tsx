import { Box, chakra, Flex, Heading, HStack, Icon, Stack, Table, Text } from '@chakra-ui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search, Trash2, UserRound, Users, UsersRound } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Admin/DashboardIndexAction';
import CreateAction from '@/actions/App/Http/Controllers/Admin/Users/CreateAction';
import DestroyAction from '@/actions/App/Http/Controllers/Admin/Users/DestroyAction';
import ShowAction from '@/actions/App/Http/Controllers/Admin/Users/ShowAction';
import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/ui/icon-input';
import AdminLayout from '@/layouts/admin-layout';
import type { Auth } from '@/types';

interface UserRow {
    id: number;
    name: string;
    email: string;
    patients_count: number;
    professional_appointments_count: number;
    paid_amount: number;
    created_at: string;
}

interface Props {
    users: {
        data: UserRow[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
        role: string;
    };
}

const ROLE_FILTERS = [
    { value: 'all', label: 'Todos', icon: UsersRound },
    { value: 'professional', label: 'Profesional', icon: UserRound },
    { value: 'patient', label: 'Paciente', icon: UserRound },
] as const;

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('');

export default function AdminDashboard({ users, filters }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const roleRef = useRef(filters.role);
    const isFirstRender = useRef(true);

    useEffect(() => {
        roleRef.current = filters.role;
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            router.get(
                DashboardIndexAction.url(),
                { search: search || undefined, role: roleRef.current !== 'all' ? roleRef.current : undefined },
                { preserveState: true, replace: true },
            );
        }, 350);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [search]);

    const applyRoleFilter = (role: string) => {
        router.get(
            DashboardIndexAction.url(),
            { search: search || undefined, role: role !== 'all' ? role : undefined },
            { preserveState: true, replace: true },
        );
    };

    const deleteUser = (e: React.MouseEvent, user: UserRow) => {
        e.stopPropagation();
        if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
        router.delete(DestroyAction.url({ user: user.id }));
    };

    const activeRole = filters.role ?? 'all';

    return (
        <>
            <Head title="Usuarios — Admin — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }}>
                <Flex alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap="4">
                    <Flex alignItems="center" gap="3">
                        <Flex
                            alignItems="center"
                            justifyContent="center"
                            w="11"
                            h="11"
                            borderRadius="lg"
                            bg="brand.subtle"
                            color="brand.solid"
                            borderWidth="1px"
                            borderColor="brand.emphasized"
                        >
                            <Icon as={Users} boxSize="5" />
                        </Flex>
                        <Box>
                            <Heading as="h1" fontSize="2xl" color="fg" lineHeight="1.2">
                                Usuarios
                            </Heading>
                            <Text mt="1" fontSize="sm" color="fg.muted">
                                {users.total} {users.total === 1 ? 'usuario registrado' : 'usuarios registrados'}
                            </Text>
                        </Box>
                    </Flex>
                    <Button variant="primary" onClick={() => router.visit(CreateAction.url())}>
                        <Plus size={16} />
                        Nuevo usuario
                    </Button>
                </Flex>

                <Stack
                    gap="3"
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="md"
                    p="3.5"
                >
                    <HStack gap="2" flexWrap="wrap" justifyContent="center">
                        {ROLE_FILTERS.map((f) => {
                            const isActive = activeRole === f.value;
                            return (
                                <chakra.button
                                    key={f.value}
                                    type="button"
                                    onClick={() => applyRoleFilter(f.value)}
                                    display="inline-flex"
                                    alignItems="center"
                                    gap="1.5"
                                    px="3.5"
                                    py="1.5"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    borderRadius="full"
                                    borderWidth="1px"
                                    transition="all 0.15s"
                                    bg={isActive ? 'brand.solid' : 'bg.surface'}
                                    color={isActive ? 'brand.contrast' : 'fg.muted'}
                                    borderColor={isActive ? 'brand.solid' : 'border'}
                                    _hover={!isActive ? { bg: 'bg.muted', color: 'fg' } : undefined}
                                >
                                    <Icon as={f.icon} boxSize="3.5" />
                                    {f.label}
                                </chakra.button>
                            );
                        })}
                    </HStack>

                    <IconInput
                        icon={Search}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre o correo…"
                        h="10"
                        w="full"
                    />
                </Stack>

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
                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Usuario</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center" fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Pacientes</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center" fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Sesiones</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="right" fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Facturado</Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Alta</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="right" fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Acciones</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {users.data.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="12">
                                        <Stack alignItems="center" gap="2" color="fg.muted">
                                            <Icon as={Search} boxSize="6" opacity={0.5} />
                                            <Text fontSize="sm" fontWeight="medium" color="fg">
                                                No se encontraron usuarios
                                            </Text>
                                            <Text fontSize="xs">
                                                Prueba a ajustar los filtros o el término de búsqueda.
                                            </Text>
                                        </Stack>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {users.data.map((user) => (
                                <Table.Row
                                    key={user.id}
                                    onClick={() => router.visit(ShowAction.url({ user: user.id }))}
                                    _hover={{ bg: 'bg.muted' }}
                                    cursor="pointer"
                                    transition="background-color 0.15s"
                                >
                                    <Table.Cell>
                                        <Flex alignItems="center" gap="3">
                                            <Flex
                                                alignItems="center"
                                                justifyContent="center"
                                                w="9"
                                                h="9"
                                                borderRadius="full"
                                                bg="brand.subtle"
                                                color="brand.solid"
                                                fontSize="xs"
                                                fontWeight="semibold"
                                                flexShrink={0}
                                            >
                                                {getInitials(user.name) || '?'}
                                            </Flex>
                                            <Box minW="0">
                                                <Text fontWeight="medium" color="fg" truncate>{user.name}</Text>
                                                <Text fontSize="xs" color="fg.muted" truncate>{user.email}</Text>
                                            </Box>
                                        </Flex>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" color="fg" fontVariantNumeric="tabular-nums">{user.patients_count}</Table.Cell>
                                    <Table.Cell textAlign="center" color="fg" fontVariantNumeric="tabular-nums">{user.professional_appointments_count}</Table.Cell>
                                    <Table.Cell textAlign="right" color="fg" fontVariantNumeric="tabular-nums" fontWeight="medium">
                                        €{Number(user.paid_amount ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </Table.Cell>
                                    <Table.Cell color="fg.muted" fontSize="sm">{formatDate(user.created_at)}</Table.Cell>
                                    <Table.Cell textAlign="right">
                                        {user.id !== auth.user.id && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={(e) => deleteUser(e, user)}
                                                aria-label={`Eliminar a ${user.name}`}
                                            >
                                                <Trash2 size={13} />
                                            </Button>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>

                    {users.last_page > 1 && (
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
                                {users.total} usuarios · Página {users.current_page} de {users.last_page}
                            </Text>
                            <Flex gap="1">
                                {users.links.map((link, i) => (
                                    <chakra.button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        px="3"
                                        py="1"
                                        fontSize="xs"
                                        borderRadius="sm"
                                        transition="background-color 0.15s"
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
            </Stack>
        </>
    );
}

AdminDashboard.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
