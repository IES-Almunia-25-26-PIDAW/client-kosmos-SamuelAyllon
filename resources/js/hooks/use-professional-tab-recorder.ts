import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from '@/lib/axios';

type RecorderStatus = 'idle' | 'permission_pending' | 'recording' | 'error';

interface State {
    status: RecorderStatus;
    error: string | null;
    chunksUploaded: number;
}

interface Options {
    appointmentId: number;
    chunkDurationMs?: number;
}

const CANDIDATES = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
];

const pickMimeType = (): string => {
    if (typeof MediaRecorder === 'undefined') return '';
    return CANDIDATES.find((c) => MediaRecorder.isTypeSupported(c)) ?? '';
};

export function useProfessionalTabRecorder({ appointmentId, chunkDurationMs = 15000 }: Options) {
    const [status, setStatus] = useState<RecorderStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [chunksUploaded, setChunksUploaded] = useState(0);

    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const runningRef = useRef(false);
    const positionRef = useRef(0);
    const startedAtRef = useRef(0);
    const sliceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const recordOneSliceRef = useRef<((stream: MediaStream) => void) | null>(null);
    const mimeType = useMemo(() => pickMimeType(), []);

    const uploadBlob = useCallback(
        async (blob: Blob, position: number, startedAtMs: number, endedAtMs: number) => {
            const form = new FormData();
            form.append('chunk', blob, `chunk-${position}.webm`);
            form.append('position', String(position));
            form.append('started_at_ms', String(startedAtMs));
            form.append('ended_at_ms', String(endedAtMs));
            try {
                await axios.post(`/appointments/${appointmentId}/transcribe`, form);
                setChunksUploaded((n) => n + 1);
            } catch {
                // non-fatal; server logs the error
            }
        },
        [appointmentId],
    );

    const recordOneSlice = useCallback(
        (stream: MediaStream) => {
            if (!runningRef.current) return;

            const recorder = new MediaRecorder(stream, { mimeType });
            recorderRef.current = recorder;

            const sliceStart = performance.now() - startedAtRef.current;
            const position = positionRef.current;
            positionRef.current += 1;

            const parts: Blob[] = [];
            recorder.ondataavailable = (e) => {
                if (e.data?.size > 0) parts.push(e.data);
            };
            recorder.onstop = () => {
                const blob = new Blob(parts, { type: mimeType });
                const sliceEnd = performance.now() - startedAtRef.current;
                if (blob.size > 0) {
                    void uploadBlob(blob, position, Math.round(sliceStart), Math.round(sliceEnd));
                }
                if (runningRef.current) recordOneSliceRef.current?.(stream);
            };

            recorder.start();
            sliceTimeoutRef.current = setTimeout(() => {
                if (recorder.state === 'recording') recorder.stop();
            }, chunkDurationMs);
        },
        [mimeType, chunkDurationMs, uploadBlob],
    );

    useEffect(() => {
        recordOneSliceRef.current = recordOneSlice;
    }, [recordOneSlice]);

    const startRecording = useCallback(async () => {
        if (runningRef.current) return;
        if (!mimeType) {
            setError('Códec de audio no soportado en este navegador.');
            setStatus('error');
            return;
        }

        setStatus('permission_pending');
        setError(null);

        let stream: MediaStream | null = null;

        // Try getDisplayMedia (tab audio) first
        if (typeof navigator.mediaDevices?.getDisplayMedia === 'function') {
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                });
                // Drop video tracks — we only need audio
                displayStream.getVideoTracks().forEach((t) => t.stop());
                if (displayStream.getAudioTracks().length > 0) {
                    stream = displayStream;
                } else {
                    // Browser shared display but without audio (e.g. user didn't tick "share tab audio")
                    displayStream.getTracks().forEach((t) => t.stop());
                }
            } catch {
                // User cancelled or browser doesn't support — fall through to microphone
            }
        }

        // Fallback: capture professional's microphone only
        if (stream === null) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: { echoCancellation: true, noiseSuppression: true },
                });
            } catch {
                setError('No se pudo acceder al audio. Comprueba los permisos del navegador.');
                setStatus('error');
                return;
            }
        }

        streamRef.current = stream;
        runningRef.current = true;
        startedAtRef.current = performance.now();
        positionRef.current = 0;
        setStatus('recording');

        recordOneSlice(stream);
    }, [mimeType, recordOneSlice]);

    const stopRecording = useCallback(() => {
        runningRef.current = false;
        if (sliceTimeoutRef.current) clearTimeout(sliceTimeoutRef.current);
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setStatus('idle');
    }, []);

    return { status, error, chunksUploaded, startRecording, stopRecording } satisfies State & {
        startRecording: () => Promise<void>;
        stopRecording: () => void;
    };
}
