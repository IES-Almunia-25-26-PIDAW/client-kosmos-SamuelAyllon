import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck, Shield, Smartphone } from 'lucide-react';
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
    {
        title: 'Autenticación de dos factores',
        href: show.url(),
    },
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Autenticación de dos factores" />

            <h1 className="sr-only">Ajustes de Autenticación de Dos Factores</h1>

            <SettingsLayout>
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base font-semibold">Autenticación de dos factores</CardTitle>
                        </div>
                        <CardDescription>
                            Añade una capa extra de seguridad a tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {twoFactorEnabled ? (
                            <div className="space-y-6">
                                {/* Estado habilitado */}
                                <div className="flex items-start gap-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
                                    <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-green-800 dark:text-green-200">2FA Activado</span>
                                            <Badge variant="default" className="bg-green-600">Activo</Badge>
                                        </div>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Tu cuenta está protegida con autenticación de dos factores. Necesitarás un código de tu aplicación autenticadora al iniciar sesión.
                                        </p>
                                    </div>
                                </div>

                                {/* Info de aplicación */}
                                <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                                    <Smartphone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div className="text-sm text-muted-foreground">
                                        <p className="font-medium text-foreground mb-1">¿Cómo funciona?</p>
                                        <p>Cuando inicies sesión, se te pedirá un código de 6 dígitos que puedes obtener de tu aplicación autenticadora (Google Authenticator, Authy, etc.).</p>
                                    </div>
                                </div>

                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />

                                <div className="border-t pt-6">
                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                                className="gap-2"
                                            >
                                                {processing ? (
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                ) : (
                                                    <ShieldBan className="h-4 w-4" />
                                                )}
                                                Desactivar 2FA
                                            </Button>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Estado deshabilitado */}
                                <div className="flex items-start gap-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                                    <ShieldBan className="h-6 w-6 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-yellow-800 dark:text-yellow-200">2FA Desactivado</span>
                                            <Badge variant="destructive">Inactivo</Badge>
                                        </div>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            Tu cuenta no tiene autenticación de dos factores. Te recomendamos activarla para mayor seguridad.
                                        </p>
                                    </div>
                                </div>

                                {/* Beneficios */}
                                <div className="space-y-3">
                                    <p className="text-sm font-medium">Beneficios de activar 2FA:</p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-green-500" />
                                            Protección adicional contra accesos no autorizados
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-green-500" />
                                            Seguridad incluso si tu contraseña es comprometida
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-green-500" />
                                            Códigos de recuperación para emergencias
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t pt-6">
                                    {hasSetupData ? (
                                        <Button
                                            onClick={() => setShowSetupModal(true)}
                                            className="gap-2"
                                        >
                                            <ShieldCheck className="h-4 w-4" />
                                            Continuar configuración
                                        </Button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() =>
                                                setShowSetupModal(true)
                                            }
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="gap-2"
                                                >
                                                    {processing ? (
                                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    ) : (
                                                        <ShieldCheck className="h-4 w-4" />
                                                    )}
                                                    Activar 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </div>
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
        </AppLayout>
    );
}
