import { Box, Flex, Grid, Heading, Stack, Text, Textarea as ChakraTextarea } from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import SettingsUpdateAction from '@/actions/App/Http/Controllers/Settings/UpdateAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { User } from '@/types';

interface Props {
    user: User;
}

export default function SettingsIndex({ user }: Props) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(SettingsUpdateAction.url());
    };

    return (
        <>
            <Head title="Ajustes — ClientKosmos" />

            <Flex direction="column" gap="8" p={{ base: '6', lg: '8' }} maxW="2xl">
                <Box>
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Ajustes de consulta
                    </Heading>
                    <Text mt="1" fontSize="md" color="fg.muted">
                        Personaliza tu consulta y configura la facturación y RGPD.
                    </Text>
                </Box>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Stack
                        gap="5"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="6"
                        boxShadow="sm"
                    >
                        <Heading as="h2" fontSize="lg" fontWeight="semibold" color="fg">
                            Datos de la consulta
                        </Heading>

                        <Stack gap="1.5">
                            <Label htmlFor="practice_name">
                                <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Nombre de la consulta</Text>
                            </Label>
                            <Input id="practice_name" value={data.practice_name} onChange={(e) => setData('practice_name', e.target.value)} h="10" />
                            {errors.practice_name && <Text fontSize="xs" color="danger.fg">{errors.practice_name}</Text>}
                        </Stack>

                        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                            <Stack gap="1.5">
                                <Label htmlFor="specialty">
                                    <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Especialidad</Text>
                                </Label>
                                <Input id="specialty" value={data.specialty} onChange={(e) => setData('specialty', e.target.value)} h="10" placeholder="Ej: Psicología clínica" />
                            </Stack>
                            <Stack gap="1.5">
                                <Label htmlFor="city">
                                    <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Ciudad</Text>
                                </Label>
                                <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} h="10" />
                            </Stack>
                        </Grid>

                        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                            <Stack gap="1.5">
                                <Label htmlFor="default_rate">
                                    <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Tarifa por sesión (€)</Text>
                                </Label>
                                <Input id="default_rate" type="number" min="0" step="0.01" value={data.default_rate} onChange={(e) => setData('default_rate', e.target.value)} h="10" placeholder="60.00" />
                            </Stack>
                            <Stack gap="1.5">
                                <Label htmlFor="default_session_duration">
                                    <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Duración por defecto (min)</Text>
                                </Label>
                                <Input id="default_session_duration" type="number" min="1" value={data.default_session_duration} onChange={(e) => setData('default_session_duration', e.target.value)} h="10" />
                            </Stack>
                        </Grid>
                    </Stack>

                    <Stack
                        gap="5"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="6"
                        boxShadow="sm"
                    >
                        <Heading as="h2" fontSize="lg" fontWeight="semibold" color="fg">
                            Facturación
                        </Heading>

                        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                            <Stack gap="1.5">
                                <Label htmlFor="nif">
                                    <Text as="span" fontSize="sm" fontWeight="medium" color="fg">NIF/NIE</Text>
                                </Label>
                                <Input id="nif" value={data.nif} onChange={(e) => setData('nif', e.target.value)} h="10" />
                            </Stack>
                            <Stack gap="1.5">
                                <Label htmlFor="invoice_prefix">
                                    <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Prefijo de factura</Text>
                                </Label>
                                <Input id="invoice_prefix" value={data.invoice_prefix} onChange={(e) => setData('invoice_prefix', e.target.value)} h="10" placeholder="FAC" />
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

                    <Stack
                        gap="5"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="6"
                        boxShadow="sm"
                    >
                        <Heading as="h2" fontSize="lg" fontWeight="semibold" color="fg">
                            Protección de datos (RGPD)
                        </Heading>

                        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="4">
                            <Stack gap="1.5">
                                <Label htmlFor="data_retention_months">
                                    <Text as="span" fontSize="sm" fontWeight="medium" color="fg">Retención de datos (meses)</Text>
                                </Label>
                                <Input id="data_retention_months" type="number" min="1" value={data.data_retention_months} onChange={(e) => setData('data_retention_months', e.target.value)} h="10" />
                            </Stack>
                            <Stack gap="1.5">
                                <Label htmlFor="privacy_policy_url">
                                    <Text as="span" fontSize="sm" fontWeight="medium" color="fg">URL Política de privacidad</Text>
                                </Label>
                                <Input id="privacy_policy_url" type="url" value={data.privacy_policy_url} onChange={(e) => setData('privacy_policy_url', e.target.value)} h="10" placeholder="https://…" />
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

                    <Flex alignItems="center" gap="4">
                        <Button type="submit" variant="primary" loading={processing}>Guardar ajustes</Button>
                        {recentlySuccessful && (
                            <Text as="span" fontSize="sm" color="success.fg">Guardado correctamente.</Text>
                        )}
                    </Flex>
                </form>
            </Flex>
        </>
    );
}

SettingsIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
