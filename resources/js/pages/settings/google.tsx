import { Badge, Box, Flex, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import GoogleActions from '@/actions/App/Http/Controllers/Settings/Google';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editGoogle } from '@/routes/settings/google';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Conexión con Google', href: editGoogle().url },
];

type FlashProps = { success?: string | null; error?: string | null };
type ErrorBag = { google?: string };

export default function GoogleSettings({ connected }: { connected: boolean }) {
    const { props } = usePage<{ flash: FlashProps; errors: ErrorBag }>();
    const flash = props.flash ?? {};
    const errorMessage = props.errors?.google;

    return (
        <>
            <Head title="Conexión con Google" />

            <Heading as="h1" srOnly>Conexión con Google</Heading>

            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <Flex alignItems="center" gap="2">
                            <Box as={Calendar} h="5" w="5" color="brand.solid" />
                            <CardTitle>
                                <Text as="span" fontSize="md" fontWeight="semibold">Google Calendar</Text>
                            </CardTitle>
                        </Flex>
                        <CardDescription>
                            Conecta tu cuenta Google para sincronizar las citas y, en el caso de los profesionales, generar enlaces de Google Meet automáticamente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Stack gap="6">
                            {flash.success && (
                                <Flex alignItems="center" gap="2" borderRadius="lg" borderWidth="1px" borderColor="success.subtle" bg="success.subtle" p="4" fontSize="sm" color="success.fg">
                                    <Box as={CheckCircle2} h="4" w="4" />
                                    <Text>{flash.success}</Text>
                                </Flex>
                            )}

                            {errorMessage && (
                                <Flex alignItems="center" gap="2" borderRadius="lg" borderWidth="1px" borderColor="danger.subtle" bg="danger.subtle" p="4" fontSize="sm" color="danger.fg">
                                    <Box as={XCircle} h="4" w="4" />
                                    <Text>{errorMessage}</Text>
                                </Flex>
                            )}

                            <Flex alignItems="center" gap="3">
                                <Text fontSize="sm" color="fg.muted">Estado:</Text>
                                {connected ? (
                                    <Badge colorPalette="green" variant="subtle">Conectado</Badge>
                                ) : (
                                    <Badge colorPalette="gray" variant="subtle">No conectado</Badge>
                                )}
                            </Flex>

                            {connected ? (
                                <Form
                                    action={GoogleActions.DisconnectAction.url()}
                                    method="delete"
                                    options={{ preserveScroll: true }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                >
                                    {({ processing }) => (
                                        <Flex alignItems="center" gap="4" borderTopWidth="1px" borderColor="border" pt="6">
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                disabled={processing}
                                                data-test="disconnect-google-button"
                                            >
                                                {processing ? 'Desconectando…' : 'Desconectar de Google'}
                                            </Button>
                                            <Text fontSize="sm" color="fg.muted">
                                                Se revocará el acceso en Google y se eliminará el token guardado.
                                            </Text>
                                        </Flex>
                                    )}
                                </Form>
                            ) : (
                                <Flex alignItems="center" gap="4" borderTopWidth="1px" borderColor="border" pt="6">
                                    <Button asChild data-test="connect-google-button">
                                        <chakra.a href={GoogleActions.RedirectAction.url()} display="inline-flex" alignItems="center" gap="2">
                                            <Box as={Calendar} h="4" w="4" />
                                            Conectar con Google
                                        </chakra.a>
                                    </Button>
                                    <Text fontSize="sm" color="fg.muted">
                                        Te redirigiremos a Google para autorizar el acceso a tu calendario.
                                    </Text>
                                </Flex>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </SettingsLayout>
        </>
    );
}

GoogleSettings.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
