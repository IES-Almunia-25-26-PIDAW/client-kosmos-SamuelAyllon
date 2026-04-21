import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { Form, Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

const layoutTitle = 'Welcome back.';
const layoutDescription = 'Step into your focused workspace.';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Iniciar sesión" />

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
                    mb="6"
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
                        <Stack gap="5">
                            <Stack gap="1.5">
                                <Label htmlFor="email">
                                    <Text as="span" fontSize="11px" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" color="fg.muted">
                                        Email address
                                    </Text>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@ejemplo.com"
                                />
                                <InputError message={errors.email} />
                            </Stack>

                            <Stack gap="1.5">
                                <Flex alignItems="center" justifyContent="space-between">
                                    <Label htmlFor="password">
                                        <Text as="span" fontSize="11px" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" color="fg.muted">
                                            Password
                                        </Text>
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} tabIndex={5}>
                                            <Text as="span" fontSize="xs" color="fg.muted" _hover={{ color: 'fg' }}>
                                                Forgot?
                                            </Text>
                                        </TextLink>
                                    )}
                                </Flex>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••••"
                                />
                                <InputError message={errors.password} />
                            </Stack>

                            <Flex alignItems="center" gap="2.5">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">
                                    <Text as="span" cursor="pointer" fontSize="sm" color="fg.muted">
                                        Keep my session active
                                    </Text>
                                </Label>
                            </Flex>

                            <Button
                                type="submit"
                                mt="1"
                                h="11"
                                w="full"
                                borderRadius="xl"
                                fontSize="sm"
                                fontWeight="semibold"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? <Spinner /> : 'Sign in'}
                            </Button>
                        </Stack>

                        {canRegister && (
                            <Text textAlign="center" fontSize="sm" color="fg.muted">
                                No tienes cuenta?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    <Text as="span" fontWeight="semibold" color="fg" _hover={{ textDecoration: 'underline' }}>
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

Login.layout = (page: ReactNode) => (
    <AuthSplitLayout title={layoutTitle} description={layoutDescription}>{page}</AuthSplitLayout>
);
