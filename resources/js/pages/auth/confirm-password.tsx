import { Box, Flex, Stack } from '@chakra-ui/react';
import { Form, Head } from '@inertiajs/react';
import { Lock, ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/ui/icon-input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';

const layoutTitle = 'Confirma tu contraseña';
const layoutDescription = 'Esta es una zona segura. Confirma tu contraseña para continuar.';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirmar contraseña" />

            <Flex justifyContent="center" mb="6">
                <Flex h="16" w="16" borderRadius="2xl" bg="warning.subtle" alignItems="center" justifyContent="center">
                    <Box as={ShieldAlert} h="8" w="8" color="warning.fg" />
                </Flex>
            </Flex>

            <Form action={store.url()} method="post" resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <Stack gap="6">
                        <FormField
                            label="Contraseña"
                            error={errors.password}
                            required
                        >
                            <IconInput
                                icon={Lock}
                                type="password"
                                name="password"
                                placeholder="Tu contraseña actual"
                                autoComplete="current-password"
                                autoFocus
                            />
                        </FormField>

                        <Button
                            type="submit"
                            w="full"
                            h="11"
                            fontSize="md"
                            fontWeight="semibold"
                            borderRadius="xl"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing ? <Spinner /> : <Box as={Lock} h="4" w="4" mr="2" />}
                            Confirmar contraseña
                        </Button>
                    </Stack>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = (page: ReactNode) => (
    <AuthLayout title={layoutTitle} description={layoutDescription}>{page}</AuthLayout>
);
