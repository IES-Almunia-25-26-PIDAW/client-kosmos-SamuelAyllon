import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Auth, User } from '@/types';
import { usePage } from '@inertiajs/react';

interface Props {
    user: User;
}

export default function SettingsIndex({ user }: Props) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        practice_name: user.practice_name ?? '',
        specialty: user.specialty ?? '',
        city: user.city ?? '',
        default_rate: user.default_rate ? String(user.default_rate) : '',
        default_session_duration: String(user.default_session_duration ?? 50),
        nif: user.nif ?? '',
        fiscal_address: user.fiscal_address ?? '',
        invoice_prefix: user.invoice_prefix ?? 'FAC',
        invoice_footer_text: user.invoice_footer_text ?? '',
        rgpd_template: user.rgpd_template ?? '',
        data_retention_months: String(user.data_retention_months ?? 60),
        privacy_policy_url: user.privacy_policy_url ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings');
    };

    return (
        <AppLayout>
            <Head title="Ajustes — ClientKosmos" />

            <div className="flex flex-col gap-8 p-6 lg:p-8 max-w-2xl">
                <div>
                    <h1 className="text-display-2xl text-[var(--color-text)]">Ajustes de consulta</h1>
                    <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">
                        Personaliza tu consulta y configura la facturación y RGPD.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">

                    {/* Basic info */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] space-y-5">
                        <h2 className="text-display-lg text-[var(--color-text)]">Datos de la consulta</h2>

                        <div className="space-y-1.5">
                            <Label htmlFor="practice_name" className="text-label text-[var(--color-text)]">Nombre de la consulta</Label>
                            <Input id="practice_name" value={data.practice_name} onChange={(e) => setData('practice_name', e.target.value)} className="h-10" />
                            {errors.practice_name && <p className="text-xs text-[var(--color-error)]">{errors.practice_name}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="specialty" className="text-label text-[var(--color-text)]">Especialidad</Label>
                                <Input id="specialty" value={data.specialty} onChange={(e) => setData('specialty', e.target.value)} className="h-10" placeholder="Ej: Psicología clínica" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="city" className="text-label text-[var(--color-text)]">Ciudad</Label>
                                <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} className="h-10" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="default_rate" className="text-label text-[var(--color-text)]">Tarifa por sesión (€)</Label>
                                <Input id="default_rate" type="number" min="0" step="0.01" value={data.default_rate} onChange={(e) => setData('default_rate', e.target.value)} className="h-10" placeholder="60.00" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="default_session_duration" className="text-label text-[var(--color-text)]">Duración por defecto (min)</Label>
                                <Input id="default_session_duration" type="number" min="1" value={data.default_session_duration} onChange={(e) => setData('default_session_duration', e.target.value)} className="h-10" />
                            </div>
                        </div>
                    </div>

                    {/* Billing */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] space-y-5">
                        <h2 className="text-display-lg text-[var(--color-text)]">Facturación</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="nif" className="text-label text-[var(--color-text)]">NIF/NIE</Label>
                                <Input id="nif" value={data.nif} onChange={(e) => setData('nif', e.target.value)} className="h-10" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="invoice_prefix" className="text-label text-[var(--color-text)]">Prefijo de factura</Label>
                                <Input id="invoice_prefix" value={data.invoice_prefix} onChange={(e) => setData('invoice_prefix', e.target.value)} className="h-10" placeholder="FAC" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="fiscal_address" className="text-label text-[var(--color-text)]">Dirección fiscal</Label>
                            <textarea
                                id="fiscal_address"
                                value={data.fiscal_address}
                                onChange={(e) => setData('fiscal_address', e.target.value)}
                                className="w-full min-h-[64px] px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-base resize-y focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow] duration-[var(--duration-normal)]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="invoice_footer_text" className="text-label text-[var(--color-text)]">Pie de factura</Label>
                            <textarea
                                id="invoice_footer_text"
                                value={data.invoice_footer_text}
                                onChange={(e) => setData('invoice_footer_text', e.target.value)}
                                className="w-full min-h-[64px] px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-base resize-y focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow] duration-[var(--duration-normal)]"
                                placeholder="Texto que aparecerá al pie de todas las facturas"
                            />
                        </div>
                    </div>

                    {/* RGPD */}
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] space-y-5">
                        <h2 className="text-display-lg text-[var(--color-text)]">Protección de datos (RGPD)</h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="data_retention_months" className="text-label text-[var(--color-text)]">Retención de datos (meses)</Label>
                                <Input id="data_retention_months" type="number" min="1" value={data.data_retention_months} onChange={(e) => setData('data_retention_months', e.target.value)} className="h-10" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="privacy_policy_url" className="text-label text-[var(--color-text)]">URL Política de privacidad</Label>
                                <Input id="privacy_policy_url" type="url" value={data.privacy_policy_url} onChange={(e) => setData('privacy_policy_url', e.target.value)} className="h-10" placeholder="https://…" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="rgpd_template" className="text-label text-[var(--color-text)]">Plantilla de consentimiento RGPD</Label>
                            <textarea
                                id="rgpd_template"
                                value={data.rgpd_template}
                                onChange={(e) => setData('rgpd_template', e.target.value)}
                                className="w-full min-h-[120px] px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-sm resize-y focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow] duration-[var(--duration-normal)] placeholder:text-[var(--color-text-muted)]"
                                placeholder="Texto del consentimiento informado que se mostrará a los pacientes para que firmen"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" variant="primary" loading={processing}>Guardar ajustes</Button>
                        {recentlySuccessful && (
                            <span className="text-sm text-[var(--color-success)]">Guardado correctamente.</span>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
