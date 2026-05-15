import { Box, Field, Flex, Grid, Heading, Spinner, Stack, Status, Tabs, Text, chakra } from '@chakra-ui/react';
import { Form, Head, Link, usePage, useForm } from '@inertiajs/react';
import { Building2, CheckCircle2, Mail, Receipt, Settings2, Shield, User } from 'lucide-react';
import type { ReactNode } from 'react';
import ProfileActions from '@/actions/App/Http/Controllers/Settings/Profile';
import SettingsUpdateAction from '@/actions/App/Http/Controllers/Settings/UpdateAction';
import { ActiveConsentsList, type ConsentFormSummary } from '@/components/active-consents-list';
import DeleteUser from '@/components/delete-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth, BreadcrumbItem, User as UserType } from '@/types';

const ChakraLink = chakra(Link);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ajustes de perfil', href: edit().url },
];

export default function Profile({
    mustVerifyEmail,
    status,
    consentForms = [],
    user,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    consentForms?: ConsentFormSummary[];
    user: UserType;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { data, setData, put, processing: settingsProcessing, errors: settingsErrors, recentlySuccessful: settingsSuccess } = useForm({
        practice_name: user.practice_name ?? '',
        specialty: user.specialty ?? '',
        city: user.city ?? '',
        default_rate: user.default_rate ? String(user.default_rate) : '',
        default_session_duration: String(user.default_session_duration ?? 50),
        nif: user.nif ?? '',
        fiscal_address: user.fiscal_address ?? '',
        invoice_prefix: user.invoice_prefix ?? 'FAC',
        invoice_footer_text: user.invoice_footer_text ?? '',
        rgpd_template: user.rgpd_template ?? '',
        data_retention_months: String(user.data_retention_months ?? 60),
        privacy_policy_url: user.privacy_policy_url ?? '',
    });

    const submitSettings = (e: React.FormEvent) => {
        e.preventDefault();
        put(SettingsUpdateAction.url());
    };

    return (
        <>
            <Head title="Ajustes de perfil" />

            <Heading as="h1" srOnly>Ajustes de Perfil</Heading>

            <SettingsLayout>
                {/* Fila principal: perfil + configuración de consulta */}
                <Grid
                    templateColumns={{ base: '1fr', lg: auth.user.role === 'professional' ? '1fr 2fr' : '1fr' }}
                    gap="6"
                    alignItems="start"
                >
                    {/* Información del perfil + Eliminar cuenta */}
                    <Stack gap="6" minW={0}>
                    <Card minW={0}>
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
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <Stack gap="6">
                                        <Field.Root invalid={!!errors.name}>
                                            <Field.Label>
                                                <Flex alignItems="center" gap="1.5">
                                                    <Box as={User} h="3.5" w="3.5" color="fg.muted" />
                                                    Nombre
                                                </Flex>
                                            </Field.Label>
                                            <Input
                                                defaultValue={auth.user.name}
                                                name="name"
                                                required
                                                w="full"
                                                pr="0"
                                                autoComplete="name"
                                                placeholder="Tu nombre completo"
                                            />
                                            {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.email}>
                                            <Field.Label>
                                                <Flex alignItems="center" gap="1.5">
                                                    <Box as={Mail} h="3.5" w="3.5" color="fg.muted" />
                                                    Correo electrónico
                                                </Flex>
                                            </Field.Label>
                                            <Input
                                                type="email"
                                                defaultValue={auth.user.email}
                                                name="email"
                                                required
                                                w="full"
                                                pr="0"
                                                autoComplete="username"
                                                placeholder="tu@email.com"
                                            />
                                            <Flex alignItems="center" gap="1.5">
                                                <Status.Root
                                                    size="sm"
                                                    colorPalette={auth.user.email_verified_at ? 'green' : 'orange'}
                                                >
                                                    <Status.Indicator />
                                                </Status.Root>
                                                <Text
                                                    fontSize="xs"
                                                    color={auth.user.email_verified_at ? 'success.fg' : 'warning.fg'}
                                                >
                                                    {auth.user.email_verified_at ? 'Verificado' : 'Sin verificar'}
                                                </Text>
                                            </Flex>
                                            {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                                        </Field.Root>

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
                                                        <Spinner size="xs" />
                                                        Guardando...
                                                    </Flex>
                                                ) : (
                                                    'Guardar'
                                                )}
                                            </Button>

                                            <Flex
                                                role="status"
                                                aria-live="polite"
                                                alignItems="center"
                                                gap="1.5"
                                                fontSize="sm"
                                                color="success.fg"
                                                opacity={recentlySuccessful ? 1 : 0}
                                                transition="opacity 200ms ease-in-out"
                                                pointerEvents={recentlySuccessful ? 'auto' : 'none'}
                                            >
                                                <Box as={CheckCircle2} h="4" w="4" />
                                                Guardado
                                            </Flex>
                                        </Flex>
                                    </Stack>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <DeleteUser />
                    </Stack>

                    {/* Configuración de consulta */}
                    {auth.user.role === 'professional' && (
                        <Card minW={0}>
                            <CardHeader>
                                <Flex alignItems="center" gap="2">
                                    <Box as={Settings2} h="5" w="5" color="brand.solid" />
                                    <CardTitle>
                                        <Text as="span" fontSize="md" fontWeight="semibold">Configuración de consulta</Text>
                                    </CardTitle>
                                </Flex>
                                <CardDescription>
                                    Personaliza tu consulta y configura la facturación y RGPD
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <chakra.form onSubmit={submitSettings} display="flex" flexDirection="column" gap="6" w="full">
                                    <Tabs.Root defaultValue="consulta" variant="line" colorPalette="brand" w="full">
                                        <Tabs.List borderBottomWidth="1px" borderColor="border">
                                            <Tabs.Trigger value="consulta" gap="1.5" fontSize="sm">
                                                <Box as={Building2} h="3.5" w="3.5" />
                                                Consulta
                                            </Tabs.Trigger>
                                            <Tabs.Trigger value="facturacion" gap="1.5" fontSize="sm">
                                                <Box as={Receipt} h="3.5" w="3.5" />
                                                Facturación
                                            </Tabs.Trigger>
                                            <Tabs.Trigger value="rgpd" gap="1.5" fontSize="sm">
                                                <Box as={Shield} h="3.5" w="3.5" />
                                                RGPD
                                            </Tabs.Trigger>
                                        </Tabs.List>

                                        <Tabs.Content value="consulta" pt="5" px="0">
                                            <Stack gap="4" w="full">
                                                <Field.Root invalid={!!settingsErrors.practice_name} maxW="sm">
                                                    <Field.Label>Nombre de la consulta</Field.Label>
                                                    <Input
                                                        id="practice_name"
                                                        w="full"
                                                        pr="0"
                                                        value={data.practice_name}
                                                        onChange={(e) => setData('practice_name', e.target.value)}
                                                    />
                                                    {settingsErrors.practice_name && (
                                                        <Field.ErrorText>{settingsErrors.practice_name}</Field.ErrorText>
                                                    )}
                                                </Field.Root>

                                                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
                                                    <Field.Root>
                                                        <Field.Label>Especialidad</Field.Label>
                                                        <Input
                                                            id="specialty"
                                                            w="full"
                                                            pr="0"
                                                            value={data.specialty}
                                                            onChange={(e) => setData('specialty', e.target.value)}
                                                            placeholder="Ej: Psicología clínica"
                                                        />
                                                    </Field.Root>
                                                    <Field.Root>
                                                        <Field.Label>Ciudad</Field.Label>
                                                        <Input
                                                            id="city"
                                                            w="full"
                                                            pr="0"
                                                            value={data.city}
                                                            onChange={(e) => setData('city', e.target.value)}
                                                        />
                                                    </Field.Root>
                                                </Grid>

                                                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
                                                    <Field.Root>
                                                        <Field.Label>Tarifa por sesión (€)</Field.Label>
                                                        <Input
                                                            id="default_rate"
                                                            type="number"
                                                            min="0"
                                                            w="full"
                                                            pr="0"
                                                            step="0.01"
                                                            value={data.default_rate}
                                                            onChange={(e) => setData('default_rate', e.target.value)}
                                                            placeholder="60.00"
                                                        />
                                                    </Field.Root>
                                                    <Field.Root>
                                                        <Field.Label>Duración por defecto (min)</Field.Label>
                                                        <Input
                                                            id="default_session_duration"
                                                            type="number"
                                                            w="full"
                                                            pr="0"
                                                            min="1"
                                                            value={data.default_session_duration}
                                                            onChange={(e) => setData('default_session_duration', e.target.value)}
                                                        />
                                                    </Field.Root>
                                                </Grid>
                                            </Stack>
                                        </Tabs.Content>

                                        <Tabs.Content value="facturacion" pt="5" px="0">
                                            <Stack gap="4" w="full">
                                                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
                                                    <Field.Root>
                                                        <Field.Label>NIF/NIE</Field.Label>
                                                        <Input
                                                            id="nif"
                                                            value={data.nif}
                                                            onChange={(e) => setData('nif', e.target.value)}
                                                            w="full"
                                                            pr="0"
                                                        />
                                                        <Field.HelperText>Aparecerá en tus facturas emitidas</Field.HelperText>
                                                    </Field.Root>
                                                    <Field.Root>
                                                        <Field.Label>Prefijo de factura</Field.Label>
                                                        <Input
                                                            id="invoice_prefix"
                                                            value={data.invoice_prefix}
                                                            onChange={(e) => setData('invoice_prefix', e.target.value)}
                                                            placeholder="FAC"
                                                            w="full"
                                                            pr="0"
                                                        />
                                                        <Field.HelperText>
                                                            Vista previa: {data.invoice_prefix || 'FAC'}-2025-001
                                                        </Field.HelperText>
                                                    </Field.Root>
                                                </Grid>

                                                <Field.Root>
                                                    <Field.Label>Dirección fiscal</Field.Label>
                                                    <Textarea
                                                        id="fiscal_address"
                                                        value={data.fiscal_address}
                                                        onChange={(e) => setData('fiscal_address', e.target.value)}
                                                        minH="64px"
                                                        w="full"
                                                        pr="0"
                                                        resize="vertical"
                                                    />
                                                </Field.Root>

                                                <Field.Root>
                                                    <Field.Label>Pie de factura</Field.Label>
                                                    <Textarea
                                                        id="invoice_footer_text"
                                                        value={data.invoice_footer_text}
                                                        onChange={(e) => setData('invoice_footer_text', e.target.value)}
                                                        minH="64px"
                                                        w="full"
                                                        pr="0"
                                                        resize="vertical"
                                                        placeholder="Texto que aparecerá al pie de todas las facturas"
                                                    />
                                                </Field.Root>
                                            </Stack>
                                        </Tabs.Content>

                                        <Tabs.Content value="rgpd" pt="5" px="0">
                                            <Stack gap="4" w="full">
                                                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
                                                    <Field.Root>
                                                        <Field.Label>Retención de datos (meses)</Field.Label>
                                                        <Input
                                                            id="data_retention_months"
                                                            type="number"
                                                            min="1"
                                                            w="full"
                                                            pr="0"
                                                            value={data.data_retention_months}
                                                            onChange={(e) => setData('data_retention_months', e.target.value)}
                                                        />
                                                        <Field.HelperText>Mínimo legal recomendado: 60 meses</Field.HelperText>
                                                    </Field.Root>
                                                    <Field.Root>
                                                        <Field.Label>URL Política de privacidad</Field.Label>
                                                        <Input
                                                            id="privacy_policy_url"
                                                            type="url"
                                                            w="full"
                                                            pr="0"
                                                            value={data.privacy_policy_url}
                                                            onChange={(e) => setData('privacy_policy_url', e.target.value)}
                                                            placeholder="https://…"
                                                        />
                                                    </Field.Root>
                                                </Grid>

                                                <Field.Root>
                                                    <Field.Label>Plantilla de consentimiento RGPD</Field.Label>
                                                    <Textarea
                                                        id="rgpd_template"
                                                        w="full"
                                                        pr="0"
                                                        value={data.rgpd_template}
                                                        onChange={(e) => setData('rgpd_template', e.target.value)}
                                                        minH="120px"
                                                        resize="vertical"
                                                        fontSize="sm"
                                                        placeholder="Texto del consentimiento informado que se mostrará a los pacientes para que firmen"
                                                    />
                                                </Field.Root>
                                            </Stack>
                                        </Tabs.Content>
                                    </Tabs.Root>

                                    <Flex alignItems="center" gap="4" borderTopWidth="1px" borderColor="border" pt="6">
                                        <Button type="submit" disabled={settingsProcessing}>
                                            {settingsProcessing ? (
                                                <Flex alignItems="center" gap="2">
                                                    <Spinner size="xs" />
                                                    Guardando...
                                                </Flex>
                                            ) : (
                                                'Guardar ajustes'
                                            )}
                                        </Button>

                                        <Flex
                                            role="status"
                                            aria-live="polite"
                                            alignItems="center"
                                            gap="1.5"
                                            fontSize="sm"
                                            color="success.fg"
                                            opacity={settingsSuccess ? 1 : 0}
                                            transition="opacity 200ms ease-in-out"
                                            pointerEvents={settingsSuccess ? 'auto' : 'none'}
                                        >
                                            <Box as={CheckCircle2} h="4" w="4" />
                                            Guardado
                                        </Flex>
                                    </Flex>
                                </chakra.form>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                <ActiveConsentsList consentForms={consentForms} />
            </SettingsLayout>
        </>
    );
}

Profile.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
