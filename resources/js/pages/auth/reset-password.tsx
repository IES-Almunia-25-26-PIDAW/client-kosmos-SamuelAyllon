import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { Form, Head } from '@inertiajs/react';
import { KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';

const layoutTitle = 'Nueva contraseña';
const layoutDescription = 'Introduce tu nueva contraseña para continuar';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Restablecer contraseña" />

            <Flex justifyContent="center" mb="6">
                <Flex h="16" w="16" borderRadius="2xl" bg="brand.subtle" alignItems="center" justifyContent="center">
                    <Box as={ShieldCheck} h="8" w="8" color="brand.solid" />
                </Flex>
            </Flex>

            <Form
                action={update.url()}
                method="post"
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <Stack gap="5">
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
                                    autoComplete="email"
                                    value={email}
                                    readOnly
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </Box>
                            <InputError message={errors.email} />
                        </Stack>

                        <Stack gap="2">
                            <Label htmlFor="password">
                                <Text as="span" fontSize="sm" fontWeight="semibold">Nueva contraseña</Text>
                            </Label>
                            <Box position="relative">
                                <Box as={Lock} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder="Mínimo 8 caracteres"
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </Box>
                            <InputError message={errors.password} />
                        </Stack>

                        <Stack gap="2">
                            <Label htmlFor="password_confirmation">
                                <Text as="span" fontSize="sm" fontWeight="semibold">Confirmar contraseña</Text>
                            </Label>
                            <Box position="relative">
                                <Box as={KeyRound} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    placeholder="Repite tu contraseña"
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </Box>
                            <InputError message={errors.password_confirmation} />
                        </Stack>

                        <Button
                            type="submit"
                            mt="2"
                            w="full"
                            h="11"
                            fontSize="md"
                            fontWeight="semibold"
                            borderRadius="xl"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? <Spinner /> : <Box as={ShieldCheck} h="4" w="4" mr="2" />}
                            Restablecer contraseña
                        </Button>
                    </Stack>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = (page: ReactNode) => (
    <AuthLayout title={layoutTitle} description={layoutDescription}>{page}</AuthLayout>
);
