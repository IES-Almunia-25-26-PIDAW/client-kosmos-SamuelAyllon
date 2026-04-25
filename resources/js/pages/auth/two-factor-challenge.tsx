import { Box, Button as ChakraButton, Flex, Stack, Text } from '@chakra-ui/react';
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';

const layoutTitle = 'Código de autenticación';
const layoutDescription = 'Introduce el código de 6 dígitos de tu aplicación de autenticación.';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
        icon: typeof ShieldCheck;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Código de recuperación',
                description:
                    'Introduce uno de tus códigos de recuperación de emergencia para acceder a tu cuenta.',
                toggleText: 'usar código de autenticación',
                icon: KeyRound,
            };
        }

        return {
            title: 'Código de autenticación',
            description:
                'Introduce el código de 6 dígitos de tu aplicación de autenticación.',
            toggleText: 'usar código de recuperación',
            icon: ShieldCheck,
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    const IconComponent = authConfigContent.icon;

    return (
        <>
            <Head title="Autenticación en dos pasos" />

            <Flex justifyContent="center" mb="6">
                <Flex h="16" w="16" borderRadius="2xl" bg="brand.subtle" alignItems="center" justifyContent="center">
                    <Box as={IconComponent} h="8" w="8" color="brand.solid" />
                </Flex>
            </Flex>

            <Stack gap="6">
                <Form
                    action={store.url()}
                    method="post"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <Stack gap="2">
                                    <Box position="relative">
                                        <Box as={KeyRound} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
                                        <Input
                                            name="recovery_code"
                                            type="text"
                                            placeholder="XXXX-XXXX-XXXX"
                                            autoFocus={showRecoveryInput}
                                            required
                                            style={{ paddingLeft: '2.5rem', fontFamily: 'var(--font-mono)', textAlign: 'center', letterSpacing: '0.05em' }}
                                        />
                                    </Box>
                                    <InputError message={errors.recovery_code} />
                                </Stack>
                            ) : (
                                <Flex direction="column" alignItems="center" justifyContent="center" gap="3" textAlign="center">
                                    <Flex w="full" alignItems="center" justifyContent="center">
                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(value) => setCode(value)}
                                            disabled={processing}
                                            pattern={REGEXP_ONLY_DIGITS}
                                        >
                                            <InputOTPGroup>
                                                {Array.from(
                                                    { length: OTP_MAX_LENGTH },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </Flex>
                                    <InputError message={errors.code} />
                                </Flex>
                            )}

                            <Button
                                type="submit"
                                w="full"
                                h="11"
                                fontSize="md"
                                fontWeight="semibold"
                                borderRadius="xl"
                                disabled={processing}
                            >
                                {processing ? <Spinner /> : <Box as={ArrowRight} h="4" w="4" mr="2" />}
                                Continuar
                            </Button>

                            <Text textAlign="center" fontSize="sm" color="fg.muted">
                                <Text as="span">O puedes </Text>
                                <ChakraButton
                                    type="button"
                                    variant="plain"
                                    cursor="pointer"
                                    color="brand.solid"
                                    fontWeight="semibold"
                                    textDecoration="underline"
                                    textUnderlineOffset="4px"
                                    p="0"
                                    h="auto"
                                    minW="0"
                                    _hover={{ color: 'brand.emphasized' }}
                                    onClick={() => toggleRecoveryMode(clearErrors)}
                                >
                                    {authConfigContent.toggleText}
                                </ChakraButton>
                            </Text>
                        </>
                    )}
                </Form>
            </Stack>
        </>
    );
}

TwoFactorChallenge.layout = (page: ReactNode) => (
    <AuthLayout title={layoutTitle} description={layoutDescription}>{page}</AuthLayout>
);
