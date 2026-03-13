import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { User, Lock, Shield, Palette, Settings } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: edit(),
        icon: User,
    },
    {
        title: 'Contraseña',
        href: editPassword(),
        icon: Lock,
    },
    {
        title: 'Autenticación 2FA',
        href: show(),
        icon: Shield,
    },
    {
        title: 'Apariencia',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-6 md:px-6">
            {/* Header con icono */}
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Ajustes</h1>
                    <p className="text-sm text-muted-foreground">Gestiona tu perfil y configuración de cuenta</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-8">
                {/* Sidebar de navegación */}
                <aside className="w-full lg:w-56 shrink-0">
                    <nav
                        className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0"
                        aria-label="Ajustes"
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn(
                                    'w-full justify-start gap-2 whitespace-nowrap',
                                    isCurrentUrl(item.href) 
                                        ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary' 
                                        : ''
                                )}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                {/* Contenido principal */}
                <div className="flex-1 min-w-0">
                    <section className="max-w-2xl space-y-8">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
