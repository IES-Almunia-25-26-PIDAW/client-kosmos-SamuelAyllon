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
import { Send, Trash2, Loader2, Bot, User, Sparkles, Zap, Brain, Target, MessageSquare } from 'lucide-react';

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

            <div className="flex flex-col h-[calc(100vh-4rem)] p-6">
                {/* Header con gradiente */}
                <div className="mb-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-2 border-violet-500/20 p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                                <Sparkles className="h-7 w-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                    Flowly AI
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Tu asistente de productividad personal con IA
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-medium text-violet-700 dark:text-violet-300">Online</span>
                            </div>
                            {messages.length > 0 && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="border-2 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-600 transition-all">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Limpiar
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Limpiar historial?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción eliminará toda la conversación con el asistente. No se puede deshacer.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleClearHistory} className="rounded-xl bg-red-500 hover:bg-red-600">
                                                Eliminar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        </div>
                    </div>
                </div>

                {/* Chat Card */}
                <Card className="flex flex-col flex-1 overflow-hidden border-2 rounded-2xl shadow-lg">
                    <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                        {/* Área de mensajes */}
                        <ScrollArea ref={scrollAreaRef} className="h-0 flex-1 px-6">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                                    <div className="relative mb-6">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-2 border-violet-500/30">
                                            <Bot className="h-10 w-10 text-violet-600" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                            <Sparkles className="h-3 w-3 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">¡Hola! Soy Flowly AI</h3>
                                    <p className="text-muted-foreground max-w-md mb-8">
                                        Estoy aquí para ayudarte a organizar tus ideas, priorizar tareas y planificar tu jornada. 
                                        ¿En qué puedo ayudarte hoy?
                                    </p>
                                    
                                    {/* Sugerencias */}
                                    <div className="grid gap-3 w-full max-w-lg">
                                        {[
                                            { text: '¿Cómo priorizo mis tareas?', icon: Target },
                                            { text: 'Ayúdame a organizar mi día', icon: Zap },
                                            { text: 'Técnicas de productividad', icon: Brain },
                                        ].map(({ text, icon: Icon }) => (
                                            <button
                                                key={text}
                                                onClick={() => {
                                                    setInput(text);
                                                    textareaRef.current?.focus();
                                                }}
                                                className="group flex items-center gap-3 w-full p-4 rounded-xl border-2 border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all text-left"
                                            >
                                                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                                                    <Icon className="h-5 w-5 text-violet-600" />
                                                </div>
                                                <span className="font-medium text-violet-700 dark:text-violet-300">{text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 py-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                        >
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                                                    msg.role === 'user'
                                                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                                                        : 'bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30'
                                                }`}
                                            >
                                                {msg.role === 'user' ? (
                                                    <User className="h-4 w-4" />
                                                ) : (
                                                    <Bot className="h-4 w-4 text-violet-600" />
                                                )}
                                            </div>
                                            <div
                                                className={`flex flex-col max-w-[80%] ${
                                                    msg.role === 'user' ? 'items-end' : 'items-start'
                                                }`}
                                            >
                                                <div
                                                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                                                        msg.role === 'user'
                                                            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm'
                                                            : 'bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-tl-sm'
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground mt-1.5 px-2 flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" />
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                                                <Bot className="h-4 w-4 text-violet-600" />
                                            </div>
                                            <div className="flex items-center gap-3 rounded-2xl rounded-tl-sm bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 px-4 py-3">
                                                <div className="flex gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0ms]" />
                                                    <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:150ms]" />
                                                    <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:300ms]" />
                                                </div>
                                                <span className="text-sm text-violet-600 dark:text-violet-400 font-medium">Pensando...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Error */}
                        {error && (
                            <div className="mx-6 my-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Input */}
                        <div className="flex-shrink-0 border-t-2 p-4 bg-muted/30">
                            <form onSubmit={handleSubmit} className="flex gap-3">
                                <div className="relative flex-1">
                                    <Textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Escribe tu mensaje... (Enter para enviar)"
                                        className="min-h-[52px] max-h-32 resize-none pr-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                                        rows={1}
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    disabled={!input.trim() || isLoading}
                                    className="h-[52px] w-[52px] rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40 disabled:opacity-50 disabled:shadow-none"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </Button>
                            </form>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Flowly puede cometer fallos, revisa bien sus respuestas
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
