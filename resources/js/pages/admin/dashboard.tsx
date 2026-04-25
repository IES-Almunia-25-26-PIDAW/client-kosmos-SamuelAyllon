import { Box, Flex, Heading, Stack, Table, Text, chakra } from '@chakra-ui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Admin/DashboardIndexAction';
import CreateAction from '@/actions/App/Http/Controllers/Admin/Users/CreateAction';
import DestroyAction from '@/actions/App/Http/Controllers/Admin/Users/DestroyAction';
import ShowAction from '@/actions/App/Http/Controllers/Admin/Users/ShowAction';
import { Button } from '@/components/ui/button';
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
    { value: 'all', label: 'Todos' },
    { value: 'professional', label: 'Profesional' },
    { value: 'patient', label: 'Paciente' },
] as const;

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

export default function AdminDashboard({ users, filters }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const roleRef = useRef(filters.role);
    useEffect(() => {
        roleRef.current = filters.role;
    });

    useEffect(() => {
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
                <Flex alignItems="flex-start" justifyContent="space-between">
                    <Box>
                        <Heading as="h1" fontSize="3xl" color="fg" display="flex" alignItems="center" gap="3">
                            <Users size={28} />
                            Usuarios
                        </Heading>
                        <Text mt="1" fontSize="md" color="fg.muted">
                            {users.total} usuarios registrados
                        </Text>
                    </Box>
                    <Button variant="primary" onClick={() => router.visit(CreateAction.url())}>
                        <Plus size={16} />
                        Nuevo usuario
                    </Button>
                </Flex>

                <Stack alignItems="center" gap="3">
                    <Box position="relative" w="full" maxW="xl">
                        <Box
                            position="absolute"
                            left="3"
                            top="50%"
                            transform="translateY(-50%)"
                            color="fg.muted"
                            pointerEvents="none"
                        >
                            <Search size={16} />
                        </Box>
                        <chakra.input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre o correo…"
                            w="full"
                            h="10"
                            pl="9"
                            pr="3"
                            bg="bg.surface"
                            borderWidth="1px"
                            borderColor="border"
                            borderRadius="md"
                            color="fg"
                            fontSize="sm"
                            _placeholder={{ color: 'fg.subtle' }}
                            _focusVisible={{
                                outline: 'none',
                                borderColor: 'brand.solid',
                                boxShadow: '0 0 0 3px var(--ck-colors-brand-muted)',
                            }}
                            transition="border-color, box-shadow"
                        />
                    </Box>

                    <Flex alignItems="center" gap="2">
                        {ROLE_FILTERS.map((f) => (
                            <chakra.button
                                key={f.value}
                                onClick={() => applyRoleFilter(f.value)}
                                px="4"
                                py="1.5"
                                fontSize="sm"
                                borderRadius="full"
                                borderWidth="1px"
                                transition="colors"
                                bg={activeRole === f.value ? 'brand.solid' : 'bg.surface'}
                                color={activeRole === f.value ? 'brand.contrast' : 'fg.muted'}
                                borderColor={activeRole === f.value ? 'brand.solid' : 'border'}
                                _hover={activeRole !== f.value ? { bg: 'bg.muted' } : undefined}
                            >
                                {f.label}
                            </chakra.button>
                        ))}
                    </Flex>
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
                                    <Table.Cell colSpan={6} textAlign="center" py="8" color="fg.muted">
                                        No se encontraron usuarios.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {users.data.map((user) => (
                                <Table.Row
                                    key={user.id}
                                    onClick={() => router.visit(ShowAction.url({ user: user.id }))}
                                    _hover={{ bg: 'bg.muted' }}
                                    cursor="pointer"
                                    transition="colors"
                                >
                                    <Table.Cell>
                                        <Text fontWeight="medium" color="fg">{user.name}</Text>
                                        <Text fontSize="xs" color="fg.muted">{user.email}</Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" color="fg">{user.patients_count}</Table.Cell>
                                    <Table.Cell textAlign="center" color="fg">{user.professional_appointments_count}</Table.Cell>
                                    <Table.Cell textAlign="right" color="fg" fontVariantNumeric="tabular-nums">
                                        €{Number(user.paid_amount ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </Table.Cell>
                                    <Table.Cell color="fg.muted">{formatDate(user.created_at)}</Table.Cell>
                                    <Table.Cell textAlign="right">
                                        {user.id !== auth.user.id && (
                                            <Button variant="destructive" size="sm" onClick={(e) => deleteUser(e, user)}>
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
            </Stack>
        </>
    );
}

AdminDashboard.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
