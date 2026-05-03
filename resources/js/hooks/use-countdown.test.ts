import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCountdown } from './use-countdown';

describe('useCountdown', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-02T10:00:00.000Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('[RF-10] formats remaining time with two-digit padding', () => {
        const target = new Date('2026-05-02T11:02:05.000Z');
        const { result } = renderHook(() => useCountdown(target));

        expect(result.current).toMatchObject({
            hh: '01',
            mm: '02',
            ss: '05',
            isPast: false,
        });
        expect(result.current.totalSeconds).toBe(3725);
    });

    it('[RF-10] returns isPast=true when target is already in the past', () => {
        const target = new Date('2026-05-02T09:00:00.000Z');
        const { result } = renderHook(() => useCountdown(target));

        expect(result.current.isPast).toBe(true);
        expect(result.current.totalSeconds).toBe(0);
        expect(result.current).toMatchObject({ hh: '00', mm: '00', ss: '00' });
    });

    it('[RF-10] decrements every second', () => {
        const target = new Date('2026-05-02T10:00:10.000Z');
        const { result } = renderHook(() => useCountdown(target));

        expect(result.current.totalSeconds).toBe(10);

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(result.current.totalSeconds).toBe(7);
        expect(result.current.ss).toBe('07');
    });

    it('[RF-10] flips to isPast once the target is reached', () => {
        const target = new Date('2026-05-02T10:00:02.000Z');
        const { result } = renderHook(() => useCountdown(target));

        expect(result.current.isPast).toBe(false);

        act(() => {
            vi.advanceTimersByTime(2500);
        });

        expect(result.current.isPast).toBe(true);
        expect(result.current.totalSeconds).toBe(0);
    });

    it('[RF-10] cleans up the interval on unmount', () => {
        const clearSpy = vi.spyOn(globalThis, 'clearInterval');
        const target = new Date('2026-05-02T10:01:00.000Z');
        const { unmount } = renderHook(() => useCountdown(target));

        unmount();

        expect(clearSpy).toHaveBeenCalled();
    });
});
