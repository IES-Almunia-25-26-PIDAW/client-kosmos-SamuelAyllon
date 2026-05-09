import { fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { axiosPost, routerVisit, routerReload } = vi.hoisted(() => ({
    axiosPost: vi.fn(),
    routerVisit: vi.fn(),
    routerReload: vi.fn(),
}));

vi.mock('@/lib/axios', () => ({
    default: { post: axiosPost, isAxiosError: vi.fn().mockReturnValue(false) },
}));

vi.mock('@inertiajs/react', () => ({
    router: {
        visit: routerVisit,
        reload: routerReload,
    },
}));

vi.mock('@/actions/App/Http/Controllers/Appointment/StartCallAction', () => ({
    default: { url: (id: number) => `/appointments/${id}/start-call` },
}));

vi.mock('@/actions/App/Http/Controllers/Portal/Appointment/JoinCallAction', () => ({
    default: { url: (id: number) => `/portal/appointments/${id}/join-call` },
}));

import { renderWithChakra, screen } from '@/test/render';
import { JoinCallButton } from './join-call-button';

const buildAppointment = (overrides: Partial<Parameters<typeof JoinCallButton>[0]['appointment']> = {}) => ({
    id: 42,
    starts_at: '2026-05-02T10:30:00.000Z',
    ends_at: '2026-05-02T11:00:00.000Z',
    meeting_url: null,
    meeting_room_id: null,
    professional_joined_at: null,
    ...overrides,
});

describe('JoinCallButton', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        window.open = vi.fn();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('[RF-09] shows the countdown disabled before the join window opens', () => {
        // 30 min before start → 20 min before opensAt (opensAt = start - 10 min)
        vi.setSystemTime(new Date('2026-05-02T10:00:00.000Z'));
        renderWithChakra(<JoinCallButton appointment={buildAppointment()} role="professional" />);

        expect(screen.getByRole('button', { name: /Disponible en/ })).toBeDisabled();
    });

    it('[RF-09] shows the finalised message after the grace window expires', () => {
        // ends_at + 15 min grace passed
        vi.setSystemTime(new Date('2026-05-02T11:30:00.000Z'));
        renderWithChakra(<JoinCallButton appointment={buildAppointment()} role="professional" />);

        expect(screen.getByText('La sesión ya ha finalizado.')).toBeInTheDocument();
    });

    it('[RF-09] calls StartCallAction and navigates the professional to the room', async () => {
        // Inside join window
        vi.setSystemTime(new Date('2026-05-02T10:25:00.000Z'));
        axiosPost.mockResolvedValueOnce({
            data: { room_id: 'room-xyz', meeting_url: 'https://meet.example/xyz' },
        });

        renderWithChakra(<JoinCallButton appointment={buildAppointment()} role="professional" />);
        fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

        await vi.waitFor(() => expect(routerVisit).toHaveBeenCalledWith('/call/room-xyz'));

        expect(axiosPost).toHaveBeenCalledWith('/appointments/42/start-call');
        expect(window.open).not.toHaveBeenCalled();
    });

    it('[RF-09] calls JoinCallAction for the patient and reloads if no room is provisioned yet', async () => {
        vi.setSystemTime(new Date('2026-05-02T10:25:00.000Z'));
        axiosPost.mockResolvedValueOnce({ data: {} });

        renderWithChakra(<JoinCallButton appointment={buildAppointment()} role="patient" />);
        fireEvent.click(screen.getByRole('button', { name: 'Unirse a la llamada' }));

        await vi.waitFor(() =>
            expect(routerReload).toHaveBeenCalledWith({ only: ['appointment'] }),
        );
        expect(axiosPost).toHaveBeenCalledWith('/portal/appointments/42/join-call');
        expect(routerVisit).not.toHaveBeenCalled();
    });

    it('[RF-09] surfaces a friendly error message when the API call fails', async () => {
        vi.setSystemTime(new Date('2026-05-02T10:25:00.000Z'));
        axiosPost.mockRejectedValueOnce(new Error('Network down'));

        renderWithChakra(<JoinCallButton appointment={buildAppointment()} role="professional" />);
        fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

        expect(await screen.findByText('Network down')).toBeInTheDocument();
    });
});
