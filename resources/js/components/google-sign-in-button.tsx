import { Button } from '@chakra-ui/react';
import type { ComponentProps } from 'react';
import { redirect as googleRedirect } from '@/routes/auth/google';

type Props = {
    intent: 'login' | 'register';
    role?: 'professional' | 'patient';
    label?: string;
} & Omit<ComponentProps<typeof Button>, 'asChild' | 'children'>;

export function GoogleSignInButton({ intent, role, label, ...rest }: Props) {
    const query: Record<string, string> = { intent };
    if (role) {
        query.type = role;
    }
    const href = googleRedirect.url({ query });

    return (
        <Button
            asChild
            variant="outline"
            h="14"
            w="full"
            borderRadius="full"
            borderWidth="2px"
            borderColor="border"
            color="fg"
            bg="bg"
            fontWeight="semibold"
            gap="3"
            _hover={{ bg: 'bg.subtle', borderColor: 'border.emphasized' }}
            {...rest}
        >
            <a href={href}>
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden focusable="false">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 0-24c3.1 0 6 1.2 8.1 3.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 6 1.2 8.1 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
                    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.3A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3C41 35.6 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5z" />
                </svg>
                {label ?? 'Continuar con Google'}
            </a>
        </Button>
    );
}
