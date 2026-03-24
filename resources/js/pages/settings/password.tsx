import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { Lock, KeyRound, CheckCircle2 } from 'lucide-react';
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
    {
        title: 'Ajustes de contraseña',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes de contraseña" />

            <h1 className="sr-only">Ajustes de Contraseña</h1>

            <SettingsLayout>
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base font-semibold">Actualizar contraseña</CardTitle>
                        </div>
                        <CardDescription>
                            Utiliza una contraseña larga y segura para proteger tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form
                            {...PasswordActions.UpdateAction.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            className="space-y-6"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password" className="flex items-center gap-2 text-sm font-medium">
                                            <KeyRound className="h-4 w-4 text-muted-foreground" />
                                            Contraseña actual
                                        </Label>
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Tu contraseña actual"
                                        />
                                        <InputError
                                            message={errors.current_password}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                            Nueva contraseña
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
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="flex items-center gap-2 text-sm font-medium">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                            Confirmar contraseña
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Confirma tu nueva contraseña"
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 border-t pt-6">
                                        <Button
                                            disabled={processing}
                                            data-test="update-password-button"
                                            className="min-w-[140px]"
                                        >
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Guardando...
                                                </span>
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
                                            <p className="flex items-center gap-1.5 text-sm text-green-600">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Guardado
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </SettingsLayout>
        </AppLayout>
    );
}
