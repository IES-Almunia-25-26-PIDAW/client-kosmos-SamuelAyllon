import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { User, Mail, CheckCircle2 } from 'lucide-react';
import ProfileActions from '@/actions/App/Http/Controllers/Settings/Profile';
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
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ajustes de perfil',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes de perfil" />

            <h1 className="sr-only">Ajustes de Perfil</h1>

            <SettingsLayout>
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base font-semibold">Información del perfil</CardTitle>
                        </div>
                        <CardDescription>
                            Actualiza tu nombre y dirección de correo electrónico
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form
                            {...ProfileActions.UpdateAction.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            Nombre
                                        </Label>
                                        <Input
                                            id="name"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Tu nombre completo"
                                        />
                                        <InputError
                                            className="mt-1"
                                            message={errors.name}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            Correo electrónico
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
                                        <InputError
                                            className="mt-1"
                                            message={errors.email}
                                        />
                                    </div>

                                    {mustVerifyEmail &&
                                        auth.user.email_verified_at === null && (
                                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                    Tu correo electrónico no está verificado.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="font-medium underline underline-offset-4 hover:text-yellow-900 dark:hover:text-yellow-100"
                                                    >
                                                        Haz clic aquí para reenviar el correo de verificación.
                                                    </Link>
                                                </p>

                                                {status ===
                                                    'verification-link-sent' && (
                                                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Se ha enviado un nuevo enlace de verificación.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    <div className="flex items-center gap-4 border-t pt-6">
                                        <Button
                                            disabled={processing}
                                            data-test="update-profile-button"
                                            className="min-w-[100px]"
                                        >
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Guardando...
                                                </span>
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

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
