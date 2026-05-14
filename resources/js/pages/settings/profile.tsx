import { Box, Flex, Grid, Heading, Stack, Text, Textarea as ChakraTextarea, chakra } from '@chakra-ui/react';
import { Form, Head, Link, usePage, useForm } from '@inertiajs/react';
import { CheckCircle2, Mail, User } from 'lucide-react';
import type { ReactNode } from 'react';
import ProfileActions from '@/actions/App/Http/Controllers/Settings/Profile';
import SettingsUpdateAction from '@/actions/App/Http/Controllers/Settings/UpdateAction';
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
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Flex alignItems="center" gap="2">
                            <Box as={User} h="5" w="5" color="brand.solid" />
                            <CardTitle>
                                <Text as="span" fontSize="md" fontWeight="semibold">Configuración de consulta</Text>
                            </CardTitle>
                        </Flex>
                        <CardDescription>
                            Personaliza tu consulta y configura la facturación y RGPD
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Stack gap="5" borderRadius="lg" borderWidth="1px" borderColor="border" bg="bg.surface" p="6" boxShadow="sm">
                                <Heading as="h3" fontSize="sm" fontWeight="semibold" color="fg">
                                    Datos de la consulta
                                </Heading>

                                <Stack gap="1.5">
                                    <Label htmlFor="practice_name">
                                        <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Nombre de la consulta</Text>
                                    </Label>
                                    <Input id="practice_name" value={data.practice_name} onChange={(e) => setData('practice_name', e.target.value)} />
                                    {settingsErrors.practice_name && <Text fontSize="xs" color="danger.fg">{settingsErrors.practice_name}</Text>}
                                </Stack>

                                <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                                    <Stack gap="1.5">
                                        <Label htmlFor="specialty">
                                            <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Especialidad</Text>
                                        </Label>
                                        <Input id="specialty" value={data.specialty} onChange={(e) => setData('specialty', e.target.value)} placeholder="Ej: Psicología clínica" />
                                    </Stack>
                                    <Stack gap="1.5">
                                        <Label htmlFor="city">
                                            <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Ciudad</Text>
                                        </Label>
                                        <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                                    </Stack>
                                </Grid>

                                <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                                    <Stack gap="1.5">
                                        <Label htmlFor="default_rate">
                                            <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Tarifa por sesión (€)</Text>
                                        </Label>
                                        <Input id="default_rate" type="number" min="0" step="0.01" value={data.default_rate} onChange={(e) => setData('default_rate', e.target.value)} placeholder="60.00" />
                                    </Stack>
                                    <Stack gap="1.5">
                                        <Label htmlFor="default_session_duration">
                                            <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Duración por defecto (min)</Text>
                                        </Label>
                                        <Input id="default_session_duration" type="number" min="1" value={data.default_session_duration} onChange={(e) => setData('default_session_duration', e.target.value)} />
                                    </Stack>
                                </Grid>
                            </Stack>

                            <Stack gap="5" borderRadius="lg" borderWidth="1px" borderColor="border" bg="bg.surface" p="6" boxShadow="sm">
                                <Heading as="h3" fontSize="sm" fontWeight="semibold" color="fg">
                                    Facturación
                                </Heading>

                                <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                                    <Stack gap="1.5">
                                        <Label htmlFor="nif">
                                            <Text as="span" fontSize="sm" fontWeight="medium" color="fg">NIF/NIE</Text>
                                        </Label>
                                        <Input id="nif" value={data.nif} onChange={(e) => setData('nif', e.target.value)} />
                                    </Stack>
                                    <Stack gap="1.5">
                                        <Label htmlFor="invoice_prefix">
                                            <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Prefijo de factura</Text>
                                        </Label>
                                        <Input id="invoice_prefix" value={data.invoice_prefix} onChange={(e) => setData('invoice_prefix', e.target.value)} placeholder="FAC" />
                                    </Stack>
                                </Grid>

                                <Stack gap="1.5">
                                    <Label htmlFor="fiscal_address">
                                        <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Dirección fiscal</Text>
                                    </Label>
                                    <ChakraTextarea
                                        id="fiscal_address"
                                        value={data.fiscal_address}
                                        onChange={(e) => setData('fiscal_address', e.target.value)}
                                        minH="64px"
                                        resize="vertical"
                                    />
                                </Stack>

                                <Stack gap="1.5">
                                    <Label htmlFor="invoice_footer_text">
                                        <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Pie de factura</Text>
                                    </Label>
                                    <ChakraTextarea
                                        id="invoice_footer_text"
                                        value={data.invoice_footer_text}
                                        onChange={(e) => setData('invoice_footer_text', e.target.value)}
                                        minH="64px"
                                        resize="vertical"
                                        placeholder="Texto que aparecerá al pie de todas las facturas"
                                    />
                                </Stack>
                            </Stack>

                            <Stack gap="5" borderRadius="lg" borderWidth="1px" borderColor="border" bg="bg.surface" p="6" boxShadow="sm">
                                <Heading as="h3" fontSize="sm" fontWeight="semibold" color="fg">
                                    Protección de datos (RGPD)
                                </Heading>

                                <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                                    <Stack gap="1.5">
                                        <Label htmlFor="data_retention_months">
                                            <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Retención de datos (meses)</Text>
                                        </Label>
                                        <Input id="data_retention_months" type="number" min="1" value={data.data_retention_months} onChange={(e) => setData('data_retention_months', e.target.value)} />
                                    </Stack>
                                    <Stack gap="1.5">
                                        <Label htmlFor="privacy_policy_url">
                                            <Text as="span" fontSize="sm" fontWeight="medium" color="fg">URL Política de privacidad</Text>
                                        </Label>
                                        <Input id="privacy_policy_url" type="url" value={data.privacy_policy_url} onChange={(e) => setData('privacy_policy_url', e.target.value)} placeholder="https://…" />
                                    </Stack>
                                </Grid>

                                <Stack gap="1.5">
                                    <Label htmlFor="rgpd_template">
                                        <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Plantilla de consentimiento RGPD</Text>
                                    </Label>
                                    <ChakraTextarea
                                        id="rgpd_template"
                                        value={data.rgpd_template}
                                        onChange={(e) => setData('rgpd_template', e.target.value)}
                                        minH="120px"
                                        resize="vertical"
                                        fontSize="sm"
                                        placeholder="Texto del consentimiento informado que se mostrará a los pacientes para que firmen"
                                    />
                                </Stack>
                            </Stack>

                            <Flex alignItems="center" gap="4" borderTopWidth="1px" borderColor="border" pt="6">
                                <Button type="submit" disabled={settingsProcessing}>
                                    {settingsProcessing ? (
                                        <Flex alignItems="center" gap="2">
                                            <Box h="4" w="4" borderRadius="full" borderWidth="2px" borderColor="currentColor" borderTopColor="transparent" css={{ animation: 'spin 1s linear infinite' }} />
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
                        </form>
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
