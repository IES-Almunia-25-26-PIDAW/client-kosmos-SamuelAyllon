import { router } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImpersonationBanner() {
    const stop = () => {
        router.delete('/admin/impersonate');
    };

    return (
        <div className="sticky top-0 z-[calc(var(--z-toast)-1)] flex items-center justify-between gap-3 bg-[var(--color-warning)] px-4 py-2">
            <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[var(--color-warning-fg)] shrink-0" />
                <span className="text-sm font-medium text-[var(--color-warning-fg)]">
                    Estás viendo la cuenta de otro usuario. Lo que hagas afectará a sus datos reales.
                </span>
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={stop}
                className="shrink-0 text-xs"
            >
                Terminar impersonación
            </Button>
        </div>
    );
}
