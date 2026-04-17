import { Head, useForm } from '@inertiajs/react';
import { useState, type ReactNode, type FormEvent } from 'react';
import { UserPlus, User, Mail, Lock, KeyRound, Briefcase, Heart, Phone, BookOpen, Award, FileText, Calendar } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordStrength from '@/components/password-strength';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

const SPECIALTIES = [
    { value: 'clinical', label: 'Psicología clínica' },
    { value: 'cognitive_behavioral', label: 'Terapia cognitivo-conductual' },
    { value: 'child', label: 'Psicología infantil' },
    { value: 'couples', label: 'Terapia de pareja' },
    { value: 'trauma', label: 'Trauma y EMDR' },
    { value: 'systemic', label: 'Terapia sistémica' },
];

type UserType = 'professional' | 'patient';

const inputClass = 'pl-10 h-11 border-2 rounded-xl transition-all focus:ring-2 focus:ring-primary/20';

export default function Register() {
    const [userType, setUserType] = useState<UserType>('professional');

    const { data, setData, post, processing, errors } = useForm({
        type: 'professional' as UserType,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        // Professional fields
        license_number: '',
        collegiate_number: '',
        specialties: [] as string[],
        bio: '',
        // Patient fields
        date_of_birth: '',
    });

    function selectType(type: UserType) {
        setUserType(type);
        setData('type', type);
    }

    function toggleSpecialty(value: string) {
        const current = data.specialties;
        setData(
            'specialties',
            current.includes(value) ? current.filter((s) => s !== value) : [...current, value],
        );
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        post(store.url(), {
            onSuccess: () => {
                setData((prev) => ({ ...prev, password: '', password_confirmation: '' }));
            },
        });
    }

    return (
        <>
            <Head title="Registro" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                {/* Type selector */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => selectType('professional')}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-all ${
                            userType === 'professional'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/40'
                        }`}
                    >
                        <Briefcase className="h-6 w-6" />
                        Profesional
                    </button>
                    <button
                        type="button"
                        onClick={() => selectType('patient')}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-all ${
                            userType === 'patient'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/40'
                        }`}
                    >
                        <Heart className="h-6 w-6" />
                        Paciente
                    </button>
                </div>

                <div className="grid gap-5">
                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-semibold">Nombre completo</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Tu nombre"
                                className={inputClass}
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-semibold">Correo electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@ejemplo.com"
                                className={inputClass}
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Phone (shared) */}
                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">
                            Teléfono <span className="text-muted-foreground font-normal">(opcional)</span>
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                type="tel"
                                tabIndex={3}
                                autoComplete="tel"
                                name="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+34 600 000 000"
                                className={inputClass}
                            />
                        </div>
                        <InputError message={errors.phone} />
                    </div>

                    {/* Professional-specific fields */}
                    {userType === 'professional' && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="collegiate_number" className="text-sm font-semibold">
                                        Nº colegiado <span className="text-muted-foreground font-normal">(opcional)</span>
                                    </Label>
                                    <div className="relative">
                                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="collegiate_number"
                                            type="text"
                                            name="collegiate_number"
                                            value={data.collegiate_number}
                                            onChange={(e) => setData('collegiate_number', e.target.value)}
                                            placeholder="M-12345"
                                            className={inputClass}
                                        />
                                    </div>
                                    <InputError message={errors.collegiate_number} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="license_number" className="text-sm font-semibold">
                                        Nº licencia <span className="text-muted-foreground font-normal">(opcional)</span>
                                    </Label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="license_number"
                                            type="text"
                                            name="license_number"
                                            value={data.license_number}
                                            onChange={(e) => setData('license_number', e.target.value)}
                                            placeholder="LIC-12345"
                                            className={inputClass}
                                        />
                                    </div>
                                    <InputError message={errors.license_number} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-sm font-semibold">
                                    Especialidades <span className="text-muted-foreground font-normal">(opcional)</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SPECIALTIES.map((s) => (
                                        <label
                                            key={s.value}
                                            className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all ${
                                                data.specialties.includes(s.value)
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-border text-muted-foreground hover:border-primary/40'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={data.specialties.includes(s.value)}
                                                onChange={() => toggleSpecialty(s.value)}
                                            />
                                            {s.label}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.specialties} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio" className="text-sm font-semibold">
                                    Presentación <span className="text-muted-foreground font-normal">(opcional)</span>
                                </Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        rows={3}
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        placeholder="Cuéntanos brevemente tu enfoque terapéutico..."
                                        className="pl-10 border-2 rounded-xl transition-all focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <InputError message={errors.bio} />
                            </div>
                        </>
                    )}

                    {/* Patient-specific fields */}
                    {userType === 'patient' && (
                        <div className="grid gap-2">
                            <Label htmlFor="date_of_birth" className="text-sm font-semibold">
                                Fecha de nacimiento <span className="text-muted-foreground font-normal">(opcional)</span>
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    name="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <InputError message={errors.date_of_birth} />
                        </div>
                    )}

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-semibold">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                className={inputClass}
                            />
                        </div>
                        <PasswordStrength password={data.password} />
                        <InputError message={errors.password} />
                    </div>

                    {/* Password confirmation */}
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-semibold">
                            Confirmar contraseña
                        </Label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={5}
                                autoComplete="new-password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Repite tu contraseña"
                                className={inputClass}
                            />
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full h-11 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                        tabIndex={6}
                        disabled={processing}
                        data-test="register-user-button"
                    >
                        {processing ? <Spinner /> : <UserPlus className="h-4 w-4 mr-2" />}
                        Crear cuenta
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground pt-2">
                    ¿Ya tienes una cuenta?{' '}
                    <TextLink href={login()} tabIndex={7} className="text-primary font-semibold hover:underline">
                        Inicia sesión
                    </TextLink>
                </div>
            </form>
        </>
    );
}

Register.layout = (page: ReactNode) => (
    <AuthLayout title="Crear una cuenta" description="Introduce tus datos para registrarte">
        {page}
    </AuthLayout>
);
