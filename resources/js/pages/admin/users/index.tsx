import { Box, Flex, Heading, Stack, Table, Text, chakra } from '@chakra-ui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Trash2, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { Auth } from '@/types';

const ChakraLink = chakra(Link);

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: 'professional' | 'admin';
    patients_count: number;
    sessions_count: number;
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
}

const formatDate = (d: string) =>
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

export default function AdminUsersIndex({ users }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const deleteUser = (user: UserRow) => {
        if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
        router.delete(`/admin/users/${user.id}`);
    };

    return (
        <>
            <Head title="Usuarios — Admin — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }}>
                <Flex alignItems="flex-start" justifyContent="space-between">
                    <Box>
                        <Heading as="h1" fontSize="3xl" color="fg" display="flex" alignItems="center" gap="3">
                            <Users size={28} />
                            Profesionales
                        </Heading>
                        <Text mt="1" fontSize="md" color="fg.muted">
                            {users.total} profesionales registrados
                        </Text>
                    </Box>
                    <ChakraLink href="/admin/users/create">
                        <Button variant="primary">
                            <Plus size={16} />
                            Nuevo profesional
                        </Button>
                    </ChakraLink>
                </Flex>

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
                            {users.data.map((user) => (
                                <Table.Row key={user.id} _hover={{ bg: 'bg.muted' }} transition="colors">
                                    <Table.Cell>
                                        <ChakraLink
                                            href={`/admin/users/${user.id}`}
                                            fontWeight="medium"
                                            color="brand.solid"
                                            _hover={{ textDecoration: 'underline' }}
                                        >
                                            {user.name}
                                        </ChakraLink>
                                        <Text fontSize="xs" color="fg.muted">{user.email}</Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" color="fg">{user.patients_count}</Table.Cell>
                                    <Table.Cell textAlign="center" color="fg">{user.sessions_count}</Table.Cell>
                                    <Table.Cell textAlign="right" color="fg" fontVariantNumeric="tabular-nums">
                                        €{Number(user.paid_amount ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </Table.Cell>
                                    <Table.Cell color="fg.muted">{formatDate(user.created_at)}</Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <Flex alignItems="center" justifyContent="flex-end" gap="2">
                                            <ChakraLink href={`/admin/users/${user.id}`}>
                                                <Button variant="secondary" size="sm">
                                                    Ver
                                                </Button>
                                            </ChakraLink>
                                            {user.id !== auth.user.id && (
                                                <Button variant="destructive" size="sm" onClick={() => deleteUser(user)}>
                                                    <Trash2 size={13} />
                                                </Button>
                                            )}
                                        </Flex>
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

AdminUsersIndex.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
