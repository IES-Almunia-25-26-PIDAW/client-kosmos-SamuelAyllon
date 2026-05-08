import { Avatar, Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Head, Link } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface MessageRow {
    id: number;
    subject: string | null;
    body: string;
    read_at: string | null;
    created_at: string;
    sender: {
        id: number;
        name: string;
        avatar_path: string | null;
    } | null;
}

interface Paginated<T> {
    data: T[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    messages: Paginated<MessageRow>;
}

const getInitials = (name: string): string =>
    name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

const formatDate = (iso: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso));

export default function PatientMessagesIndex({ messages }: Props) {
    const rows = messages.data;

    return (
        <>
            <Head title="Mis mensajes — ClientKosmos" />

            <Stack
                id="main-content"
                tabIndex={-1}
                gap="8"
                pt={{ base: '10', lg: '14' }}
                px={{ base: '6', lg: '8' }}
                pb="10"
                maxW="5xl"
                mx="auto"
                w="full"
            >
                <Stack gap="1">
                    <Heading as="h1" fontSize="4xl" fontWeight="bold" color="fg" letterSpacing="-0.48px">
                        Mis mensajes
                    </Heading>
                    <Text fontSize="md" color="fg.muted">
                        {rows.length === 0
                            ? 'No tienes mensajes todavía.'
                            : `${rows.length} mensaje${rows.length === 1 ? '' : 's'} en esta página`}
                    </Text>
                </Stack>

                {rows.length === 0 ? (
                    <Box
                        borderRadius="2xl"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="12"
                        textAlign="center"
                    >
                        <Box as={MessageSquare} w="10" h="10" mx="auto" mb="3" color="fg.subtle" aria-hidden />
                        <Text fontSize="sm" color="fg.muted">
                            Cuando recibas un mensaje de tu profesional aparecerá aquí.
                        </Text>
                    </Box>
                ) : (
                    <Stack gap="3" role="list">
                        {rows.map((msg) => {
                            const isUnread = msg.read_at === null;

                            return (
                                <Flex
                                    key={msg.id}
                                    role="listitem"
                                    bg="bg.surface"
                                    borderRadius="2xl"
                                    borderWidth="1px"
                                    borderColor={isUnread ? 'brand.emphasized' : 'border'}
                                    boxShadow="sm"
                                    p="5"
                                    gap="4"
                                    alignItems="flex-start"
                                >
                                    <Avatar.Root size="md" flexShrink={0}>
                                        {msg.sender?.avatar_path ? (
                                            <Avatar.Image src={msg.sender.avatar_path} alt="" />
                                        ) : null}
                                        <Avatar.Fallback bg="brand.subtle" color="brand.solid" fontWeight="semibold">
                                            {msg.sender ? getInitials(msg.sender.name) : '?'}
                                        </Avatar.Fallback>
                                    </Avatar.Root>

                                    <Stack gap="1" flex="1" minW={0}>
                                        <Flex justifyContent="space-between" alignItems="center" gap="2" flexWrap="wrap">
                                            <Text
                                                fontWeight={isUnread ? 'semibold' : 'medium'}
                                                color="fg"
                                                fontSize="sm"
                                            >
                                                {msg.sender?.name ?? 'Profesional'}
                                            </Text>
                                            <Text fontSize="xs" color="fg.subtle">
                                                {formatDate(msg.created_at)}
                                            </Text>
                                        </Flex>

                                        {msg.subject && (
                                            <Text
                                                fontSize="sm"
                                                fontWeight={isUnread ? 'semibold' : 'normal'}
                                                color="fg"
                                                truncate
                                            >
                                                {msg.subject}
                                            </Text>
                                        )}

                                        <Text fontSize="sm" color="fg.muted" lineClamp={2}>
                                            {msg.body}
                                        </Text>
                                    </Stack>

                                    {isUnread && (
                                        <Box
                                            w="2"
                                            h="2"
                                            borderRadius="full"
                                            bg="brand.solid"
                                            flexShrink={0}
                                            mt="1.5"
                                            aria-label="No leído"
                                        />
                                    )}
                                </Flex>
                            );
                        })}
                    </Stack>
                )}

                {(messages.prev_page_url || messages.next_page_url) && (
                    <Flex justifyContent="center" gap="3">
                        {messages.prev_page_url && (
                            <Button asChild variant="secondary" size="sm">
                                <Link href={messages.prev_page_url}>Anterior</Link>
                            </Button>
                        )}
                        {messages.next_page_url && (
                            <Button asChild variant="secondary" size="sm">
                                <Link href={messages.next_page_url}>Siguiente</Link>
                            </Button>
                        )}
                    </Flex>
                )}
            </Stack>
        </>
    );
}

PatientMessagesIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
