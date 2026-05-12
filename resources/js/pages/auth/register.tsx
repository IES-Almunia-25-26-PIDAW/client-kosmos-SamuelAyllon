import {
    Box,
    Button as ChakraButton,
    chakra,
    Flex,
    Grid,
    Heading,
    HStack,
    Separator,
    SimpleGrid,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Briefcase,
    Check,
    ChevronLeft,
    ChevronRight,
    Heart,
    KeyRound,
    Lock,
    Mail,
    User,
    UserPlus,
} from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { FormField } from '@/components/form-field';
import { GoogleSignInButton } from '@/components/google-sign-in-button';
import { PasswordStrengthPopover } from '@/components/password-strength';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldLabel } from '@/components/ui/field-label';
import { IconInput } from '@/components/ui/icon-input';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { registerSchema } from '@/lib/schemas/register.schema';
import { validateOrSetErrors } from '@/lib/validation';
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

const CONSENTS = [
    {
        field: 'consent_privacy_policy' as const,
        label: 'He leído y acepto la política de privacidad.',
    },
    {
        field: 'consent_terms_of_service' as const,
        label: 'He leído y acepto los términos del servicio.',
    },
    {
        field: 'consent_health_data' as const,
        label: 'Consiento el tratamiento de mis datos de salud para la finalidad terapéutica indicada. (RGPD Art. 9.2.h)',
    },
    {
        field: 'consent_recording_global' as const,
        label: 'Autorizo la grabación de audio de mis sesiones y su procesamiento automatizado por la IA de ClientKosmos para generar resúmenes clínicos destinados exclusivamente a mi profesional. (RGPD Art. 22)',
    },
];

type UserType = 'professional' | 'patient';

type TypeButtonProps = {
    active: boolean;
    onClick: () => void;
    icon: typeof Briefcase;
    label: string;
};

function TypeButton({ active, onClick, icon: Icon, label }: TypeButtonProps) {
    return (
        <ChakraButton
            type="button"
            onClick={onClick}
            variant="plain"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="2"
            borderRadius="xl"
            borderWidth="2px"
            borderColor={active ? 'brand.solid' : 'border'}
            bg={active ? 'brand.subtle' : 'transparent'}
            color={active ? 'brand.solid' : 'fg.muted'}
            p="4"
            fontSize="sm"
            fontWeight="semibold"
            h="auto"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
                borderColor: active ? 'brand.solid' : 'brand.emphasized',
                bg: active ? 'brand.subtle' : 'bg.subtle',
            }}
        >
            <Box as={Icon} h="6" w="6" />
            {label}
        </ChakraButton>
    );
}

function StepIndicator({ step, userType }: { step: 1 | 2; userType: UserType }) {
    const labels =
        userType === 'professional'
            ? ['Datos básicos', 'Perfil profesional']
            : ['Datos básicos', 'Consentimientos'];

    return (
        <Flex alignItems="center" gap="0">
            {labels.map((label, i) => {
                const num = i + 1;
                const isCompleted = step > num;
                const isActive = step === num;
                return (
                    <Flex key={num} alignItems="center" flex={i < labels.length - 1 ? '1' : undefined}>
                        <Flex direction="column" alignItems="center" gap="1.5" minW="0">
                            <Flex
                                w="8"
                                h="8"
                                borderRadius="full"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="xs"
                                fontWeight="bold"
                                transition="all 0.2s"
                                bg={isCompleted || isActive ? 'brand.solid' : 'bg.subtle'}
                                color={isCompleted || isActive ? 'white' : 'fg.muted'}
                                borderWidth="2px"
                                borderColor={isCompleted || isActive ? 'brand.solid' : 'border'}
                                flexShrink={0}
                            >
                                {isCompleted ? <Box as={Check} h="3.5" w="3.5" /> : num}
                            </Flex>
                            <Text
                                fontSize="2xs"
                                fontWeight={isActive ? 'semibold' : 'normal'}
                                color={isActive ? 'brand.solid' : 'fg.muted'}
                                whiteSpace="nowrap"
                            >
                                {label}
                            </Text>
                        </Flex>
                        {i < labels.length - 1 && (
                            <Box
                                flex={1}
                                h="2px"
                                mx="2"
                                mb="5"
                                bg={step > num ? 'brand.solid' : 'border'}
                                transition="background 0.3s"
                                borderRadius="full"
                            />
                        )}
                    </Flex>
                );
            })}
        </Flex>
    );
}

export default function Register() {
    const [userType, setUserType] = useState<UserType>('professional');
    const [step, setStep] = useState<1 | 2>(1);

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        type: 'professional' as UserType,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        license_number: '',
        collegiate_number: '',
        specialties: [] as string[],
        bio: '',
        date_of_birth: '',
        consent_privacy_policy: false,
        consent_terms_of_service: false,
        consent_health_data: false,
        consent_recording_global: false,
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

    function goToStep2() {
        let valid = true;

        if (!data.name.trim()) {
            setError('name', 'El nombre es obligatorio');
            valid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            setError('email', 'Introduce un email válido');
            valid = false;
        }
        if (data.password.length < 8) {
            setError('password', 'La contraseña debe tener al menos 8 caracteres');
            valid = false;
        }
        if (data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Las contraseñas no coinciden');
            valid = false;
        }

        if (valid) {
            clearErrors();
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function goToStep1() {
        clearErrors();
        setStep(1);
    }

    const step1Fields = new Set(['name', 'email', 'password', 'password_confirmation']);

    function submit(e: FormEvent) {
        e.preventDefault();
        if (step === 1) {
            goToStep2();
            return;
        }
        if (
            !validateOrSetErrors(registerSchema, data, (errs) => {
                Object.entries(errs).forEach(([k, v]) =>
                    setError(k as keyof typeof data & string, v),
                );
                // Si hay errores en campos del paso 1, volver a él
                const hasStep1Errors = Object.keys(errs).some((k) => step1Fields.has(k));
                if (hasStep1Errors) setStep(1);
            })
        )
            return;
        post(store.url(), {
            onSuccess: () => {
                setData((prev) => ({ ...prev, password: '', password_confirmation: '' }));
            },
            onError: (errs) => {
                const hasStep1Error = Object.keys(errs).some((k) => step1Fields.has(k));
                if (hasStep1Error) setStep(1);
            },
        });
    }

    const submitDisabled = processing;

    return (
        <>
            <Head title="Registro" />

            <Stack gap="5">
                {/* Heading */}
                <Stack gap="1">
                    <Heading
                        as="h1"
                        fontFamily="heading"
                        fontWeight="extrabold"
                        fontSize={{ base: '2xl', md: '3xl' }}
                        letterSpacing="-0.025em"
                        color="fg"
                    >
                        Crear una cuenta
                    </Heading>
                    <Text fontSize="sm" color="fg.muted">
                        Introduce tus datos para registrarte
                    </Text>
                </Stack>

                {/* Step indicator */}
                <StepIndicator step={step} userType={userType} />

                {/* Form */}
                <chakra.form onSubmit={submit} display="flex" flexDirection="column" gap="5">

                    {/* ── STEP 1 ── */}
                    {step === 1 && (
                        <Stack gap="4">
                            {/* User type selector */}
                            <SimpleGrid columns={2} gap="3">
                                <TypeButton
                                    active={userType === 'professional'}
                                    onClick={() => selectType('professional')}
                                    icon={Briefcase}
                                    label="Profesional"
                                />
                                <TypeButton
                                    active={userType === 'patient'}
                                    onClick={() => selectType('patient')}
                                    icon={Heart}
                                    label="Paciente"
                                />
                            </SimpleGrid>

                            <GoogleSignInButton
                                intent="register"
                                role={userType}
                                label={
                                    userType === 'professional'
                                        ? 'Registrarme como profesional con Google'
                                        : 'Registrarme como paciente con Google'
                                }
                            />
                            <HStack>
                                <Separator flex="1" />
                                <Text fontSize="xs" color="fg.muted" px="2">
                                    o con email y contraseña
                                </Text>
                                <Separator flex="1" />
                            </HStack>

                            <FormField
                                label={<FieldLabel>Nombre completo</FieldLabel>}
                                error={errors.name}
                                required
                            >
                                <IconInput
                                    icon={User}
                                    iconLeft="4"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Tu nombre"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    h="14"
                                />
                            </FormField>

                            <FormField
                                label={<FieldLabel>Correo electrónico</FieldLabel>}
                                error={errors.email}
                                required
                            >
                                <IconInput
                                    icon={Mail}
                                    iconLeft="4"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@ejemplo.com"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    h="14"
                                />
                            </FormField>

                            <FormField
                                label={<FieldLabel>Contraseña</FieldLabel>}
                                error={errors.password}
                                required
                            >
                                <PasswordStrengthPopover password={data.password}>
                                    <IconInput
                                        icon={Lock}
                                        iconLeft="4"
                                        type="password"
                                        name="password"
                                        required
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Mínimo 8 caracteres"
                                        borderRadius="full"
                                        bg="bg.subtle"
                                        borderWidth="0"
                                        h="14"
                                    />
                                </PasswordStrengthPopover>
                            </FormField>

                            <FormField
                                label={<FieldLabel>Confirmar contraseña</FieldLabel>}
                                error={errors.password_confirmation}
                                required
                            >
                                <IconInput
                                    icon={KeyRound}
                                    iconLeft="4"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    h="14"
                                />
                            </FormField>

                            <ChakraButton
                                type="button"
                                onClick={goToStep2}
                                w="full"
                                h="14"
                                borderRadius="full"
                                fontSize="lg"
                                fontWeight="bold"
                                color="rgba(255,255,255,0.97)"
                                variant="plain"
                                style={{
                                    background:
                                        'linear-gradient(176.70deg, rgb(95, 207, 192) 58.675%, rgba(0, 97, 86, 0.41) 141.22%)',
                                    boxShadow:
                                        '0px 10px 15px -3px rgba(0,97,86,0.1), 0px 4px 6px -4px rgba(0,97,86,0.1)',
                                }}
                            >
                                <Flex alignItems="center" gap="2">
                                    Continuar
                                    <Box as={ChevronRight} h="5" w="5" />
                                </Flex>
                            </ChakraButton>
                        </Stack>
                    )}

                    {/* ── STEP 2 ── */}
                    {step === 2 && (
                        <Stack gap="5">
                            {/* Professional: info fields */}
                            {userType === 'professional' && (
                                <Stack gap="4">
                                    <Text
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        color="fg.muted"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                    >
                                        Información profesional
                                    </Text>

                                    <SimpleGrid columns={{ base: 1, sm: 2 }} gap="24" maxW="320px">
                                        <FormField
                                            label={<FieldLabel>Nº colegiado</FieldLabel>}
                                            error={errors.collegiate_number}
                                        >
                                            <IconInput
                                                icon={Award}
                                                iconLeft="4"
                                                type="text"
                                                name="collegiate_number"
                                                value={data.collegiate_number}
                                                onChange={(e) => setData('collegiate_number', e.target.value)}
                                                placeholder="M-12345"
                                                borderRadius="full"
                                                bg="bg.subtle"
                                                borderWidth="0"
                                                h="8"
                                                fontSize="sm"
                                            />
                                        </FormField>

                                        <FormField
                                            label={<FieldLabel>Nº licencia</FieldLabel>}
                                            error={errors.license_number}
                                        >
                                            <IconInput
                                                icon={BookOpen}
                                                iconLeft="4"
                                                type="text"
                                                name="license_number"
                                                value={data.license_number}
                                                onChange={(e) => setData('license_number', e.target.value)}
                                                placeholder="LIC-12345"
                                                borderRadius="full"
                                                bg="bg.subtle"
                                                borderWidth="0"
                                                h="8"
                                                fontSize="sm"
                                            />
                                        </FormField>
                                    </SimpleGrid>

                                    {/* Specialties */}
                                    <Box spaceY="2">
                                        <FieldLabel as="p">Especialidades</FieldLabel>
                                        <Grid
                                            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
                                            gap="2"
                                        >
                                            {SPECIALTIES.map((s) => {
                                                const active = data.specialties.includes(s.value);
                                                return (
                                                    <Flex
                                                        as="label"
                                                        key={s.value}
                                                        cursor="pointer"
                                                        alignItems="center"
                                                        gap="2"
                                                        borderRadius="lg"
                                                        borderWidth="2px"
                                                        borderColor={active ? 'brand.solid' : 'border'}
                                                        bg={active ? 'brand.subtle' : 'transparent'}
                                                        color={active ? 'brand.solid' : 'fg.muted'}
                                                        px="3"
                                                        py="2"
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                        transition="all 0.2s"
                                                        _hover={{
                                                            borderColor: active ? 'brand.solid' : 'brand.emphasized',
                                                            bg: active ? 'brand.subtle' : 'bg.subtle',
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            style={{
                                                                position: 'absolute',
                                                                width: 1,
                                                                height: 1,
                                                                padding: 0,
                                                                margin: -1,
                                                                overflow: 'hidden',
                                                                clip: 'rect(0,0,0,0)',
                                                                whiteSpace: 'nowrap',
                                                                borderWidth: 0,
                                                            }}
                                                            checked={active}
                                                            onChange={() => toggleSpecialty(s.value)}
                                                        />
                                                        {s.label}
                                                    </Flex>
                                                );
                                            })}
                                        </Grid>
                                        {errors.specialties && (
                                            <chakra.p fontSize="xs" color="danger.fg" role="alert">
                                                {errors.specialties}
                                            </chakra.p>
                                        )}
                                    </Box>

                                </Stack>
                            )}

                            {/* Patient: consent checkboxes */}
                            {userType === 'patient' && (
                                <Stack gap="3">
                                    <Stack gap="1">
                                        <Text fontWeight="semibold" fontSize="sm" color="fg">
                                            Consentimientos obligatorios
                                        </Text>
                                        <Text fontSize="xs" color="fg.muted">
                                            Debes aceptar todos los puntos para continuar.
                                        </Text>
                                    </Stack>

                                    <Stack gap="3">
                                        {CONSENTS.map(({ field, label }) => {
                                            const checked = data[field] as boolean;
                                            return (
                                                <Flex
                                                    as="label"
                                                    key={field}
                                                    cursor="pointer"
                                                    alignItems="center"
                                                    gap="3"
                                                    p="4"
                                                    borderRadius="xl"
                                                    borderWidth="2px"
                                                    borderColor={checked ? 'brand.solid' : 'border'}
                                                    bg={checked ? 'brand.subtle' : 'bg.subtle'}
                                                    transition="all 0.2s"
                                                    _hover={{
                                                        borderColor: checked ? 'brand.solid' : 'brand.emphasized',
                                                        bg: checked ? 'brand.subtle' : 'bg.muted',
                                                    }}
                                                >
                                                    <Checkbox
                                                        name={field}
                                                        size="sm"
                                                        checked={checked}
                                                        onCheckedChange={(e) => setData(field, !!e.checked)}
                                                        flexShrink={0}
                                                        aria-invalid={
                                                            !!(
                                                                errors.consent_privacy_policy ||
                                                                errors.consent_terms_of_service ||
                                                                errors.consent_health_data ||
                                                                errors.consent_recording_global
                                                            )
                                                        }
                                                    />
                                                    <Text
                                                        fontSize="sm"
                                                        color={checked ? 'fg' : 'fg.muted'}
                                                        lineHeight="tall"
                                                        fontWeight={checked ? 'medium' : 'normal'}
                                                        transition="all 0.2s"
                                                    >
                                                        {label}
                                                    </Text>
                                                </Flex>
                                            );
                                        })}
                                    </Stack>

                                    {(errors.consent_privacy_policy ||
                                        errors.consent_terms_of_service ||
                                        errors.consent_health_data ||
                                        errors.consent_recording_global) && (
                                        <chakra.p fontSize="xs" color="danger.fg" role="alert">
                                            Debes aceptar todos los consentimientos obligatorios para registrarte.
                                        </chakra.p>
                                    )}
                                </Stack>
                            )}

                            {/* Navigation buttons */}
                            <Flex gap="3">
                                <ChakraButton
                                    type="button"
                                    onClick={goToStep1}
                                    flex="0 0 auto"
                                    h="14"
                                    px="5"
                                    borderRadius="full"
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    variant="outline"
                                    borderWidth="2px"
                                    borderColor="border"
                                    color="fg.muted"
                                    bg="transparent"
                                    _hover={{ bg: 'bg.subtle', borderColor: 'border.strong' }}
                                >
                                    <Flex alignItems="center" gap="1.5">
                                        <Box as={ChevronLeft} h="4" w="4" />
                                        Volver
                                    </Flex>
                                </ChakraButton>

                                <ChakraButton
                                    type="submit"
                                    flex="1"
                                    h="14"
                                    borderRadius="full"
                                    fontSize="lg"
                                    fontWeight="bold"
                                    disabled={submitDisabled}
                                    color="rgba(255,255,255,0.97)"
                                    variant="plain"
                                    style={{
                                        background:
                                            'linear-gradient(176.70deg, rgb(95, 207, 192) 58.675%, rgba(0, 97, 86, 0.41) 141.22%)',
                                        boxShadow:
                                            '0px 10px 15px -3px rgba(0,97,86,0.1), 0px 4px 6px -4px rgba(0,97,86,0.1)',
                                    }}
                                    data-test="register-user-button"
                                >
                                    {processing ? (
                                        <Spinner />
                                    ) : (
                                        <Flex alignItems="center" gap="2">
                                            <Box as={UserPlus} h="4" w="4" />
                                            Crear cuenta
                                        </Flex>
                                    )}
                                </ChakraButton>
                            </Flex>
                        </Stack>
                    )}
                </chakra.form>

                {/* Login link */}
                <Text textAlign="center" fontSize="sm" color="fg.muted" pt="2" pb="12">
                    ¿Ya tienes una cuenta?{' '}
                    <TextLink href={login()}>
                        <Text as="span" color="brand.solid" fontWeight="semibold">
                            Inicia sesión
                        </Text>
                    </TextLink>
                </Text>
            </Stack>
        </>
    );
}

Register.layout = (page: ReactNode) => <AuthSplitLayout>{page}</AuthSplitLayout>;
