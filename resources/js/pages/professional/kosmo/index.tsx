import { Box, Flex, Heading, Icon, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, router } from '@inertiajs/react';
import { Sparkles, Send } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import ChatAction from '@/actions/App/Http/Controllers/Kosmo/ChatAction';
import MarkReadAction from '@/actions/App/Http/Controllers/Kosmo/MarkReadAction';
import { EmptyState } from '@/components/empty-state';
import { KosmoBriefing as KosmoBriefingComponent } from '@/components/kosmo/kosmo-briefing';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { KosmoBriefing } from '@/types';

interface Props {
    briefings: KosmoBriefing[];
}

interface ChatMessage {
    role: 'user' | 'kosmo';
    content: string;
    timestamp: Date;
}

const getCSRFToken = (): string =>
    decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '');

export default function KosmoPage({ briefings }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((m) => [...m, { role: 'user', content: userMessage, timestamp: new Date() }]);
        setLoading(true);

        try {
            const res = await fetch(ChatAction.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCSRFToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ message: userMessage }),
            });
            const data = await res.json();
            setMessages((m) => [...m, {
                role: 'kosmo',
                content: data.response ?? 'No he podido generar una respuesta.',
                timestamp: new Date(),
            }]);
        } catch {
            setMessages((m) => [...m, {
                role: 'kosmo',
                content: 'Error al conectar con Kosmo. Inténtalo de nuevo.',
                timestamp: new Date(),
            }]);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (d: Date) =>
        new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(d);

    return (
        <>
            <Head title="Kosmo — ClientKosmos" />

            <Flex direction="column" h="full" p={{ base: '6', lg: '8' }} gap="6" maxW="4xl">
                <Box>
                    <Heading as="h1" fontSize="3xl" color="fg" display="flex" alignItems="center" gap="3">
                        <Icon as={Sparkles} boxSize="7" color="brand.solid" />
                        Kosmo
                    </Heading>
                    <Text mt="1" fontSize="md" color="fg.muted">
                        Tu asistente de psicología clínica. Pregúntame sobre tus pacientes, sesiones o mejores prácticas.
                    </Text>
                </Box>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap="6" flex="1">
                    <Flex direction="column" gap="4" gridColumn={{ lg: 'span 2' }}>
                        <Flex
                            direction="column"
                            flex="1"
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="border"
                            bg="bg.surface"
                            boxShadow="sm"
                            overflow="hidden"
                            minH="400px"
                        >
                            <Stack flex="1" overflowY="auto" p="4" gap="4">
                                {messages.length === 0 && (
                                    <Flex direction="column" alignItems="center" justifyContent="center" h="full" textAlign="center" py="12">
                                        <Flex
                                            h="16"
                                            w="16"
                                            borderRadius="2xl"
                                            bg="brand.muted"
                                            alignItems="center"
                                            justifyContent="center"
                                            mb="4"
                                        >
                                            <Icon as={Sparkles} boxSize="8" color="brand.solid" />
                                        </Flex>
                                        <Text fontSize="sm" fontWeight="medium" color="fg">Hola, soy Kosmo</Text>
                                        <Text fontSize="xs" color="fg.muted" mt="1" maxW="xs">
                                            ¿En qué te puedo ayudar hoy? Puedo resumir sesiones, sugerir intervenciones o recordarte el estado de tus pacientes.
                                        </Text>
                                    </Flex>
                                )}
                                {messages.map((msg, i) => {
                                    const isKosmo = msg.role === 'kosmo';
                                    return (
                                        <Flex key={i} gap="3" flexDirection={isKosmo ? 'row' : 'row-reverse'}>
                                            <Flex
                                                h="8"
                                                w="8"
                                                borderRadius="full"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexShrink={0}
                                                fontSize="xs"
                                                fontWeight="semibold"
                                                bg={isKosmo ? 'brand.muted' : 'brand.solid'}
                                                color={isKosmo ? 'brand.solid' : 'brand.contrast'}
                                            >
                                                {isKosmo ? 'K' : 'Tú'}
                                            </Flex>
                                            <Box
                                                maxW="80%"
                                                borderRadius="lg"
                                                px="4"
                                                py="3"
                                                fontSize="sm"
                                                bg={isKosmo ? 'brand.muted' : 'brand.solid'}
                                                color={isKosmo ? 'fg' : 'brand.contrast'}
                                                borderWidth={isKosmo ? '1px' : '0'}
                                                borderColor={isKosmo ? 'brand.muted' : undefined}
                                            >
                                                <Text whiteSpace="pre-wrap">{msg.content}</Text>
                                                <Text
                                                    fontSize="xs"
                                                    mt="1"
                                                    color={isKosmo ? 'fg.subtle' : 'whiteAlpha.700'}
                                                >
                                                    {formatTime(msg.timestamp)}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    );
                                })}
                                {loading && (
                                    <Flex gap="3">
                                        <Flex h="8" w="8" borderRadius="full" bg="brand.muted" alignItems="center" justifyContent="center" flexShrink={0}>
                                            <Icon as={Sparkles} boxSize="3.5" color="brand.solid" animation="pulse 1s infinite" />
                                        </Flex>
                                        <Box bg="brand.muted" borderWidth="1px" borderColor="brand.muted" borderRadius="lg" px="4" py="3">
                                            <Flex gap="1">
                                                <Box as="span" h="2" w="2" borderRadius="full" bg="brand.solid" animation="bounce 1s infinite" style={{ animationDelay: '0ms' }} />
                                                <Box as="span" h="2" w="2" borderRadius="full" bg="brand.solid" animation="bounce 1s infinite" style={{ animationDelay: '150ms' }} />
                                                <Box as="span" h="2" w="2" borderRadius="full" bg="brand.solid" animation="bounce 1s infinite" style={{ animationDelay: '300ms' }} />
                                            </Flex>
                                        </Box>
                                    </Flex>
                                )}
                                <div ref={messagesEndRef} />
                            </Stack>

                            <Box p="3" borderTopWidth="1px" borderColor="border.subtle" bg="bg.muted">
                                <Flex gap="2">
                                    <chakra.input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                        placeholder="Pregúntale a Kosmo…"
                                        flex="1"
                                        h="10"
                                        px="3"
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
                                    <Button
                                        variant="primary"
                                        onClick={sendMessage}
                                        disabled={!input.trim() || loading}
                                        h="10"
                                        w="10"
                                        p="0"
                                    >
                                        <Send size={16} />
                                    </Button>
                                </Flex>
                            </Box>
                        </Flex>
                    </Flex>

                    <Stack gap="4">
                        <Heading as="h3" fontSize="xl" color="fg">Briefings pendientes</Heading>
                        {briefings.length === 0 ? (
                            <EmptyState
                                icon={Sparkles}
                                title="Todo al día"
                                description="No hay briefings sin leer."
                            />
                        ) : (
                            briefings.map((briefing) => (
                                <KosmoBriefingComponent
                                    key={briefing.id}
                                    title={briefing.type === 'daily' ? 'Briefing diario' : 'Briefing de sesión'}
                                    content={
                                        <Text fontSize="sm" color="fg.muted">
                                            {typeof briefing.content === 'object' && 'summary' in briefing.content
                                                ? String(briefing.content.summary)
                                                : 'Ver detalle'}
                                        </Text>
                                    }
                                    onDismiss={() => router.post(MarkReadAction.url(briefing.id))}
                                />
                            ))
                        )}
                    </Stack>
                </Box>
            </Flex>
        </>
    );
}

KosmoPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
