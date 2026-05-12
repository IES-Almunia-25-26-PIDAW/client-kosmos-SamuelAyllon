import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { Check, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface Rule {
    label: string;
    test: (password: string) => boolean;
}

const rules: Rule[] = [
    { label: 'Al menos 8 caracteres', test: (p) => p.length >= 8 },
    { label: 'Una letra mayúscula', test: (p) => /[A-Z]/.test(p) },
    { label: 'Una letra minúscula', test: (p) => /[a-z]/.test(p) },
    { label: 'Un número', test: (p) => /[0-9]/.test(p) },
    { label: 'Un símbolo (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string): number {
    if (!password) return 0;
    return rules.filter((r) => r.test(password)).length;
}

type Token = string;

const strengthConfig: { label: string; bar: Token; text: Token }[] = [
    { label: '', bar: 'bg.muted', text: 'fg.muted' },
    { label: 'Muy débil', bar: 'danger.solid', text: 'danger.fg' },
    { label: 'Débil', bar: 'orange.solid', text: 'orange.fg' },
    { label: 'Regular', bar: 'warning.solid', text: 'warning.fg' },
    { label: 'Fuerte', bar: 'info.solid', text: 'info.fg' },
    { label: 'Muy fuerte', bar: 'success.solid', text: 'success.fg' },
];

interface PasswordStrengthPopoverProps {
    password: string;
    children: ReactNode;
}

export function PasswordStrengthPopover({ password, children }: PasswordStrengthPopoverProps) {
    const [focused, setFocused] = useState(false);
    const strength = getStrength(password);
    const config = strengthConfig[strength];

    return (
        <Box position="relative">
            <Box
                onFocusCapture={() => setFocused(true)}
                onBlurCapture={() => setFocused(false)}
            >
                {children}
            </Box>

            {focused && (
                <Box
                    position="absolute"
                    top={{ base: 'calc(100% + 8px)', lg: '50%' }}
                    left={{ base: '0', lg: 'calc(100% + 12px)' }}
                    transform={{ base: 'none', lg: 'translateY(-50%)' }}
                    w={{ base: 'full', lg: '210px' }}
                    zIndex={50}
                    p="4"
                    bg="bg.surface"
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="xl"
                    boxShadow="lg"
                    pointerEvents="none"
                >
                    <Stack gap="3">
                        {/* Strength bar — solo si hay texto */}
                        {password && (
                            <Stack gap="1.5">
                                <Flex gap="1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <Box
                                            key={level}
                                            h="1.5"
                                            flex="1"
                                            rounded="full"
                                            transition="all 300ms"
                                            bg={strength >= level ? config.bar : 'bg.muted'}
                                        />
                                    ))}
                                </Flex>
                                {config.label && (
                                    <Text fontSize="xs" fontWeight="semibold" color={config.text}>
                                        {config.label}
                                    </Text>
                                )}
                            </Stack>
                        )}

                        {/* Checklist de requisitos */}
                        <Stack as="ul" gap="1.5" listStyleType="none">
                            {rules.map((rule) => {
                                const passed = password ? rule.test(password) : false;
                                return (
                                    <HStack
                                        as="li"
                                        key={rule.label}
                                        gap="2"
                                        fontSize="xs"
                                        color={passed ? 'success.fg' : 'fg.muted'}
                                        transition="color 200ms"
                                    >
                                        <Box flexShrink={0}>
                                            {passed ? <Check size={12} /> : <X size={12} />}
                                        </Box>
                                        <span>{rule.label}</span>
                                    </HStack>
                                );
                            })}
                        </Stack>
                    </Stack>
                </Box>
            )}
        </Box>
    );
}

export default function PasswordStrength({ password }: { password: string }) {
    if (!password) return null;
    const strength = getStrength(password);
    const config = strengthConfig[strength];

    return (
        <Stack mt="1" gap="1.5">
            <Flex gap="1">
                {[1, 2, 3, 4, 5].map((level) => (
                    <Box
                        key={level}
                        h="1.5"
                        flex="1"
                        rounded="full"
                        transition="all 300ms"
                        bg={strength >= level ? config.bar : 'bg.muted'}
                    />
                ))}
            </Flex>
            {config.label && (
                <Text fontSize="xs" fontWeight="medium" color={config.text}>
                    {config.label}
                </Text>
            )}
        </Stack>
    );
}
