import { Box, Flex, Stack } from '@chakra-ui/react';
import { Form, Head } from '@inertiajs/react';
import { KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/ui/icon-input';
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
                        <FormField
                            label="Correo electrónico"
                            error={errors.email}
                        >
                            <IconInput
                                icon={Mail}
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                readOnly
                            />
                        </FormField>

                        <FormField
                            label="Nueva contraseña"
                            error={errors.password}
                            required
                        >
                            <IconInput
                                icon={Lock}
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="Mínimo 8 caracteres"
                            />
                        </FormField>

                        <FormField
                            label="Confirmar contraseña"
                            error={errors.password_confirmation}
                            required
                        >
                            <IconInput
                                icon={KeyRound}
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Repite tu contraseña"
                            />
                        </FormField>

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
