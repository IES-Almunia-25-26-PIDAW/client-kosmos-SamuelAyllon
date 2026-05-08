import { Badge, Box, Button, Card, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import ShowAction from '@/actions/App/Http/Controllers/Workspace/Team/ShowAction';
import CreateCollaborativeWorkspaceDialog from '@/components/create-collaborative-workspace-dialog';
import AppLayout from '@/layouts/app-layout';

interface WorkspaceCard {
    id: number;
    name: string;
    description: string | null;
    members_count: number;
    is_owner: boolean;
    created_at: string | null;
}

interface Props {
    workspaces: WorkspaceCard[];
}

export default function TeamIndex({ workspaces }: Props) {
    return (
        <>
            <Head title="Mis workspaces" />

            <Stack gap="8" p={{ base: '6', lg: '8' }}>
                <Flex alignItems="center" justifyContent="space-between" wrap="wrap" gap="3">
                    <Stack gap="1">
                        <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                            Workspaces colaborativos
                        </Heading>
                        <Text color="fg.muted" fontSize="sm">
                            Gestiona tus equipos y comparte pacientes con otros profesionales.
                        </Text>
                    </Stack>
                    <CreateCollaborativeWorkspaceDialog />
                </Flex>

                {workspaces.length === 0 ? (
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        gap="4"
                        py="16"
                        px="6"
                        rounded="xl"
                        borderWidth="1px"
                        borderStyle="dashed"
                        borderColor="border.muted"
                        bg="bg.subtle"
                    >
                        <Box color="fg.muted">
                            <Users size={40} />
                        </Box>
                        <Stack gap="1" textAlign="center" maxW="md">
                            <Text fontWeight="semibold" color="fg" fontSize="lg">
                                Aún no tienes workspaces colaborativos
                            </Text>
                            <Text fontSize="sm" color="fg.muted">
                                Crea un workspace para invitar a otros profesionales y compartir pacientes en equipo.
                            </Text>
                        </Stack>
                        <CreateCollaborativeWorkspaceDialog />
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="5">
                        {workspaces.map((workspace) => (
                            <Card.Root key={workspace.id} variant="outline">
                                <Card.Body>
                                    <Stack gap="4">
                                        <Flex justify="space-between" align="flex-start" gap="3">
                                            <Stack gap="1" flex="1">
                                                <Heading as="h3" fontSize="lg" color="fg">
                                                    {workspace.name}
                                                </Heading>
                                                {workspace.description && (
                                                    <Text fontSize="sm" color="fg.muted" lineClamp={2}>
                                                        {workspace.description}
                                                    </Text>
                                                )}
                                            </Stack>
                                            {workspace.is_owner && (
                                                <Badge colorPalette="brand" variant="subtle">
                                                    Propietario
                                                </Badge>
                                            )}
                                        </Flex>

                                        <Flex align="center" gap="2" color="fg.muted" fontSize="sm">
                                            <Users size={16} />
                                            <Text>
                                                {workspace.members_count}{' '}
                                                {workspace.members_count === 1 ? 'miembro' : 'miembros'}
                                            </Text>
                                        </Flex>
                                    </Stack>
                                </Card.Body>
                                <Card.Footer>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        width="full"
                                    >
                                        <Link href={ShowAction.url({ workspace: workspace.id })}>
                                            Gestionar
                                            <ArrowRight size={16} />
                                        </Link>
                                    </Button>
                                </Card.Footer>
                            </Card.Root>
                        ))}
                    </SimpleGrid>
                )}
            </Stack>
        </>
    );
}

TeamIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
