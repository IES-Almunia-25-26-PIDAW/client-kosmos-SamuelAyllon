import { ChakraProvider } from '@chakra-ui/react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { system } from '@/lib/chakra-system';

function Providers({ children }: { children: ReactNode }) {
    return <ChakraProvider value={system}>{children}</ChakraProvider>;
}

export function renderWithChakra(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult {
    return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';
