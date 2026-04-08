import { Head } from '@inertiajs/react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Ajustes', href: '/settings' },
];

export default function SettingsPage() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ajustes" />
      
      <div className="flex flex-col gap-6 p-6 max-w-4xl">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-lg bg-[var(--color-primary)]/10">
            <SettingsIcon className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Ajustes</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Personaliza tu experiencia en ClientKosmos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Perfil</CardTitle>
              <CardDescription>Información personal y de cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Actualiza tu nombre, foto de perfil y datos de contacto.
              </p>
              <button className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                Ir al perfil →
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Suscripción</CardTitle>
              <CardDescription>Plan y facturación</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Gestiona tu plan, historial de pagos y métodos de pago.
              </p>
              <button className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                Ir a suscripción →
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Privacidad</CardTitle>
              <CardDescription>Datos y consentimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Controla tu información, privacidad y descargas de datos.
              </p>
              <button className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                Ver privacidad →
              </button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Notificaciones</CardTitle>
              <CardDescription>Preferencias de alertas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Personaliza cuándo y cómo recibes notificaciones.
              </p>
              <button className="text-sm font-medium text-[var(--color-primary)] hover:underline">
                Preferencias →
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
