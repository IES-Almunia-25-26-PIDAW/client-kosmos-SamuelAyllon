import { Box, chakra, Flex, Heading, Icon, Stack, Table, Text } from '@chakra-ui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Plus, Trash2, Users } from 'lucide-react';
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

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('');

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
                                Profesionales
                            </Heading>
                            <Text mt="1" fontSize="sm" color="fg.muted">
                                {users.total} {users.total === 1 ? 'profesional registrado' : 'profesionales registrados'}
                            </Text>
                        </Box>
                    </Flex>
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
                            {users.data.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="12">
                                        <Stack alignItems="center" gap="2" color="fg.muted">
                                            <Icon as={Users} boxSize="6" opacity={0.5} />
                                            <Text fontSize="sm" fontWeight="medium" color="fg">
                                                Sin profesionales todavía
                                            </Text>
                                            <Text fontSize="xs">
                                                Crea el primer profesional con el botón superior.
                                            </Text>
                                        </Stack>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {users.data.map((user) => (
                                <Table.Row key={user.id} _hover={{ bg: 'bg.muted' }} transition="background-color 0.15s">
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
                                                <ChakraLink
                                                    href={`/admin/users/${user.id}`}
                                                    fontWeight="medium"
                                                    color="brand.solid"
                                                    display="block"
                                                    truncate
                                                    _hover={{ textDecoration: 'underline' }}
                                                >
                                                    {user.name}
                                                </ChakraLink>
                                                <Text fontSize="xs" color="fg.muted" truncate>{user.email}</Text>
                                            </Box>
                                        </Flex>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" color="fg" fontVariantNumeric="tabular-nums">{user.patients_count}</Table.Cell>
                                    <Table.Cell textAlign="center" color="fg" fontVariantNumeric="tabular-nums">{user.sessions_count}</Table.Cell>
                                    <Table.Cell textAlign="right" color="fg" fontVariantNumeric="tabular-nums" fontWeight="medium">
                                        €{Number(user.paid_amount ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </Table.Cell>
                                    <Table.Cell color="fg.muted" fontSize="sm">{formatDate(user.created_at)}</Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <Flex alignItems="center" justifyContent="flex-end" gap="2">
                                            <ChakraLink href={`/admin/users/${user.id}`}>
                                                <Button variant="secondary" size="sm">
                                                    <Eye size={13} />
                                                    Ver
                                                </Button>
                                            </ChakraLink>
                                            {user.id !== auth.user.id && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => deleteUser(user)}
                                                    aria-label={`Eliminar a ${user.name}`}
                                                >
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

AdminUsersIndex.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
