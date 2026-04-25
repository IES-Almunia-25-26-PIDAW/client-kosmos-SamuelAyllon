import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { Check, X } from 'lucide-react';

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

interface PasswordStrengthProps {
    password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null;

    const strength = getStrength(password);
    const config = strengthConfig[strength];

    return (
        <Stack mt="2" gap="2">
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

            <Stack as="ul" gap="1" listStyleType="none">
                {rules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                        <HStack
                            as="li"
                            key={rule.label}
                            gap="1.5"
                            fontSize="xs"
                            color={passed ? 'success.fg' : 'fg.muted'}
                        >
                            {passed ? (
                                <Check size={12} style={{ flexShrink: 0 }} />
                            ) : (
                                <X size={12} style={{ flexShrink: 0 }} />
                            )}
                            <span>{rule.label}</span>
                        </HStack>
                    );
                })}
            </Stack>
        </Stack>
    );
}
