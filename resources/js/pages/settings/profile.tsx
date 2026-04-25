import { Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Mail, User } from 'lucide-react';
import type { ReactNode } from 'react';
import ProfileActions from '@/actions/App/Http/Controllers/Settings/Profile';
import { ActiveConsentsList, type ConsentFormSummary } from '@/components/active-consents-list';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth, BreadcrumbItem } from '@/types';

const ChakraLink = chakra(Link);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ajustes de perfil', href: edit().url },
];

export default function Profile({
    mustVerifyEmail,
    status,
    consentForms = [],
}: {
    mustVerifyEmail: boolean;
    status?: string;
    consentForms?: ConsentFormSummary[];
}) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Ajustes de perfil" />

            <Heading as="h1" srOnly>Ajustes de Perfil</Heading>

            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <Flex alignItems="center" gap="2">
                            <Box as={User} h="5" w="5" color="brand.solid" />
                            <CardTitle>
                                <Text as="span" fontSize="md" fontWeight="semibold">Información del perfil</Text>
                            </CardTitle>
                        </Flex>
                        <CardDescription>
                            Actualiza tu nombre y dirección de correo electrónico
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={ProfileActions.UpdateAction.url()}
                            method="patch"
                            options={{ preserveScroll: true }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <Stack gap="2">
                                        <Label htmlFor="name">
                                            <Flex alignItems="center" gap="2" fontSize="sm" fontWeight="medium">
                                                <Box as={User} h="4" w="4" color="fg.muted" />
                                                Nombre
                                            </Flex>
                                        </Label>
                                        <Input
                                            id="name"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Tu nombre completo"
                                        />
                                        <InputError message={errors.name} />
                                    </Stack>

                                    <Stack gap="2">
                                        <Label htmlFor="email">
                                            <Flex alignItems="center" gap="2" fontSize="sm" fontWeight="medium">
                                                <Box as={Mail} h="4" w="4" color="fg.muted" />
                                                Correo electrónico
                                            </Flex>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="tu@email.com"
                                        />
                                        <InputError message={errors.email} />
                                    </Stack>

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <Box
                                            borderRadius="lg"
                                            borderWidth="1px"
                                            borderColor="warning.subtle"
                                            bg="warning.subtle"
                                            p="4"
                                        >
                                            <Text fontSize="sm" color="warning.fg">
                                                Tu correo electrónico no está verificado.{' '}
                                                <ChakraLink
                                                    href={send()}
                                                    as="button"
                                                    fontWeight="medium"
                                                    textDecoration="underline"
                                                    textUnderlineOffset="4px"
                                                    _hover={{ color: 'warning.solid' }}
                                                >
                                                    Haz clic aquí para reenviar el correo de verificación.
                                                </ChakraLink>
                                            </Text>

                                            {status === 'verification-link-sent' && (
                                                <Flex mt="2" alignItems="center" gap="2" fontSize="sm" fontWeight="medium" color="success.fg">
                                                    <Box as={CheckCircle2} h="4" w="4" />
                                                    Se ha enviado un nuevo enlace de verificación.
                                                </Flex>
                                            )}
                                        </Box>
                                    )}

                                    <Flex alignItems="center" gap="4" borderTopWidth="1px" borderColor="border" pt="6">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            data-test="update-profile-button"
                                            minW="100px"
                                        >
                                            {processing ? (
                                                <Flex alignItems="center" gap="2">
                                                    <Box h="4" w="4" borderRadius="full" borderWidth="2px" borderColor="currentColor" borderTopColor="transparent" css={{ animation: 'spin 1s linear infinite' }} />
                                                    Guardando...
                                                </Flex>
                                            ) : (
                                                'Guardar'
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

                <ActiveConsentsList consentForms={consentForms} />

                <DeleteUser />
            </SettingsLayout>
        </>
    );
}

Profile.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
