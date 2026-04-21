import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Form, Head } from '@inertiajs/react';
import { Shield, ShieldBan, ShieldCheck, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import type { BreadcrumbItem } from '@/types';

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Autenticación de dos factores', href: show.url() },
];

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <>
            <Head title="Autenticación de dos factores" />

            <Heading as="h1" srOnly>Ajustes de Autenticación de Dos Factores</Heading>

            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <Flex alignItems="center" gap="2">
                            <Box as={Shield} h="5" w="5" color="brand.solid" />
                            <CardTitle>
                                <Text as="span" fontSize="md" fontWeight="semibold">Autenticación de dos factores</Text>
                            </CardTitle>
                        </Flex>
                        <CardDescription>
                            Añade una capa extra de seguridad a tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {twoFactorEnabled ? (
                            <Stack gap="6">
                                <Flex alignItems="flex-start" gap="4" borderRadius="lg" borderWidth="1px" borderColor="success.subtle" bg="success.subtle" p="4">
                                    <Box as={ShieldCheck} h="6" w="6" color="success.fg" flexShrink={0} mt="0.5" />
                                    <Stack gap="1">
                                        <Flex alignItems="center" gap="2">
                                            <Text fontWeight="medium" color="success.fg">2FA Activado</Text>
                                            <Badge variant="default" bg="success.solid">Activo</Badge>
                                        </Flex>
                                        <Text fontSize="sm" color="success.fg">
                                            Tu cuenta está protegida con autenticación de dos factores. Necesitarás un código de tu aplicación autenticadora al iniciar sesión.
                                        </Text>
                                    </Stack>
                                </Flex>

                                <Flex alignItems="flex-start" gap="3" borderRadius="lg" borderWidth="1px" borderColor="border" bg="bg.muted" p="4">
                                    <Box as={Smartphone} h="5" w="5" color="fg.muted" flexShrink={0} mt="0.5" />
                                    <Box fontSize="sm" color="fg.muted">
                                        <Text fontWeight="medium" color="fg" mb="1">¿Cómo funciona?</Text>
                                        <Text>Cuando inicies sesión, se te pedirá un código de 6 dígitos que puedes obtener de tu aplicación autenticadora (Google Authenticator, Authy, etc.).</Text>
                                    </Box>
                                </Flex>

                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />

                                <Box borderTopWidth="1px" borderColor="border" pt="6">
                                    <Form action={disable.url()} method="delete">
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                                gap="2"
                                            >
                                                {processing ? (
                                                    <Box h="4" w="4" borderRadius="full" borderWidth="2px" borderColor="currentColor" borderTopColor="transparent" css={{ animation: 'spin 1s linear infinite' }} />
                                                ) : (
                                                    <Box as={ShieldBan} h="4" w="4" />
                                                )}
                                                Desactivar 2FA
                                            </Button>
                                        )}
                                    </Form>
                                </Box>
                            </Stack>
                        ) : (
                            <Stack gap="6">
                                <Flex alignItems="flex-start" gap="4" borderRadius="lg" borderWidth="1px" borderColor="warning.subtle" bg="warning.subtle" p="4">
                                    <Box as={ShieldBan} h="6" w="6" color="warning.fg" flexShrink={0} mt="0.5" />
                                    <Stack gap="1">
                                        <Flex alignItems="center" gap="2">
                                            <Text fontWeight="medium" color="warning.fg">2FA Desactivado</Text>
                                            <Badge variant="destructive">Inactivo</Badge>
                                        </Flex>
                                        <Text fontSize="sm" color="warning.fg">
                                            Tu cuenta no tiene autenticación de dos factores. Te recomendamos activarla para mayor seguridad.
                                        </Text>
                                    </Stack>
                                </Flex>

                                <Stack gap="3">
                                    <Text fontSize="sm" fontWeight="medium">Beneficios de activar 2FA:</Text>
                                    <Stack as="ul" gap="2" fontSize="sm" color="fg.muted" listStyleType="none">
                                        <Flex as="li" alignItems="center" gap="2">
                                            <Box as={ShieldCheck} h="4" w="4" color="success.fg" />
                                            Protección adicional contra accesos no autorizados
                                        </Flex>
                                        <Flex as="li" alignItems="center" gap="2">
                                            <Box as={ShieldCheck} h="4" w="4" color="success.fg" />
                                            Seguridad incluso si tu contraseña es comprometida
                                        </Flex>
                                        <Flex as="li" alignItems="center" gap="2">
                                            <Box as={ShieldCheck} h="4" w="4" color="success.fg" />
                                            Códigos de recuperación para emergencias
                                        </Flex>
                                    </Stack>
                                </Stack>

                                <Box borderTopWidth="1px" borderColor="border" pt="6">
                                    {hasSetupData ? (
                                        <Button onClick={() => setShowSetupModal(true)} gap="2">
                                            <Box as={ShieldCheck} h="4" w="4" />
                                            Continuar configuración
                                        </Button>
                                    ) : (
                                        <Form
                                            action={enable.url()}
                                            method="post"
                                            onSuccess={() => setShowSetupModal(true)}
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    loading={processing}
                                                    gap="2"
                                                >
                                                    <Box as={ShieldCheck} h="4" w="4" />
                                                    Activar 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </Box>
                            </Stack>
                        )}

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={errors}
                        />
                    </CardContent>
                </Card>
            </SettingsLayout>
        </>
    );
}

TwoFactor.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
