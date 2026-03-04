import { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AiChatsProps, AiMessage } from '@/types';
import { Send, Trash2, Loader2, Bot, User, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Asistente IA', href: '/ai-chats' },
];

export default function AiChatsIndex({ messages: initialMessages }: AiChatsProps) {
    const [messages, setMessages] = useState<AiMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll al final cuando hay nuevos mensajes
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    // Focus en el textarea al cargar
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        
        const message = input.trim();
        if (!message || isLoading) return;

        setInput('');
        setError(null);
        setIsLoading(true);

        // Mensaje optimista del usuario
        const tempUserMessage: AiMessage = {
            id: Date.now(),
            role: 'user',
            message,
            created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, tempUserMessage]);

        try {
            const response = await axios.post('/ai-chats', { message });
            const data = response.data;

            // Reemplazar mensaje temporal con el real y añadir respuesta
            setMessages(prev => [
                ...prev.slice(0, -1),
                data.user_message,
                data.assistant_message,
            ]);
        } catch (err: unknown) {
            // Quitar mensaje temporal en caso de error
            setMessages(prev => prev.slice(0, -1));
            const e = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
            const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || 'Error desconocido';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            textareaRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleClearHistory = async () => {
        try {
            await axios.delete('/ai-chats');
            setMessages([]);
        } catch {
            setError('Error al limpiar el historial');
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Asistente IA" />

            <div className="flex flex-col h-[calc(100vh-8rem)] p-6">
                <Card className="flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Flowly AI</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Tu asistente de productividad personal
                                </p>
                            </div>
                        </div>
                        {messages.length > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Limpiar
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Limpiar historial?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción eliminará toda la conversación con el asistente. No se puede deshacer.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleClearHistory}>
                                            Eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                        {/* Área de mensajes */}
                        <ScrollArea ref={scrollAreaRef} className="h-0 flex-1 px-6">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                                        <Bot className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">¡Hola! Soy Flowly AI</h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Estoy aquí para ayudarte a organizar tus ideas, priorizar tareas y planificar tu jornada. 
                                        ¿En qué puedo ayudarte hoy?
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-6 justify-center">
                                        {[
                                            '¿Cómo priorizo mis tareas?',
                                            'Ayúdame a organizar mi día',
                                            'Técnicas de productividad',
                                        ].map((suggestion) => (
                                            <Button
                                                key={suggestion}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setInput(suggestion);
                                                    textareaRef.current?.focus();
                                                }}
                                            >
                                                {suggestion}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 py-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                    msg.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                }`}
                                            >
                                                {msg.role === 'user' ? (
                                                    <User className="h-4 w-4" />
                                                ) : (
                                                    <Bot className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div
                                                className={`flex flex-col max-w-[80%] ${
                                                    msg.role === 'user' ? 'items-end' : 'items-start'
                                                }`}
                                            >
                                                <div
                                                    className={`rounded-2xl px-4 py-2 ${
                                                        msg.role === 'user'
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted'
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground mt-1 px-2">
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                            <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-sm text-muted-foreground">Pensando...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Error */}
                        {error && (
                            <div className="px-6 py-2">
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        {/* Input */}
                        <div className="flex-shrink-0 border-t p-4">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <Textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
                                    className="min-h-[44px] max-h-32 resize-none"
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
