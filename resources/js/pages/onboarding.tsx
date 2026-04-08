import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type OnboardingStep = 1 | 2 | 3;

interface FormData {
    practice_name: string;
    specialty: string;
    city: string;
    patient: {
        project_name: string;
        service_scope: string;
        brand_tone: string;
        next_deadline: string;
    };
    [key: string]: unknown;
}

const specialties = [
    'Psicología clínica',
    'Neuropsicología',
    'Psicología infantil',
    'Psicología de pareja',
    'Psicología forense',
    'Otra',
];

export default function Onboarding() {
    const [step, setStep] = useState<OnboardingStep>(1);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        practice_name: '',
        specialty: '',
        city: '',
        patient: {
            project_name: '',
            service_scope: '',
            brand_tone: '',
            next_deadline: '',
        },
    });

    const submit = () => {
        post('/onboarding');
    };

    const stepLabels = ['Sobre tu consulta', 'Tu primer paciente', 'Ya casi'];

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
            <Head title="Configurar cuenta — ClientKosmos" />

            <div className="w-full max-w-[520px]">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <Sparkles size={24} className="text-[var(--color-primary)]" />
                        <span className="text-display-xl text-[var(--color-text)]">ClientKosmos</span>
                    </div>
                    <p className="text-body-md text-[var(--color-text-secondary)]">
                        Configuremos tu espacio de trabajo
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                    {([1, 2, 3] as OnboardingStep[]).map((s) => (
                        <div key={s} className="flex items-center flex-1">
                            <div className={`h-2 flex-1 rounded-full transition-colors duration-[var(--duration-normal)] ${
                                s <= step ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
                            }`} />
                        </div>
                    ))}
                </div>
                <p className="text-caption text-[var(--color-text-secondary)] uppercase tracking-wider mb-6 text-center">
                    Paso {step} de 3 — {stepLabels[step - 1]}
                </p>

                {/* Card */}
                <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">

                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-display-lg text-[var(--color-text)]">Sobre tu consulta</h2>
                            <div className="space-y-1.5">
                                <Label htmlFor="practice_name" className="text-label text-[var(--color-text)]">
                                    Nombre de tu consulta <span className="text-[var(--color-error)]">*</span>
                                </Label>
                                <Input
                                    id="practice_name"
                                    value={data.practice_name}
                                    onChange={(e) => setData('practice_name', e.target.value)}
                                    placeholder="Ej: Consulta Natalia López"
                                    className="h-10"
                                />
                                {errors.practice_name && (
                                    <p className="text-xs text-[var(--color-error)]">{errors.practice_name}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="specialty" className="text-label text-[var(--color-text)]">Especialidad</Label>
                                <select
                                    id="specialty"
                                    value={data.specialty}
                                    onChange={(e) => setData('specialty', e.target.value)}
                                    className="w-full h-10 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-base focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow] duration-[var(--duration-normal)]"
                                >
                                    <option value="">Seleccionar…</option>
                                    {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="city" className="text-label text-[var(--color-text)]">Ciudad</Label>
                                <Input
                                    id="city"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Ej: Madrid"
                                    className="h-10"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h2 className="text-display-lg text-[var(--color-text)]">Tu primer paciente</h2>
                            <p className="text-body-sm text-[var(--color-text-secondary)]">Puedes hacerlo después si prefieres.</p>
                            <div className="space-y-1.5">
                                <Label htmlFor="p_name" className="text-label text-[var(--color-text)]">Nombre del paciente</Label>
                                <Input
                                    id="p_name"
                                    value={data.patient.project_name}
                                    onChange={(e) => setData('patient', { ...data.patient, project_name: e.target.value })}
                                    placeholder="Ej: Ana García"
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="p_scope" className="text-label text-[var(--color-text)]">Motivo de consulta</Label>
                                <textarea
                                    id="p_scope"
                                    value={data.patient.service_scope}
                                    onChange={(e) => setData('patient', { ...data.patient, service_scope: e.target.value })}
                                    placeholder="Ej: Ansiedad generalizada, gestión del estrés"
                                    className="w-full min-h-[80px] px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] text-base resize-y focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-[border-color,box-shadow] duration-[var(--duration-normal)]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="p_tone" className="text-label text-[var(--color-text)]">Enfoque terapéutico</Label>
                                <Input
                                    id="p_tone"
                                    value={data.patient.brand_tone}
                                    onChange={(e) => setData('patient', { ...data.patient, brand_tone: e.target.value })}
                                    placeholder="Ej: TCC, EMDR, Terapia humanista"
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="p_deadline" className="text-label text-[var(--color-text)]">Próxima sesión</Label>
                                <Input
                                    id="p_deadline"
                                    type="date"
                                    value={data.patient.next_deadline}
                                    onChange={(e) => setData('patient', { ...data.patient, next_deadline: e.target.value })}
                                    className="h-10"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center mx-auto">
                                <Sparkles size={32} className="text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <h2 className="text-display-lg text-[var(--color-text)] mb-2">¡Todo listo!</h2>
                                <p className="text-body-md text-[var(--color-text-secondary)]">
                                    Kosmo te acompañará en cada sesión. Tu consulta está lista para empezar.
                                </p>
                            </div>
                            {data.practice_name && (
                                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-4 text-left space-y-2">
                                    <p className="text-sm text-[var(--color-text)]">
                                        <span className="text-[var(--color-text-secondary)]">Consulta:</span> {data.practice_name}
                                    </p>
                                    {data.specialty && (
                                        <p className="text-sm text-[var(--color-text)]">
                                            <span className="text-[var(--color-text-secondary)]">Especialidad:</span> {data.specialty}
                                        </p>
                                    )}
                                    {data.patient.project_name && (
                                        <p className="text-sm text-[var(--color-text)]">
                                            <span className="text-[var(--color-text-secondary)]">Primer paciente:</span> {data.patient.project_name}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 gap-4">
                    {step > 1 ? (
                        <Button
                            variant="secondary"
                            onClick={() => setStep((s) => (s - 1) as OnboardingStep)}
                            disabled={processing}
                        >
                            Anterior
                        </Button>
                    ) : (
                        <div />
                    )}

                    <div className="flex gap-3">
                        {step === 2 && (
                            <Button
                                variant="ghost"
                                onClick={() => setStep(3)}
                                disabled={processing}
                                className="text-[var(--color-text-secondary)]"
                            >
                                Lo haré después
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button
                                variant="primary"
                                onClick={() => setStep((s) => (s + 1) as OnboardingStep)}
                                disabled={step === 1 && !data.practice_name}
                            >
                                Siguiente
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={submit}
                                loading={processing}
                            >
                                Ir a mi consulta
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
