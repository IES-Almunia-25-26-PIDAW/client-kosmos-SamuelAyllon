import { Avatar, Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';
import type { ReactNode } from 'react';
import ConversationAction from '@/actions/App/Http/Controllers/Message/ConversationAction';
import { EmptyState } from '@/components/empty-state';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData } from '@/types';

interface Sender {
    id: number;
    name: string;
    avatar_path: string | null;
}

interface Message {
    id: number;
    body: string;
    created_at: string;
    read_at: string | null;
    sender: Sender;
}

interface Conversation {
    id: number;
    name: string;
    avatar_path: string | null;
}

interface Props {
    inbox: PaginatedData<Message>;
    conversations: Conversation[];
}

export default function MessagesIndex({ inbox, conversations }: Props) {
    return (
        <>
            <Head title="Mensajes" />

            <Stack gap="8" p={{ base: '6', lg: '8' }}>
                <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                    Mensajes
                </Heading>

                {conversations.length > 0 && (
                    <Stack gap="2">
                        <Text fontWeight="medium" color="fg.muted" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                            Conversaciones
                        </Text>
                        <Flex gap="3" flexWrap="wrap">
                            {conversations.map((c) => (
                                <Box
                                    key={c.id}
                                    as="button"
                                    onClick={() => router.visit(ConversationAction.url(c.id))}
                                    p="3"
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="border"
                                    bg="bg.subtle"
                                    _hover={{ bg: 'bg.muted' }}
                                    transition="background 0.15s"
                                    textAlign="left"
                                >
                                    <Flex alignItems="center" gap="2">
                                        <Avatar.Root size="sm">
                                            {c.avatar_path ? (
                                                <Avatar.Image src={c.avatar_path} alt={c.name} />
                                            ) : (
                                                <Avatar.Fallback>{c.name.charAt(0)}</Avatar.Fallback>
                                            )}
                                        </Avatar.Root>
                                        <Text fontWeight="medium" color="fg" fontSize="sm">
                                            {c.name}
                                        </Text>
                                    </Flex>
                                </Box>
                            ))}
                        </Flex>
                    </Stack>
                )}

                <Stack gap="2">
                    <Text fontWeight="medium" color="fg.muted" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                        Bandeja de entrada
                    </Text>

                    {inbox.data.length === 0 ? (
                        <EmptyState
                            icon={MessageSquare}
                            title="Sin mensajes"
                            description="Cuando recibas mensajes aparecerán aquí."
                        />
                    ) : (
                        <Stack gap="2">
                            {inbox.data.map((msg) => (
                                <Box
                                    key={msg.id}
                                    as="button"
                                    onClick={() => router.visit(ConversationAction.url(msg.sender.id))}
                                    p="4"
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="border"
                                    bg={msg.read_at ? 'bg' : 'bg.subtle'}
                                    _hover={{ bg: 'bg.muted' }}
                                    transition="background 0.15s"
                                    textAlign="left"
                                    w="full"
                                >
                                    <Flex alignItems="center" gap="3">
                                        <Avatar.Root size="sm" flexShrink={0}>
                                            {msg.sender.avatar_path ? (
                                                <Avatar.Image src={msg.sender.avatar_path} alt={msg.sender.name} />
                                            ) : (
                                                <Avatar.Fallback>{msg.sender.name.charAt(0)}</Avatar.Fallback>
                                            )}
                                        </Avatar.Root>
                                        <Stack gap="0" flex="1" minW="0">
                                            <Flex justifyContent="space-between" alignItems="center" gap="2">
                                                <Text
                                                    fontWeight={msg.read_at ? 'normal' : 'semibold'}
                                                    color="fg"
                                                    fontSize="sm"
                                                    truncate
                                                >
                                                    {msg.sender.name}
                                                </Text>
                                                <Text color="fg.muted" fontSize="xs" flexShrink={0}>
                                                    {new Date(msg.created_at).toLocaleDateString('es-ES')}
                                                </Text>
                                            </Flex>
                                            <Text color="fg.muted" fontSize="sm" truncate>
                                                {msg.body}
                                            </Text>
                                        </Stack>
                                        {!msg.read_at && (
                                            <Box w="2" h="2" borderRadius="full" bg="brand.solid" flexShrink={0} />
                                        )}
                                    </Flex>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </>
    );
}

MessagesIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
