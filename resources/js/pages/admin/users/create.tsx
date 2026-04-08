import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';

export default function AdminUserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AdminLayout>
            <Head title="Nuevo profesional — Admin — ClientKosmos" />

            <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-2xl">
                <div>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-4"
                    >
                        <ArrowLeft size={16} />
                        Volver a usuarios
                    </Link>
                    <h1 className="text-display-2xl text-[var(--color-text)] flex items-center gap-3">
                        <UserPlus size={26} />
                        Nuevo profesional
                    </h1>
                    <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">
                        Crea una cuenta de profesional. El usuario podrá actualizar sus datos desde los ajustes.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] space-y-5"
                >
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-[var(--color-text)]">
                            Nombre completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej. Marta García López"
                            className="h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors"
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">{errors.name}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-[var(--color-text)]">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="marta@clinica.com"
                            className="h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors"
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-[var(--color-text)]">
                            Contraseña inicial
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            className="h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors"
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
                        <Link href="/admin/users">
                            <Button type="button" variant="secondary">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" variant="primary" loading={processing}>
                            <UserPlus size={15} />
                            Crear profesional
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
