import { Box, Button as ChakraButton, chakra, Flex, Grid, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Briefcase,
    Calendar,
    FileText,
    Heart,
    KeyRound,
    Lock,
    Mail,
    Phone,
    User,
    UserPlus,
} from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { FormField } from '@/components/form-field';
import PasswordStrength from '@/components/password-strength';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldLabel } from '@/components/ui/field-label';
import { IconInput } from '@/components/ui/icon-input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
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

type TypeButtonProps = {
    active: boolean;
    onClick: () => void;
    icon: typeof Briefcase;
    label: string;
};

function TypeButton({ active, onClick, icon: Icon, label }: TypeButtonProps) {
    return (
        <ChakraButton
            as="button"
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

export default function Register() {
    const [userType, setUserType] = useState<UserType>('professional');

    const { data, setData, post, processing, errors } = useForm({
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

            <Stack gap="6">
                {/* Heading Section */}
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

                {/* Form */}
                <chakra.form
                    onSubmit={submit}
                    display="flex"
                    flexDirection="column"
                    gap="6"
                >
                    {/* User Type Selection */}
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

                    {/* Form Fields */}
                    <Stack gap="4">
                        {/* Name Field */}
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

                        {/* Email Field */}
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

                        {/* Phone Field */}
                        <FormField
                            label={
                                <FieldLabel>
                                    Teléfono{' '}
                                    <chakra.span color="fg.subtle" fontWeight="normal" textTransform="none">
                                        (opcional)
                                    </chakra.span>
                                </FieldLabel>
                            }
                            error={errors.phone}
                        >
                            <IconInput
                                icon={Phone}
                                iconLeft="4"
                                type="tel"
                                name="phone"
                                autoComplete="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+34 600 000 000"
                                borderRadius="full"
                                bg="bg.subtle"
                                borderWidth="0"
                                h="14"
                            />
                        </FormField>

                        {/* Professional-Only Fields */}
                        {userType === 'professional' && (
                            <>
                                <SimpleGrid columns={{ base: 1, sm: 2 }} gap="3">
                                    {/* Collegiate Number */}
                                    <FormField
                                        label={
                                            <FieldLabel>
                                                Nº colegiado{' '}
                                                <chakra.span color="fg.subtle" fontWeight="normal" textTransform="none">
                                                    (opc.)
                                                </chakra.span>
                                            </FieldLabel>
                                        }
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
                                            h="14"
                                        />
                                    </FormField>

                                    {/* License Number */}
                                    <FormField
                                        label={
                                            <FieldLabel>
                                                Nº licencia{' '}
                                                <chakra.span color="fg.subtle" fontWeight="normal" textTransform="none">
                                                    (opc.)
                                                </chakra.span>
                                            </FieldLabel>
                                        }
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
                                            h="14"
                                        />
                                    </FormField>
                                </SimpleGrid>

                                {/* Specialties */}
                                <Box spaceY="2">
                                    <FieldLabel as="p">
                                        Especialidades{' '}
                                        <chakra.span color="fg.subtle" fontWeight="normal" textTransform="none">
                                            (opcional)
                                        </chakra.span>
                                    </FieldLabel>
                                    <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="2">
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

                                {/* Bio */}
                                <FormField
                                    label={
                                        <FieldLabel>
                                            Presentación{' '}
                                            <chakra.span color="fg.subtle" fontWeight="normal" textTransform="none">
                                                (opcional)
                                            </chakra.span>
                                        </FieldLabel>
                                    }
                                    error={errors.bio}
                                >
                                    <Box position="relative">
                                        <Box
                                            as={FileText}
                                            aria-hidden="true"
                                            position="absolute"
                                            left="4"
                                            top="4"
                                            h="4"
                                            w="4"
                                            color="fg.muted"
                                            opacity={0.6}
                                            zIndex={1}
                                            pointerEvents="none"
                                        />
                                        <Textarea
                                            name="bio"
                                            rows={3}
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            placeholder="Cuéntanos brevemente tu enfoque terapéutico..."
                                            pl="10"
                                            bg="bg.subtle"
                                            borderWidth="0"
                                            borderRadius="xl"
                                        />
                                    </Box>
                                </FormField>
                            </>
                        )}

                        {/* Patient-Only Fields */}
                        {userType === 'patient' && (
                            <FormField
                                label={
                                    <FieldLabel>
                                        Fecha de nacimiento{' '}
                                        <chakra.span color="fg.subtle" fontWeight="normal" textTransform="none">
                                            (opcional)
                                        </chakra.span>
                                    </FieldLabel>
                                }
                                error={errors.date_of_birth}
                            >
                                <IconInput
                                    icon={Calendar}
                                    iconLeft="4"
                                    type="date"
                                    name="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    h="14"
                                />
                            </FormField>
                        )}

                        {/* Password Field */}
                        <FormField
                            label={<FieldLabel>Contraseña</FieldLabel>}
                            error={errors.password}
                            required
                        >
                            <Stack gap="2">
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
                                <PasswordStrength password={data.password} />
                            </Stack>
                        </FormField>

                        {/* Password Confirmation Field */}
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

                        {/* Consentimientos RGPD — solo paciente */}
                        {userType === 'patient' && (
                            <Stack gap="3">
                                <FieldLabel as="p">Consentimientos obligatorios</FieldLabel>

                                {[
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
                                ].map(({ field, label }) => (
                                    <Flex key={field} gap="3" alignItems="flex-start">
                                        <Checkbox
                                            id={field}
                                            name={field}
                                            checked={data[field] as boolean}
                                            onCheckedChange={(e) => setData(field, !!e.checked)}
                                            aria-invalid={
                                                !!(
                                                    errors.consent_privacy_policy ||
                                                    errors.consent_terms_of_service ||
                                                    errors.consent_health_data ||
                                                    errors.consent_recording_global
                                                )
                                            }
                                        />
                                        <chakra.label htmlFor={field} cursor="pointer">
                                            <Text as="span" fontSize="xs" color="fg.muted" lineHeight="tall">
                                                {label}
                                            </Text>
                                        </chakra.label>
                                    </Flex>
                                ))}

                                {(errors.consent_privacy_policy || errors.consent_terms_of_service || errors.consent_health_data || errors.consent_recording_global) && (
                                    <chakra.p fontSize="xs" color="danger.fg" role="alert">
                                        Debes aceptar todos los consentimientos obligatorios para registrarte.
                                    </chakra.p>
                                )}
                            </Stack>
                        )}

                        {/* Submit Button */}
                        <ChakraButton
                            type="submit"
                            w="full"
                            h="14"
                            borderRadius="full"
                            fontSize="lg"
                            fontWeight="bold"
                            disabled={
                                processing ||
                                (userType === 'patient' &&
                                    (!data.consent_privacy_policy ||
                                        !data.consent_terms_of_service ||
                                        !data.consent_health_data ||
                                        !data.consent_recording_global))
                            }
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
                    </Stack>
                </chakra.form>

                {/* Login Link */}
                <Text textAlign="center" fontSize="sm" color="fg.muted">
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
