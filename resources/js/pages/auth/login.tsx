import { Box, Button as ChakraButton, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Form, Head } from '@inertiajs/react';
import { AtSign, CheckCircle2, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    return (
        <>
            <Head title="Iniciar sesión" />

            <Heading
                as="h1"
                fontFamily="heading"
                fontWeight="extrabold"
                fontSize="4xl"
                letterSpacing="-0.025em"
                color="fg"
                mb="2"
            >
                ClientKosmos
            </Heading>

            {status && (
                <Flex
                    alignItems="center"
                    gap="3"
                    borderRadius="xl"
                    borderWidth="2px"
                    borderColor="success.subtle"
                    bg="success.subtle"
                    px="4"
                    py="3"
                >
                    <Flex h="8" w="8" alignItems="center" justifyContent="center" borderRadius="lg" bg="success.subtle">
                        <Box as={CheckCircle2} h="4" w="4" color="success.fg" />
                    </Flex>
                    <Text fontSize="sm" fontWeight="medium" color="success.fg">{status}</Text>
                </Flex>
            )}

            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password']}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
                {({ processing, errors }) => (
                    <>
                        <Stack gap="6">
                            <Stack gap="2">
                                <Label htmlFor="email">
                                    <Text as="span" fontSize="11px" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" color="fg.muted">
                                        Email
                                    </Text>
                                </Label>
                                <Box position="relative">
                                    <Box as={AtSign} position="absolute" left="4" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" opacity={0.6} zIndex={1} />
                                    <Input
                                        id="email"
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
                                        pl="10"
                                        h="14"
                                    />
                                </Box>
                                <InputError message={errors.email} />
                            </Stack>

                            <Stack gap="2">
                                <Flex alignItems="center" justifyContent="space-between">
                                    <Label htmlFor="password">
                                        <Text as="span" fontSize="11px" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" color="fg.muted">
                                            Contraseña
                                        </Text>
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} tabIndex={5}>
                                            <Text as="span" fontSize="xs" fontWeight="semibold" color="brand.solid">
                                                ¿Has olvidado tu contraseña?
                                            </Text>
                                        </TextLink>
                                    )}
                                </Flex>
                                <Box position="relative">
                                    <Box as={Lock} position="absolute" left="4" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" opacity={0.6} zIndex={1} />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••••"
                                        borderRadius="full"
                                        bg="bg.subtle"
                                        borderWidth="0"
                                        pl="10"
                                        h="14"
                                    />
                                </Box>
                                <InputError message={errors.password} />
                            </Stack>

                            <Flex alignItems="center" gap="3" px="1" py="2">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
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
