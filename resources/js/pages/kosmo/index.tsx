import { Sparkles } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { EmptyState } from '@/components/empty-state';

export default function KosmoPage() {
  return (
    <>
      <Head title="Kosmo - Inteligencia Artificial" />
      
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Kosmo</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Tu asistente de inteligencia artificial</p>
        </div>

        <EmptyState
          icon={Sparkles}
          title="Kosmo en desarrollo"
          description="Estamos preparando funcionalidades avanzadas de IA para optimizar tu flujo de trabajo. Vuelve pronto para descubrir lo que Kosmo puede hacer por ti."
          action={{
            label: "Ir a mis pacientes",
            onClick: () => window.location.href = '/clients'
          }}
        />
      </div>
    </>
  );
}
