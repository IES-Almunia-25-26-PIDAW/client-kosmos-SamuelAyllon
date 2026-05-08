import { Avatar, Badge, Box, Card, Flex, Heading, IconButton, SimpleGrid, Stack, Table, Tabs, Text } from '@chakra-ui/react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import ShareAction from '@/actions/App/Http/Controllers/Workspace/Patient/ShareAction';
import UnshareAction from '@/actions/App/Http/Controllers/Workspace/Patient/UnshareAction';
import IndexAction from '@/actions/App/Http/Controllers/Workspace/Team/IndexAction';
import InviteAction from '@/actions/App/Http/Controllers/Workspace/Team/InviteAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

interface Workspace {
    id: number;
    name: string;
    description: string | null;
    is_owner: boolean;
}

interface Member {
    id: number;
    name: string;
    email: string;
    avatar_path: string | null;
    pivot: {
        role: string;
        joined_at: string | null;
        is_active: boolean;
    };
}

interface Patient {
    id: number;
    name: string | null;
    email: string | null;
    avatar_path: string | null;
    is_shared: boolean;
}

interface Props {
    workspace: Workspace;
    members: Member[];
    patients: Patient[];
}

const roleLabel: Record<string, string> = {
    owner: 'Propietario',
    admin: 'Administrador',
    member: 'Miembro',
    billing_manager: 'Facturación',
};

export default function TeamShow({ workspace, members, patients }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({ email: '' });

    function handleInvite(e: React.FormEvent) {
        e.preventDefault();
        post(InviteAction.url({ workspace: workspace.id }), { onSuccess: () => reset() });
    }

    function togglePatient(patient: Patient) {
        if (patient.is_shared) {
            router.delete(UnshareAction.url({ workspace: workspace.id, patient: patient.id }), {
                preserveScroll: true,
            });
        } else {
            router.post(
                ShareAction.url({ workspace: workspace.id, patient: patient.id }),
                {},
                { preserveScroll: true },
            );
        }
    }

    return (
        <>
            <Head title={`Equipo — ${workspace.name}`} />

            <Stack gap="8" p={{ base: '6', lg: '8' }}>
                <Stack gap="4">
                    <Button asChild variant="ghost" size="sm" alignSelf="flex-start">
                        <Link href={IndexAction.url()}>
                            <ArrowLeft size={16} />
                            Volver a workspaces
                        </Link>
                    </Button>

                    <Flex alignItems="center" justifyContent="space-between" wrap="wrap" gap="3">
                        <Stack gap="1">
                            <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                                {workspace.name}
                            </Heading>
                            {workspace.description && (
                                <Text color="fg.muted">{workspace.description}</Text>
                            )}
                        </Stack>
                        {workspace.is_owner && (
                            <Badge colorPalette="brand" variant="subtle">
                                Propietario
                            </Badge>
                        )}
                    </Flex>
                </Stack>

                <Tabs.Root defaultValue="team" variant="line">
                    <Tabs.List>
                        <Tabs.Trigger value="team">
                            <Users size={16} />
                            Equipo ({members.length})
                        </Tabs.Trigger>
                        <Tabs.Trigger value="patients">
                            <UserPlus size={16} />
                            Pacientes compartidos ({patients.filter((p) => p.is_shared).length})
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="team">
                        <Stack gap="6" pt="4">
                            <Box as="form" onSubmit={handleInvite}>
                                <Stack gap="3">
                                    <Text fontWeight="medium" color="fg">
                                        Invitar profesional
                                    </Text>
                                    <Flex gap="3" alignItems="flex-start">
                                        <Stack gap="1" flex="1">
                                            <Input
                                                type="email"
                                                placeholder="correo@ejemplo.com"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            {errors.email && (
                                                <Text fontSize="sm" color="red.500">
                                                    {errors.email}
                                                </Text>
                                            )}
                                        </Stack>
                                        <Button type="submit" variant="primary" loading={processing}>
                                            <UserPlus size={16} />
                                            Invitar
                                        </Button>
                                    </Flex>
                                </Stack>
                            </Box>

                            <Table.Root variant="outline" size="md">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>Miembro</Table.ColumnHeader>
                                        <Table.ColumnHeader>Rol</Table.ColumnHeader>
                                        <Table.ColumnHeader>Estado</Table.ColumnHeader>
                                        <Table.ColumnHeader>Se unió</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {members.map((member) => (
                                        <Table.Row key={member.id}>
                                            <Table.Cell>
                                                <Flex alignItems="center" gap="3">
                                                    <Avatar.Root size="sm">
                                                        {member.avatar_path ? (
                                                            <Avatar.Image src={member.avatar_path} alt={member.name} />
                                                        ) : (
                                                            <Avatar.Fallback>{member.name.charAt(0)}</Avatar.Fallback>
                                                        )}
                                                    </Avatar.Root>
                                                    <Stack gap="0">
                                                        <Text fontWeight="medium" color="fg">
                                                            {member.name}
                                                        </Text>
                                                        <Text fontSize="sm" color="fg.muted">
                                                            {member.email}
                                                        </Text>
                                                    </Stack>
                                                </Flex>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text color="fg">{roleLabel[member.pivot.role] ?? member.pivot.role}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge colorPalette={member.pivot.is_active ? 'green' : 'gray'}>
                                                    {member.pivot.is_active ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text color="fg.muted" fontSize="sm">
                                                    {member.pivot.joined_at
                                                        ? new Date(member.pivot.joined_at).toLocaleDateString('es-ES')
                                                        : '—'}
                                                </Text>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Stack>
                    </Tabs.Content>

                    <Tabs.Content value="patients">
                        <Stack gap="4" pt="4">
                            <Text fontSize="sm" color="fg.muted">
                                Comparte un paciente para que el resto de miembros del workspace pueda colaborar en su caso.
                            </Text>

                            {patients.length === 0 ? (
                                <Flex
                                    direction="column"
                                    align="center"
                                    gap="2"
                                    py="10"
                                    rounded="lg"
                                    borderWidth="1px"
                                    borderStyle="dashed"
                                    borderColor="border.muted"
                                    bg="bg.subtle"
                                >
                                    <Text fontSize="sm" color="fg.muted">
                                        No tienes pacientes para compartir.
                                    </Text>
                                </Flex>
                            ) : (
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap="3">
                                    {patients.map((patient) => (
                                        <Card.Root key={patient.id} variant="outline">
                                            <Card.Body>
                                                <Flex align="center" justify="space-between" gap="3">
                                                    <Flex align="center" gap="3" flex="1" minW="0">
                                                        <Avatar.Root size="sm">
                                                            {patient.avatar_path ? (
                                                                <Avatar.Image src={patient.avatar_path} alt={patient.name ?? ''} />
                                                            ) : (
                                                                <Avatar.Fallback>
                                                                    {patient.name?.charAt(0) ?? '?'}
                                                                </Avatar.Fallback>
                                                            )}
                                                        </Avatar.Root>
                                                        <Stack gap="0" flex="1" minW="0">
                                                            <Text fontWeight="medium" color="fg" truncate>
                                                                {patient.name ?? 'Sin nombre'}
                                                            </Text>
                                                            <Text fontSize="sm" color="fg.muted" truncate>
                                                                {patient.email ?? ''}
                                                            </Text>
                                                        </Stack>
                                                    </Flex>
                                                    {patient.is_shared ? (
                                                        <Flex gap="2" align="center">
                                                            <Badge colorPalette="green" variant="subtle">
                                                                <Check size={12} />
                                                                Compartido
                                                            </Badge>
                                                            <IconButton
                                                                aria-label="Retirar"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => togglePatient(patient)}
                                                            >
                                                                <Trash2 size={14} />
                                                            </IconButton>
                                                        </Flex>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => togglePatient(patient)}
                                                        >
                                                            <Plus size={14} />
                                                            Compartir
                                                        </Button>
                                                    )}
                                                </Flex>
                                            </Card.Body>
                                        </Card.Root>
                                    ))}
                                </SimpleGrid>
                            )}
                        </Stack>
                    </Tabs.Content>
                </Tabs.Root>
            </Stack>
        </>
    );
}

TeamShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
