import {
    Box,
    Card,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    Input,
    ScrollArea,
    Separator,
    Stack,
    Text,
} from '@chakra-ui/react';
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

            <Container maxW="7xl" px={{ base: '4', md: '6', lg: '8' }} py={{ base: '6', lg: '8' }}>
                <Stack gap="6">
                    {/* Page header */}
                    <Box>
                        <HStack gap="3">
                            <Flex
                                h="10"
                                w="10"
                                borderRadius="xl"
                                bg="kosmo.muted"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                            >
                                <Icon as={Sparkles} boxSize="5" color="kosmo.solid" />
                            </Flex>
                            <Box>
                                <Heading as="h1" fontSize="2xl" color="fg" fontWeight="semibold" lineHeight="1.2">
                                    Kosmo
                                </Heading>
                                <Text fontSize="sm" color="fg.muted" mt="0.5">
                                    Tu asistente de psicología clínica. Pregúntame sobre tus pacientes, sesiones o mejores prácticas.
                                </Text>
                            </Box>
                        </HStack>
                        <Separator mt="4" borderColor="border.subtle" />
                    </Box>

                    {/* Main grid */}
                    <Box
                        display="grid"
                        gridTemplateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }}
                        gap="6"
                        alignItems="start"
                    >
                        {/* Chat panel */}
                        <Card.Root
                            gridColumn={{ lg: 'span 2' }}
                            overflow="hidden"
                            borderColor="border"
                            boxShadow="sm"
                        >
                            <Card.Body p="0" display="flex" flexDirection="column">
                                <ScrollArea.Root height="480px" size="xs">
                                    <ScrollArea.Viewport>
                                        <ScrollArea.Content p="4">
                                            {messages.length === 0 ? (
                                                <Flex
                                                    direction="column"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    minH="380px"
                                                    textAlign="center"
                                                    gap="4"
                                                >
                                                    <Flex
                                                        h="16"
                                                        w="16"
                                                        borderRadius="2xl"
                                                        bg="kosmo.muted"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <Icon as={Sparkles} boxSize="8" color="kosmo.solid" />
                                                    </Flex>
                                                    <Box>
                                                        <Text fontSize="sm" fontWeight="semibold" color="fg">
                                                            Hola, soy Kosmo
                                                        </Text>
                                                        <Text fontSize="xs" color="fg.muted" mt="1" maxW="xs">
                                                            ¿En qué te puedo ayudar hoy? Puedo resumir sesiones, sugerir intervenciones o recordarte el estado de tus pacientes.
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                            ) : (
                                                <Stack gap="4">
                                                    {messages.map((msg, i) => {
                                                        const isKosmo = msg.role === 'kosmo';
                                                        return (
                                                            <Flex
                                                                key={i}
                                                                gap="2.5"
                                                                flexDirection={isKosmo ? 'row' : 'row-reverse'}
                                                            >
                                                                {/* Avatar indicator */}
                                                                <Flex
                                                                    h="8"
                                                                    w="8"
                                                                    borderRadius="full"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    flexShrink={0}
                                                                    fontSize="xs"
                                                                    fontWeight="semibold"
                                                                    bg={isKosmo ? 'kosmo.muted' : 'kosmo.solid'}
                                                                    color={isKosmo ? 'kosmo.solid' : 'kosmo.contrast'}
                                                                >
                                                                    {isKosmo
                                                                        ? <Icon as={Sparkles} boxSize="3.5" />
                                                                        : 'Tú'
                                                                    }
                                                                </Flex>

                                                                {/* Bubble */}
                                                                <Box
                                                                    maxW="78%"
                                                                    borderRadius="xl"
                                                                    px="3.5"
                                                                    py="2.5"
                                                                    fontSize="sm"
                                                                    bg={isKosmo ? 'bg.surface' : 'kosmo.solid'}
                                                                    color={isKosmo ? 'fg' : 'kosmo.contrast'}
                                                                    borderWidth={isKosmo ? '1px' : '0'}
                                                                    borderColor={isKosmo ? 'border' : undefined}
                                                                    boxShadow="sm"
                                                                >
                                                                    <Text whiteSpace="pre-wrap" lineHeight="1.65">
                                                                        {msg.content}
                                                                    </Text>
                                                                    <Text
                                                                        fontSize="xs"
                                                                        mt="1.5"
                                                                        color={isKosmo ? 'fg.subtle' : 'whiteAlpha.700'}
                                                                        textAlign={isKosmo ? 'start' : 'end'}
                                                                    >
                                                                        {formatTime(msg.timestamp)}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>
                                                        );
                                                    })}

                                                    {/* Typing indicator */}
                                                    {loading && (
                                                        <Flex gap="2.5">
                                                            <Flex
                                                                h="8"
                                                                w="8"
                                                                borderRadius="full"
                                                                bg="kosmo.muted"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                                flexShrink={0}
                                                            >
                                                                <Icon
                                                                    as={Sparkles}
                                                                    boxSize="3.5"
                                                                    color="kosmo.solid"
                                                                    animation="pulse 1.5s ease-in-out infinite"
                                                                />
                                                            </Flex>
                                                            <Box
                                                                bg="bg.surface"
                                                                borderWidth="1px"
                                                                borderColor="border"
                                                                borderRadius="xl"
                                                                px="3.5"
                                                                py="3"
                                                                boxShadow="sm"
                                                            >
                                                                <HStack gap="1">
                                                                    <Box as="span" h="2" w="2" borderRadius="full" bg="kosmo.solid" animation="bounce 1s infinite" style={{ animationDelay: '0ms' }} />
                                                                    <Box as="span" h="2" w="2" borderRadius="full" bg="kosmo.solid" animation="bounce 1s infinite" style={{ animationDelay: '150ms' }} />
                                                                    <Box as="span" h="2" w="2" borderRadius="full" bg="kosmo.solid" animation="bounce 1s infinite" style={{ animationDelay: '300ms' }} />
                                                                </HStack>
                                                            </Box>
                                                        </Flex>
                                                    )}

                                                    <div ref={messagesEndRef} />
                                                </Stack>
                                            )}
                                        </ScrollArea.Content>
                                    </ScrollArea.Viewport>
                                    <ScrollArea.Scrollbar>
                                        <ScrollArea.Thumb />
                                    </ScrollArea.Scrollbar>
                                </ScrollArea.Root>
                            </Card.Body>

                            <Card.Footer p="3" borderTopWidth="1px" borderColor="border.subtle" bg="bg.muted">
                                <HStack gap="2" w="full">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                        placeholder="Pregúntale a Kosmo…"
                                        size="md"
                                        bg="bg.surface"
                                        borderColor="border"
                                        _focusVisible={{
                                            outline: 'none',
                                            borderColor: 'kosmo.solid',
                                            boxShadow: '0 0 0 3px var(--ck-colors-kosmo-muted)',
                                        }}
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={sendMessage}
                                        disabled={!input.trim() || loading}
                                        h="10"
                                        w="10"
                                        p="0"
                                        flexShrink={0}
                                    >
                                        <Send size={16} />
                                    </Button>
                                </HStack>
                            </Card.Footer>
                        </Card.Root>

                        {/* Briefings panel */}
                        <Stack gap="3">
                            <Heading as="h3" fontSize="lg" color="fg" fontWeight="semibold">
                                Briefings pendientes
                            </Heading>
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
                </Stack>
            </Container>
        </>
    );
}

KosmoPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
