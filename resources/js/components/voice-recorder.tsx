import { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type RecorderState = 'idle' | 'requesting' | 'recording' | 'processing' | 'error';

interface VoiceRecorderProps {
    onTranscription: (text: string) => void;
    disabled?: boolean;
    className?: string;
}

export default function VoiceRecorder({ onTranscription, disabled, className }: VoiceRecorderProps) {
    const [state, setState] = useState<RecorderState>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    async function startRecording() {
        setState('requesting');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach(t => t.stop());
                setState('processing');

                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                const blob = new Blob(chunksRef.current, { type: mimeType });

                const formData = new FormData();
                const ext = mimeType.includes('ogg') ? 'ogg' : 'webm';
                formData.append('audio', blob, `recording.${ext}`);

                const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

                try {
                    const res = await fetch('/voice/transcribe', {
                        method: 'POST',
                        headers: { 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
                        body: formData,
                    });

                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.error ?? 'Error al transcribir.');
                    }

                    const data = await res.json();
                    onTranscription(data.transcription);
                    setState('idle');
                } catch (err: unknown) {
                    setErrorMessage(err instanceof Error ? err.message : 'Error desconocido.');
                    setState('error');
                    setTimeout(() => { setState('idle'); setErrorMessage(null); }, 4000);
                }
            };

            mediaRecorder.start();
            setState('recording');
        } catch {
            setErrorMessage('No se pudo acceder al micrófono.');
            setState('error');
            setTimeout(() => { setState('idle'); setErrorMessage(null); }, 4000);
        }
    }

    function stopRecording() {
        mediaRecorderRef.current?.stop();
    }

    function handleClick() {
        if (state === 'idle') startRecording();
        else if (state === 'recording') stopRecording();
    }

    const isDisabled = disabled || state === 'requesting' || state === 'processing';

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            <Button
                type="button"
                size="sm"
                variant={state === 'recording' ? 'destructive' : 'outline'}
                onClick={handleClick}
                disabled={isDisabled}
                title={state === 'recording' ? 'Detener grabación' : 'Grabar con voz'}
                className={cn(state === 'recording' && 'animate-pulse')}
            >
                {state === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
                {state === 'recording' && <Square className="h-4 w-4" />}
                {(state === 'idle' || state === 'requesting' || state === 'error') && <Mic className="h-4 w-4" />}
                <span className="ml-1">
                    {state === 'idle' && 'Dictar'}
                    {state === 'requesting' && 'Esperando...'}
                    {state === 'recording' && 'Detener'}
                    {state === 'processing' && 'Transcribiendo...'}
                    {state === 'error' && 'Dictar'}
                </span>
            </Button>
            {state === 'error' && errorMessage && (
                <p className="text-xs text-destructive">{errorMessage}</p>
            )}
        </div>
    );
}
