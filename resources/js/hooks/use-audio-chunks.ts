import { useEffect, useMemo, useRef, useState } from 'react';
import axios from '@/lib/axios';

interface Options {
    appointmentId: number;
    enabled: boolean;
    chunkDurationMs?: number;
}

interface State {
    recording: boolean;
    error: string | null;
    chunksUploaded: number;
}

const pickMimeType = (): string => {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
    ];
    return candidates.find((c) => MediaRecorder.isTypeSupported(c)) ?? '';
};

const detectInitialError = (): string | null => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        return 'El navegador no soporta captura de audio.';
    }
    if (!pickMimeType()) {
        return 'Códec de audio no soportado.';
    }
    return null;
};

export function useAudioChunks({ appointmentId, enabled, chunkDurationMs = 8000 }: Options): State {
    const initialError = useMemo(() => detectInitialError(), []);
    const mimeType = useMemo(() => pickMimeType(), []);
    const [recording, setRecording] = useState(false);
    const [runtimeError, setRuntimeError] = useState<string | null>(null);
    const [chunksUploaded, setChunksUploaded] = useState(0);

    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const positionRef = useRef<number>(0);
    const startedAtMsRef = useRef<number>(0);
    const runningRef = useRef<boolean>(false);
    const sliceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!enabled || initialError || !mimeType) return;

        let cancelled = false;
        runningRef.current = true;

        const uploadBlob = async (blob: Blob, position: number, startedAtMs: number, endedAtMs: number) => {
            const form = new FormData();
            form.append('chunk', blob, `chunk-${position}.webm`);
            form.append('position', String(position));
            form.append('started_at_ms', String(startedAtMs));
            form.append('ended_at_ms', String(endedAtMs));

            try {
                await axios.post(`/appointments/${appointmentId}/transcribe`, form);
                setChunksUploaded((n) => n + 1);
            } catch (e) {
                console.error('Audio chunk upload failed', e);
            }
        };

        const recordOneSlice = (stream: MediaStream) => {
            if (!runningRef.current || cancelled) return;

            const recorder = new MediaRecorder(stream, { mimeType });
            recorderRef.current = recorder;

            const sliceStartedAt = performance.now() - startedAtMsRef.current;
            const position = positionRef.current;
            positionRef.current += 1;

            const parts: Blob[] = [];
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) parts.push(e.data);
            };
            recorder.onstop = () => {
                const blob = new Blob(parts, { type: mimeType });
                const sliceEndedAt = performance.now() - startedAtMsRef.current;
                if (blob.size > 0) {
                    void uploadBlob(blob, position, Math.round(sliceStartedAt), Math.round(sliceEndedAt));
                }
                if (runningRef.current && !cancelled) {
                    recordOneSlice(stream);
                }
            };

            recorder.start();
            sliceTimeoutRef.current = setTimeout(() => {
                if (recorder.state === 'recording') recorder.stop();
            }, chunkDurationMs);
        };

        navigator.mediaDevices
            .getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
            .then((stream) => {
                if (cancelled) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }
                streamRef.current = stream;
                startedAtMsRef.current = performance.now();
                positionRef.current = 0;
                setRecording(true);
                setRuntimeError(null);
                recordOneSlice(stream);
            })
            .catch((err) => {
                console.error('getUserMedia error', err);
                setRuntimeError('No se pudo acceder al micrófono.');
            });

        return () => {
            cancelled = true;
            runningRef.current = false;
            if (sliceTimeoutRef.current) clearTimeout(sliceTimeoutRef.current);
            if (recorderRef.current && recorderRef.current.state === 'recording') {
                recorderRef.current.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
            setRecording(false);
        };
    }, [appointmentId, enabled, chunkDurationMs, initialError, mimeType]);

    return {
        recording,
        error: initialError ?? runtimeError,
        chunksUploaded,
    };
}
