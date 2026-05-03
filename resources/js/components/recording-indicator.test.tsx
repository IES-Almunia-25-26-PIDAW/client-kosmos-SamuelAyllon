import { describe, expect, it } from 'vitest';
import { renderWithChakra, screen } from '@/test/render';
import { RecordingIndicator } from './recording-indicator';

describe('RecordingIndicator', () => {
    it('[RF-12] renders the "Grabando" label', () => {
        renderWithChakra(<RecordingIndicator />);
        expect(screen.getByText('Grabando')).toBeInTheDocument();
    });

    it('[RF-12] renders an uppercase label for visual prominence', () => {
        renderWithChakra(<RecordingIndicator />);
        const label = screen.getByText('Grabando');
        expect(label).toHaveStyle({ textTransform: 'uppercase' });
    });
});
