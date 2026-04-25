import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, LoaderCircle, Mail } from 'lucide-react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

const layoutTitle = '¿Olvidaste tu contraseña?';
const layoutDescription = 'Introduce tu email para recibir un enlace de recuperación';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Recuperar contraseña" />

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

            <Stack gap="6">
                <Form action={email.url()} method="post">
                    {({ processing, errors }) => (
                        <>
                            <Stack gap="2">
                                <Label htmlFor="email">
                                    <Text as="span" fontSize="sm" fontWeight="semibold">Correo electrónico</Text>
                                </Label>
                                <Box position="relative">
                                    <Box as={Mail} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="email@ejemplo.com"
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </Box>

                                <InputError message={errors.email} />
                            </Stack>

                            <Flex my="6" alignItems="center" justifyContent="flex-start">
                                <Button
                                    type="submit"
                                    w="full"
                                    h="11"
                                    fontSize="md"
                                    fontWeight="semibold"
                                    borderRadius="xl"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <Box as={LoaderCircle} h="4" w="4" mr="2" css={{ animation: 'spin 1s linear infinite' }} />
                                    ) : (
                                        <Box as={Mail} h="4" w="4" mr="2" />
                                    )}
                                    Enviar enlace de recuperación
                                </Button>
                            </Flex>
                        </>
                    )}
                </Form>

                <Flex alignItems="center" justifyContent="center" gap="2" fontSize="sm" color="fg.muted">
                    <Box as={ArrowLeft} h="4" w="4" />
                    <Text as="span">Volver a</Text>
                    <TextLink href={login()}>
                        <Text as="span" color="brand.solid" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
                            iniciar sesión
                        </Text>
                    </TextLink>
                </Flex>
            </Stack>
        </>
    );
}

ForgotPassword.layout = (page: ReactNode) => (
    <AuthLayout title={layoutTitle} description={layoutDescription}>{page}</AuthLayout>
);
