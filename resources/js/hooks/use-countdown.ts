import { useCallback, useEffect, useState } from 'react';

interface CountdownState {
    hh: string;
    mm: string;
    ss: string;
    isPast: boolean;
    totalSeconds: number;
}

export function useCountdown(target: Date): CountdownState {
    const compute = useCallback((): CountdownState => {
        const diff = Math.floor((target.getTime() - Date.now()) / 1000);
        if (diff <= 0) {
            return { hh: '00', mm: '00', ss: '00', isPast: true, totalSeconds: 0 };
        }
        const hh = Math.floor(diff / 3600);
        const mm = Math.floor((diff % 3600) / 60);
        const ss = diff % 60;
        return {
            hh: String(hh).padStart(2, '0'),
            mm: String(mm).padStart(2, '0'),
            ss: String(ss).padStart(2, '0'),
            isPast: false,
            totalSeconds: diff,
        };
    }, [target]);

    const [state, setState] = useState<CountdownState>(() => compute());

    useEffect(() => {
        if (state.isPast) return;
        const id = setInterval(() => {
            const next = compute();
            setState(next);
            if (next.isPast) clearInterval(id);
        }, 1000);
        return () => clearInterval(id);
    }, [compute, state.isPast]);

    return state;
}
