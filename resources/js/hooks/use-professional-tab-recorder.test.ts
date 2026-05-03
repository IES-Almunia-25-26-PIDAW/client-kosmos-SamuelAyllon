import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { axiosPost } = vi.hoisted(() => ({ axiosPost: vi.fn() }));

vi.mock('@/lib/axios', () => ({
    default: { post: axiosPost },
}));

import { useProfessionalTabRecorder } from './use-professional-tab-recorder';

class FakeMediaStreamTrack {
    kind: string;
    stop = vi.fn();
    constructor(kind: string) {
        this.kind = kind;
    }
}

class FakeMediaStream {
    private tracks: FakeMediaStreamTrack[];
    constructor(kinds: string[] = ['audio']) {
        this.tracks = kinds.map((k) => new FakeMediaStreamTrack(k));
    }
    getTracks() {
        return this.tracks;
    }
    getAudioTracks() {
        return this.tracks.filter((t) => t.kind === 'audio');
    }
    getVideoTracks() {
        return this.tracks.filter((t) => t.kind === 'video');
    }
}

const recorderInstances: FakeMediaRecorder[] = [];

class FakeMediaRecorder {
    static isTypeSupported = vi.fn(() => true);
    state: 'inactive' | 'recording' = 'inactive';
    ondataavailable: ((e: { data: Blob }) => void) | null = null;
    onstop: (() => void) | null = null;
    constructor(public stream: FakeMediaStream, public options: { mimeType: string }) {
        recorderInstances.push(this);
    }
    start() {
        this.state = 'recording';
    }
    stop() {
        this.state = 'inactive';
        this.ondataavailable?.({ data: new Blob(['x'], { type: this.options.mimeType }) });
        this.onstop?.();
    }
}

const installMediaRecorder = () => {
    (globalThis as unknown as { MediaRecorder: typeof FakeMediaRecorder }).MediaRecorder =
        FakeMediaRecorder;
};

describe('useProfessionalTabRecorder', () => {
    beforeEach(() => {
        recorderInstances.length = 0;
        axiosPost.mockResolvedValue({ data: {} });
        vi.useFakeTimers({ shouldAdvanceTime: true });
        installMediaRecorder();

        if (!('performance' in globalThis)) {
            (globalThis as unknown as { performance: { now: () => number } }).performance = {
                now: () => Date.now(),
            };
        }
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('[RF-12] starts in idle status with no errors', () => {
        const { result } = renderHook(() => useProfessionalTabRecorder({ appointmentId: 1 }));
        expect(result.current.status).toBe('idle');
        expect(result.current.error).toBeNull();
        expect(result.current.chunksUploaded).toBe(0);
    });

    it('[RF-12] captures tab audio via getDisplayMedia and transitions to recording', async () => {
        const stream = new FakeMediaStream(['audio', 'video']);
        Object.defineProperty(globalThis.navigator, 'mediaDevices', {
            configurable: true,
            value: {
                getDisplayMedia: vi.fn().mockResolvedValue(stream),
                getUserMedia: vi.fn(),
            },
        });

        const { result } = renderHook(() =>
            useProfessionalTabRecorder({ appointmentId: 7, chunkDurationMs: 100 }),
        );

        await act(async () => {
            await result.current.startRecording();
        });

        expect(result.current.status).toBe('recording');
        expect(navigator.mediaDevices.getDisplayMedia).toHaveBeenCalled();
        expect(recorderInstances.length).toBeGreaterThan(0);

        act(() => result.current.stopRecording());
        expect(result.current.status).toBe('idle');
    });

    it('[RF-12] falls back to microphone when display media has no audio track', async () => {
        const displayStream = new FakeMediaStream(['video']); // no audio
        const micStream = new FakeMediaStream(['audio']);
        const getUserMedia = vi.fn().mockResolvedValue(micStream);
        Object.defineProperty(globalThis.navigator, 'mediaDevices', {
            configurable: true,
            value: {
                getDisplayMedia: vi.fn().mockResolvedValue(displayStream),
                getUserMedia,
            },
        });

        const { result } = renderHook(() =>
            useProfessionalTabRecorder({ appointmentId: 9, chunkDurationMs: 100 }),
        );

        await act(async () => {
            await result.current.startRecording();
        });

        expect(getUserMedia).toHaveBeenCalled();
        expect(result.current.status).toBe('recording');
        act(() => result.current.stopRecording());
    });

    it('[RF-12] surfaces error when neither display nor mic permissions are granted', async () => {
        Object.defineProperty(globalThis.navigator, 'mediaDevices', {
            configurable: true,
            value: {
                getDisplayMedia: vi.fn().mockRejectedValue(new Error('cancelled')),
                getUserMedia: vi.fn().mockRejectedValue(new Error('blocked')),
            },
        });

        const { result } = renderHook(() => useProfessionalTabRecorder({ appointmentId: 11 }));

        await act(async () => {
            await result.current.startRecording();
        });

        expect(result.current.status).toBe('error');
        expect(result.current.error).toMatch(/permisos/i);
    });

    it('[RNF-09] uploads a chunk to /appointments/:id/transcribe with FormData metadata', async () => {
        const stream = new FakeMediaStream(['audio']);
        Object.defineProperty(globalThis.navigator, 'mediaDevices', {
            configurable: true,
            value: {
                getDisplayMedia: vi.fn().mockResolvedValue(stream),
                getUserMedia: vi.fn(),
            },
        });

        const { result } = renderHook(() =>
            useProfessionalTabRecorder({ appointmentId: 42, chunkDurationMs: 50 }),
        );

        await act(async () => {
            await result.current.startRecording();
        });

        // Force-stop the active slice so the onstop handler fires upload
        act(() => {
            recorderInstances[0]!.stop();
        });

        await waitFor(() => expect(axiosPost).toHaveBeenCalled());

        const [url, form] = axiosPost.mock.calls[0]!;
        expect(url).toBe('/appointments/42/transcribe');
        expect(form).toBeInstanceOf(FormData);
        const fd = form as FormData;
        expect(fd.get('position')).toBe('0');
        expect(fd.get('chunk')).toBeInstanceOf(Blob);

        act(() => result.current.stopRecording());
    });

    it('[RF-12] stopRecording releases all media stream tracks', async () => {
        const stream = new FakeMediaStream(['audio']);
        Object.defineProperty(globalThis.navigator, 'mediaDevices', {
            configurable: true,
            value: {
                getDisplayMedia: vi.fn().mockResolvedValue(stream),
                getUserMedia: vi.fn(),
            },
        });

        const { result } = renderHook(() => useProfessionalTabRecorder({ appointmentId: 1 }));

        await act(async () => {
            await result.current.startRecording();
        });

        const audioTrack = stream.getAudioTracks()[0]!;
        act(() => result.current.stopRecording());

        expect(audioTrack.stop).toHaveBeenCalled();
        expect(result.current.status).toBe('idle');
    });
});
