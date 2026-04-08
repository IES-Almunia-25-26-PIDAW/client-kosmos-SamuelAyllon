import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
    project_name: string;
    email: string;
    phone: string;
    brand_tone: string;
    service_scope: string;
    next_deadline: string;
    [key: string]: string;
}

export default function PatientCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        project_name: '',
        email: '',
        phone: '',
        brand_tone: '',
        service_scope: '',
        next_deadline: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/patients');
    };

    return (
        <AppLayout>
            <Head title="Nuevo paciente — ClientKosmos" />

            <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-2xl">
                <div>
                    <h1 className="text-display-2xl text-[var(--color-text)]">Nuevo paciente</h1>
                    <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">
                        Añade los datos básicos del paciente. Podrás completarlos más adelante.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] space-y-5">

                        <div className="space-y-1.5">
                            <Label htmlFor="project_name" className="text-label text-[var(--color-text)]">
                                Nombre del paciente <span className="text-[var(--color-error)]">*</span>
                            </Label>
                            <Input
                                id="project_name"
                                value={data.project_name}
                                onChange={(e) => setData('project_name', e.target.value)}
                                placeholder="Nombre completo o alias"
                                className="h-10"
                                required
                            />
                            {errors.project_name && <p className="text-xs text-[var(--color-error)]">{errors.project_name}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-label text-[var(--color-text)]">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@ejemplo.com"
                                    className="h-10"
                                />
                                {errors.email && <p className="text-xs text-[var(--color-error)]">{errors.email}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-label text-[var(--color-text)]">Teléfono</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+34 600 000 000"
                                    className="h-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="service_scope" className="text-label text-[var(--color-text)]">Motivo de consulta</Label>
                            <textarea
                                id="service_scope"
                                value={data.service_scope}
                                onChange={(e) => setData('service_scope', e.target.value)}
                                placeholder="Describe brevemente el motivo de consulta o el objetivo terapéutico"
                                className="w-full min-h-[80px] px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-base resize-y focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow] duration-[var(--duration-normal)] placeholder:text-[var(--color-text-muted)]"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="brand_tone" className="text-label text-[var(--color-text)]">Enfoque terapéutico</Label>
                                <Input
                                    id="brand_tone"
                                    value={data.brand_tone}
                                    onChange={(e) => setData('brand_tone', e.target.value)}
                                    placeholder="TCC, EMDR, Humanista…"
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="next_deadline" className="text-label text-[var(--color-text)]">Próxima sesión</Label>
                                <Input
                                    id="next_deadline"
                                    type="date"
                                    value={data.next_deadline}
                                    onChange={(e) => setData('next_deadline', e.target.value)}
                                    className="h-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => window.history.back()}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" loading={processing}>
                            Crear paciente
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
