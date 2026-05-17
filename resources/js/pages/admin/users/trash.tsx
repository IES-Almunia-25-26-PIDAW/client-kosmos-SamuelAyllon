import { Badge, Box, chakra, Flex, Heading, Icon, Stack, Table, Text } from '@chakra-ui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, RotateCcw, Trash2, TriangleAlert, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import { dashboard } from '@/routes/admin';
import users from '@/routes/admin/users';

const ChakraLink = chakra(Link);

interface TrashedUserRow {
    id: number;
    name: string;
    email: string;
    original_email: string;
    role: string;
    has_google: boolean;
    deleted_at: string | null;
    created_at: string | null;
}

interface Props {
    users: {
        data: TrashedUserRow[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

interface FlashProps {
    flash?: { success?: string };
    errors?: Record<string, string>;
    [key: string]: unknown;
}

const formatDate = (iso: string | null) => {
    if (!iso) {
        return '—';
    }
    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));
};

const getInitials = (name: string) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('');

export default function AdminUsersTrash({ users: trashed }: Props) {
    const { flash, errors } = usePage<FlashProps>().props;

    const restoreUser = (user: TrashedUserRow) => {
        if (!confirm(`¿Restaurar a ${user.name}? Recuperará acceso con el email ${user.original_email}.`)) {
            return;
        }
        router.post(users.restore(user.id).url);
    };

    const forceDeleteUser = (user: TrashedUserRow) => {
        if (
            !confirm(
                `¿Eliminar a ${user.name} de forma PERMANENTE?\n\nEsta acción no se puede deshacer y borrará el registro definitivamente de la base de datos.`,
            )
        ) {
            return;
        }
        router.delete(users.forceDelete(user.id).url);
    };

    const errorMessages = errors ? Object.values(errors) : [];

    return (
        <>
            <Head title="Papelera de usuarios — Admin — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }}>
                <Flex alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap="4">
                    <Flex alignItems="center" gap="3">
                        <Flex
                            alignItems="center"
                            justifyContent="center"
                            w="11"
                            h="11"
                            borderRadius="lg"
                            bg="bg.muted"
                            color="fg.muted"
                            borderWidth="1px"
                            borderColor="border"
                        >
                            <Icon as={Trash2} boxSize="5" />
                        </Flex>
                        <Box>
                            <Heading as="h1" fontSize="2xl" color="fg" lineHeight="1.2">
                                Papelera
                            </Heading>
                            <Text mt="1" fontSize="sm" color="fg.muted">
                                {trashed.total} {trashed.total === 1 ? 'usuario eliminado' : 'usuarios eliminados'} (soft-delete)
                            </Text>
                        </Box>
                    </Flex>
                    <ChakraLink href={dashboard().url}>
                        <Button variant="secondary">
                            <ArrowLeft size={16} />
                            Volver al panel
                        </Button>
                    </ChakraLink>
                </Flex>

                {flash?.success && (
                    <Box
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="success.emphasized"
                        bg="success.subtle"
                        color="success.fg"
                        px="4"
                        py="3"
                        fontSize="sm"
                    >
                        {flash.success}
                    </Box>
                )}

                {errorMessages.length > 0 && (
                    <Stack
                        gap="1"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="danger.emphasized"
                        bg="danger.subtle"
                        color="danger.fg"
                        px="4"
                        py="3"
                        fontSize="sm"
                    >
                        <Flex alignItems="center" gap="2" fontWeight="medium">
                            <Icon as={TriangleAlert} boxSize="4" />
                            No se pudo completar la acción
                        </Flex>
                        {errorMessages.map((msg, i) => (
                            <Text key={i}>{msg}</Text>
                        ))}
                    </Stack>
                )}

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
                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                    Usuario
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                    Rol
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                    Alta
                                </Table.ColumnHeader>
                                <Table.ColumnHeader fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                    Eliminado
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="right" fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                                    Acciones
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {trashed.data.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={5} py="12">
                                        <Stack alignItems="center" gap="2" color="fg.muted">
                                            <Icon as={Users} boxSize="6" opacity={0.5} />
                                            <Text fontSize="sm" fontWeight="medium" color="fg">
                                                Papelera vacía
                                            </Text>
                                            <Text fontSize="xs">
                                                Los usuarios que elimines desde el panel aparecerán aquí.
                                            </Text>
                                        </Stack>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {trashed.data.map((user) => (
                                <Table.Row key={user.id} _hover={{ bg: 'bg.muted' }} transition="background-color 0.15s">
                                    <Table.Cell>
                                        <Flex alignItems="center" gap="3">
                                            <Flex
                                                alignItems="center"
                                                justifyContent="center"
                                                w="9"
                                                h="9"
                                                borderRadius="full"
                                                bg="bg.muted"
                                                color="fg.muted"
                                                fontSize="xs"
                                                fontWeight="semibold"
                                                flexShrink={0}
                                                borderWidth="1px"
                                                borderColor="border"
                                            >
                                                {getInitials(user.name) || '?'}
                                            </Flex>
                                            <Box minW="0">
                                                <Text fontWeight="medium" color="fg" truncate>
                                                    {user.name}
                                                </Text>
                                                <Text fontSize="xs" color="fg.muted" truncate>
                                                    {user.original_email}
                                                </Text>
                                                {user.has_google && (
                                                    <Text fontSize="2xs" color="fg.subtle" mt="0.5">
                                                        Vinculado a Google
                                                    </Text>
                                                )}
                                            </Box>
                                        </Flex>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            variant="subtle"
                                            colorPalette={
                                                user.role === 'admin'
                                                    ? 'red'
                                                    : user.role === 'professional'
                                                      ? 'brand'
                                                      : user.role === 'patient'
                                                        ? 'blue'
                                                        : 'gray'
                                            }
                                            size="sm"
                                        >
                                            {user.role}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell color="fg.muted" fontSize="sm">
                                        {formatDate(user.created_at)}
                                    </Table.Cell>
                                    <Table.Cell color="fg.muted" fontSize="sm">
                                        {formatDate(user.deleted_at)}
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <Flex alignItems="center" justifyContent="flex-end" gap="2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => restoreUser(user)}
                                                aria-label={`Restaurar a ${user.name}`}
                                            >
                                                <RotateCcw size={13} />
                                                Restaurar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => forceDeleteUser(user)}
                                                aria-label={`Eliminar permanentemente a ${user.name}`}
                                            >
                                                <Trash2 size={13} />
                                            </Button>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>

                    {trashed.last_page > 1 && (
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
                                {trashed.total} usuarios · Página {trashed.current_page} de {trashed.last_page}
                            </Text>
                            <Flex gap="1">
                                {trashed.links.map((link, i) => (
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

AdminUsersTrash.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
