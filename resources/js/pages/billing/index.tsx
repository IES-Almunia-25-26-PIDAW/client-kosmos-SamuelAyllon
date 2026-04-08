import { Receipt } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { EmptyState } from '@/components/empty-state';

export default function BillingPage() {
  return (
    <>
      <Head title="Cobros - Billing" />
      
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Cobros</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Gestiona tus pagos y facturas</p>
        </div>

        <EmptyState
          icon={Receipt}
          title="Sistema de cobros en desarrollo"
          description="Pronto podrás gestionar todos tus pagos, facturas y estado de cobros desde esta sección. Te notificaremos cuando esté disponible."
          action={{
            label: "Volver al inicio",
            onClick: () => window.location.href = '/dashboard'
          }}
        />
      </div>
    </>
  );
}
