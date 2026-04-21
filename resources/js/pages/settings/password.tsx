import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, KeyRound, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import PasswordActions from '@/actions/App/Http/Controllers/Settings/Password';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/user-password';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ajustes de contraseña', href: edit().url },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Ajustes de contraseña" />

            <Heading as="h1" srOnly>Ajustes de Contraseña</Heading>

            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <Flex alignItems="center" gap="2">
                            <Box as={Lock} h="5" w="5" color="brand.solid" />
                            <CardTitle>
                                <Text as="span" fontSize="md" fontWeight="semibold">Actualizar contraseña</Text>
                            </CardTitle>
                        </Flex>
                        <CardDescription>
                            Utiliza una contraseña larga y segura para proteger tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={PasswordActions.UpdateAction.url()}
                            method="put"
                            options={{ preserveScroll: true }}
                            resetOnError={['password', 'password_confirmation', 'current_password']}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }
                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <Stack gap="2">
                                        <Label htmlFor="current_password">
                                            <Flex alignItems="center" gap="2" fontSize="sm" fontWeight="medium">
                                                <Box as={KeyRound} h="4" w="4" color="fg.muted" />
                                                Contraseña actual
                                            </Flex>
                                        </Label>
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Tu contraseña actual"
                                        />
                                        <InputError message={errors.current_password} />
                                    </Stack>

                                    <Stack gap="2">
                                        <Label htmlFor="password">
                                            <Flex alignItems="center" gap="2" fontSize="sm" fontWeight="medium">
                                                <Box as={Lock} h="4" w="4" color="fg.muted" />
                                                Nueva contraseña
                                            </Flex>
                                        </Label>
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Tu nueva contraseña"
                                        />
                                        <InputError message={errors.password} />
                                    </Stack>

                                    <Stack gap="2">
                                        <Label htmlFor="password_confirmation">
                                            <Flex alignItems="center" gap="2" fontSize="sm" fontWeight="medium">
                                                <Box as={Lock} h="4" w="4" color="fg.muted" />
                                                Confirmar contraseña
                                            </Flex>
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Confirma tu nueva contraseña"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </Stack>

                                    <Flex alignItems="center" gap="4" borderTopWidth="1px" borderColor="border" pt="6">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            data-test="update-password-button"
                                            minW="140px"
                                        >
                                            {processing ? (
                                                <Flex alignItems="center" gap="2">
                                                    <Box h="4" w="4" borderRadius="full" borderWidth="2px" borderColor="currentColor" borderTopColor="transparent" css={{ animation: 'spin 1s linear infinite' }} />
                                                    Guardando...
                                                </Flex>
                                            ) : (
                                                'Guardar contraseña'
                                            )}
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <Flex alignItems="center" gap="1.5" fontSize="sm" color="success.fg">
                                                <Box as={CheckCircle2} h="4" w="4" />
                                                Guardado
                                            </Flex>
                                        </Transition>
                                    </Flex>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </SettingsLayout>
        </>
    );
}

Password.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
