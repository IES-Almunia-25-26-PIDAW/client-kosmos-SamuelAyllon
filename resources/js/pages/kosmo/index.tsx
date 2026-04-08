import { Head, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { KosmoBriefing as KosmoBriefingComponent } from '@/components/kosmo/kosmo-briefing';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
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
            const res = await fetch('/kosmo/chat', {
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
        <AppLayout>
            <Head title="Kosmo — ClientKosmos" />

            <div className="flex flex-col h-full p-6 lg:p-8 gap-6 max-w-4xl">

                {/* Header */}
                <div>
                    <h1 className="text-display-2xl text-[var(--color-text)] flex items-center gap-3">
                        <Sparkles size={28} className="text-[var(--color-kosmo)]" />
                        Kosmo
                    </h1>
                    <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">
                        Tu asistente de psicología clínica. Pregúntame sobre tus pacientes, sesiones o mejores prácticas.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 flex-1">

                    {/* Chat */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="flex-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] overflow-hidden flex flex-col" style={{ minHeight: '400px' }}>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                        <div className="h-16 w-16 rounded-2xl bg-[var(--color-kosmo-surface)] flex items-center justify-center mb-4">
                                            <Sparkles size={32} className="text-[var(--color-kosmo)]" />
                                        </div>
                                        <p className="text-sm font-medium text-[var(--color-text)]">Hola, soy Kosmo</p>
                                        <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-xs">
                                            ¿En qué te puedo ayudar hoy? Puedo resumir sesiones, sugerir intervenciones o recordarte el estado de tus pacientes.
                                        </p>
                                    </div>
                                )}
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                                            msg.role === 'kosmo'
                                                ? 'bg-[var(--color-kosmo-surface)] text-[var(--color-kosmo)]'
                                                : 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]'
                                        }`}>
                                            {msg.role === 'kosmo' ? 'K' : 'Tú'}
                                        </div>
                                        <div className={`max-w-[80%] rounded-[var(--radius-lg)] px-4 py-3 text-sm ${
                                            msg.role === 'kosmo'
                                                ? 'bg-[var(--color-kosmo-surface)] text-[var(--color-text)] border border-[var(--color-kosmo-border)]'
                                                : 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]'
                                        }`}>
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                            <p className={`text-xs mt-1 ${
                                                msg.role === 'kosmo' ? 'text-[var(--color-text-muted)]' : 'text-white/70'
                                            }`}>
                                                {formatTime(msg.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-[var(--color-kosmo-surface)] flex items-center justify-center shrink-0">
                                            <Sparkles size={14} className="text-[var(--color-kosmo)] animate-pulse" />
                                        </div>
                                        <div className="bg-[var(--color-kosmo-surface)] border border-[var(--color-kosmo-border)] rounded-[var(--radius-lg)] px-4 py-3">
                                            <div className="flex gap-1">
                                                <span className="h-2 w-2 rounded-full bg-[var(--color-kosmo)] animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="h-2 w-2 rounded-full bg-[var(--color-kosmo)] animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="h-2 w-2 rounded-full bg-[var(--color-kosmo)] animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)]">
                                <div className="flex gap-2">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                        placeholder="Pregúntale a Kosmo…"
                                        className="flex-1 h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow]"
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={sendMessage}
                                        disabled={!input.trim() || loading}
                                        className="h-10 w-10 p-0"
                                    >
                                        <Send size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Briefings sidebar */}
                    <div className="space-y-4">
                        <h3 className="text-display-lg text-[var(--color-text)]">Briefings pendientes</h3>
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
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            {typeof briefing.content === 'object' && 'summary' in briefing.content
                                                ? String(briefing.content.summary)
                                                : 'Ver detalle'}
                                        </p>
                                    }
                                    onDismiss={() => router.post(`/kosmo/briefings/${briefing.id}/read`)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
