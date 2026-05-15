import { Alert, Button as ChakraButton, Flex, HStack, Heading, Separator, Stack, Text } from '@chakra-ui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import { AtSign } from 'lucide-react';
import type { ReactNode } from 'react';
import { FormField } from '@/components/form-field';
import { GoogleSignInButton } from '@/components/google-sign-in-button';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldLabel } from '@/components/ui/field-label';
import { IconInput } from '@/components/ui/icon-input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    const pageErrors = usePage().props.errors as Record<string, string> | undefined;
    const googleError = pageErrors?.google;

    return (
        <>
            <Head title="Iniciar sesión" />

            <Stack gap="0.5">
                <Heading
                    as="h1"
                    fontFamily="heading"
                    fontWeight="extrabold"
                    fontSize={{ base: '2xl', md: '3xl' }}
                    letterSpacing="-0.025em"
                    color="fg"
                    m="0"
                >
                    Bienvenido de vuelta
                </Heading>
                <Text fontSize="sm" color="fg.muted">
                    Inicia sesión para continuar en ClientKosmos.
                </Text>
            </Stack>

            {status && (
                <Alert.Root status="success" variant="subtle" borderRadius="xl">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title fontSize="sm">{status}</Alert.Title>
                    </Alert.Content>
                </Alert.Root>
            )}

            {googleError && (
                <Alert.Root status="error" variant="subtle" borderRadius="xl">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title fontSize="sm">{googleError}</Alert.Title>
                    </Alert.Content>
                </Alert.Root>
            )}

            <Stack gap="1">
                <GoogleSignInButton intent="login" />
                <HStack>
                    <Separator flex="1" />
                    <Text fontSize="xs" color="fg.muted" px="2">
                        o con tu email
                    </Text>
                    <Separator flex="1" />
                </HStack>
            </Stack>

            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password']}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
                {({ processing, errors }) => (
                    <>
                        <Stack gap="6">
                            <FormField
                                label={<FieldLabel>Email</FieldLabel>}
                                error={errors.email}
                                required
                            >
                                <IconInput
                                    icon={AtSign}
                                    iconLeft="4"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="dr.aris@kosmos.com"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    h="14"
                                />
                            </FormField>

                            <FormField
                                label={<FieldLabel>Contraseña</FieldLabel>}
                                labelAddon={
                                    canResetPassword ? (
                                        <TextLink href={request()} tabIndex={5}>
                                            <Text as="span" fontSize="xs" fontWeight="semibold" color="brand.solid">
                                                ¿Has olvidado tu contraseña?
                                            </Text>
                                        </TextLink>
                                    ) : undefined
                                }
                                error={errors.password}
                                required
                            >
                                <PasswordInput
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••••"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    h="14"
                                />
                            </FormField>

                            <Flex alignItems="center" gap="3" px="1" py="2">
                                <Checkbox id="remember" name="remember" tabIndex={3} color="brand.solid"/>
                                <Label htmlFor="remember">
                                    <Text as="span" cursor="pointer" fontSize="sm" color="fg.muted">
                                        Mantener sesión activa
                                    </Text>
                                </Label>
                            </Flex>

                            <ChakraButton
                                type="submit"
                                w="full"
                                h="14"
                                borderRadius="full"
                                fontSize="lg"
                                fontWeight="bold"
                                tabIndex={4}
                                disabled={processing}
                                color="rgba(255,255,255,0.97)"
                                variant="plain"
                                style={{
                                    background: 'linear-gradient(176.70deg, rgb(95, 207, 192) 58.675%, rgba(0, 97, 86, 0.41) 141.22%)',
                                    boxShadow: '0px 10px 15px -3px rgba(0,97,86,0.1), 0px 4px 6px -4px rgba(0,97,86,0.1)',
                                }}
                                data-test="login-button"
                            >
                                {processing ? <Spinner /> : 'Iniciar sesión'}
                            </ChakraButton>
                        </Stack>

                        {canRegister && (
                            <Text textAlign="center" fontSize="sm" color="fg.muted">
                                ¿No tienes cuenta?{' '}
                                <TextLink href={register()} tabIndex={6}>
                                    <Text as="span" fontWeight="semibold" color="brand.solid">
                                        Regístrate aquí
                                    </Text>
                                </TextLink>
                            </Text>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = (page: ReactNode) => <AuthSplitLayout>{page}</AuthSplitLayout>;
