import { Head } from '@inertiajs/react';
import { Palette } from 'lucide-react';
import AppearanceTabs from '@/components/appearance-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ajustes de apariencia',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes de apariencia" />

            <h1 className="sr-only">Ajustes de Apariencia</h1>

            <SettingsLayout>
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base font-semibold">Tema de la aplicación</CardTitle>
                        </div>
                        <CardDescription>
                            Personaliza la apariencia de tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Selecciona el tema que prefieras para la interfaz. El tema del sistema se adaptará automáticamente a la configuración de tu dispositivo.
                            </p>
                            <AppearanceTabs />
                        </div>
                    </CardContent>
                </Card>
            </SettingsLayout>
        </AppLayout>
    );
}
