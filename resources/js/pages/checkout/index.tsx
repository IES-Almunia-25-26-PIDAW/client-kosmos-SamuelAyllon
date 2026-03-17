import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, CheckoutProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Suscripción', href: '/subscription' },
    { title: 'Pago', href: '/checkout' },
];

export default function CheckoutIndex({ alreadyPremium, plans, subscription }: CheckoutProps) {
    const pageErrors = usePage<{ errors?: Record<string, string> }>().props.errors;
    const { data, setData, post, processing, errors } = useForm({
        plan: plans?.[0]?.key ?? 'premium_monthly',
        card_number: '',
        card_holder: '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/checkout');
    }

    // Ya es premium
    if (alreadyPremium) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Pago" />
                <div className="flex flex-col gap-6 p-6">
                    <Card className="max-w-md">
                        <CardContent className="flex flex-col items-center gap-4 py-10">
                            <p className="text-xl font-semibold">Ya tienes Premium</p>
                            <p className="text-center text-sm text-muted-foreground">
                                Tu suscripción {subscription?.plan === 'premium_yearly' ? 'anual' : 'mensual'} está activa.
                                {subscription?.expires_at && ` Válida hasta ${new Date(subscription.expires_at).toLocaleDateString('es-ES')}.`}
                            </p>
                            <Link href="/subscription">
                                <Button variant="outline">Ver mi suscripción</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pago" />

            <div className="flex flex-col gap-6 p-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Actualizar a Solo</h1>
                    <Link href="/subscription">
                        <Button variant="outline">← Volver</Button>
                    </Link>
                </div>

                {/* Error de pago */}
                {pageErrors?.payment && (
                    <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {pageErrors.payment}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">

                    {/* Formulario */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Datos de pago</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                {/* Plan */}
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="plan">Plan *</Label>
                                    <select
                                        id="plan"
                                        value={data.plan}
                                        onChange={e => setData('plan', e.target.value)}
                                        className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                    >
                                        {plans?.map(plan => (
                                            <option key={plan.key} value={plan.key}>
                                                {plan.name} — {plan.price.toFixed(2)} € ({plan.description})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.plan && <p className="text-xs text-red-600">{errors.plan}</p>}
                                </div>

                                {/* Número de tarjeta */}
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="card_number">Número de tarjeta *</Label>
                                    <Input
                                        id="card_number"
                                        value={data.card_number}
                                        onChange={e => setData('card_number', e.target.value.replace(/\D/g, '').slice(0, 16))}
                                        placeholder="1234567890123456"
                                        maxLength={16}
                                    />
                                    {errors.card_number && <p className="text-xs text-red-600">{errors.card_number}</p>}
                                </div>

                                {/* Titular */}
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="card_holder">Titular *</Label>
                                    <Input
                                        id="card_holder"
                                        value={data.card_holder}
                                        onChange={e => setData('card_holder', e.target.value)}
                                        placeholder="Nombre del titular"
                                    />
                                    {errors.card_holder && <p className="text-xs text-red-600">{errors.card_holder}</p>}
                                </div>

                                {/* Expiración y CVV */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="expiry_month">Mes *</Label>
                                        <Input
                                            id="expiry_month"
                                            value={data.expiry_month}
                                            onChange={e => setData('expiry_month', e.target.value)}
                                            placeholder="MM"
                                            maxLength={2}
                                        />
                                        {errors.expiry_month && <p className="text-xs text-red-600">{errors.expiry_month}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="expiry_year">Año *</Label>
                                        <Input
                                            id="expiry_year"
                                            value={data.expiry_year}
                                            onChange={e => setData('expiry_year', e.target.value)}
                                            placeholder="AAAA"
                                            maxLength={4}
                                        />
                                        {errors.expiry_year && <p className="text-xs text-red-600">{errors.expiry_year}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="cvv">CVV *</Label>
                                        <Input
                                            id="cvv"
                                            value={data.cvv}
                                            onChange={e => setData('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            placeholder="123"
                                            maxLength={4}
                                        />
                                        {errors.cvv && <p className="text-xs text-red-600">{errors.cvv}</p>}
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing} className="mt-2">
                                    {processing ? 'Procesando pago...' : 'Pagar ahora'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Resumen del plan seleccionado */}
                    <div className="flex flex-col gap-4">
                        {plans?.map(plan => (
                            <Card key={plan.key} className={`cursor-pointer transition-all ${data.plan === plan.key ? 'ring-2 ring-purple-500' : 'opacity-60'}`} onClick={() => setData('plan', plan.key)}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-semibold">{plan.name}</p>
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                    </div>
                                    <p className="text-xl font-bold">{plan.price.toFixed(2)} €</p>
                                </CardContent>
                            </Card>
                        ))}
                        <p className="text-xs text-muted-foreground">
                            * Pago simulado. No se realizan cargos reales. El 80% de los pagos tienen éxito de forma aleatoria.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
