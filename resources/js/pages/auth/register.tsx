import { Box, Button as ChakraButton, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
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
import InputError from '@/components/input-error';
import PasswordStrength from '@/components/password-strength';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* User Type Selection */}
                    <Grid templateColumns="repeat(2, 1fr)" gap="3">
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
                    </Grid>

                    {/* Form Fields */}
                    <Stack gap="4">
                        {/* Name Field */}
                        <Stack gap="2">
                            <Label htmlFor="name">
                                <Text
                                    as="span"
                                    fontSize="11px"
                                    fontWeight="semibold"
                                    letterSpacing="widest"
                                    textTransform="uppercase"
                                    color="fg.muted"
                                >
                                    Nombre completo
                                </Text>
                            </Label>
                            <Box position="relative">
                                <Box
                                    as={User}
                                    position="absolute"
                                    left="4"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    h="4"
                                    w="4"
                                    color="fg.muted"
                                    opacity={0.6}
                                    zIndex={1}
                                />
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Tu nombre"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    pl="10"
                                    h="14"
                                />
                            </Box>
                            <InputError message={errors.name} />
                        </Stack>

                        {/* Email Field */}
                        <Stack gap="2">
                            <Label htmlFor="email">
                                <Text
                                    as="span"
                                    fontSize="11px"
                                    fontWeight="semibold"
                                    letterSpacing="widest"
                                    textTransform="uppercase"
                                    color="fg.muted"
                                >
                                    Correo electrónico
                                </Text>
                            </Label>
                            <Box position="relative">
                                <Box
                                    as={Mail}
                                    position="absolute"
                                    left="4"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    h="4"
                                    w="4"
                                    color="fg.muted"
                                    opacity={0.6}
                                    zIndex={1}
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@ejemplo.com"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    pl="10"
                                    h="14"
                                />
                            </Box>
                            <InputError message={errors.email} />
                        </Stack>

                        {/* Phone Field */}
                        <Stack gap="2">
                            <Label htmlFor="phone">
                                <Text
                                    as="span"
                                    fontSize="11px"
                                    fontWeight="semibold"
                                    letterSpacing="widest"
                                    textTransform="uppercase"
                                    color="fg.muted"
                                >
                                    Teléfono{' '}
                                    <Text
                                        as="span"
                                        color="fg.subtle"
                                        fontWeight="normal"
                                        textTransform="none"
                                    >
                                        (opcional)
                                    </Text>
                                </Text>
                            </Label>
                            <Box position="relative">
                                <Box
                                    as={Phone}
                                    position="absolute"
                                    left="4"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    h="4"
                                    w="4"
                                    color="fg.muted"
                                    opacity={0.6}
                                    zIndex={1}
                                />
                                <Input
                                    id="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    name="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+34 600 000 000"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    pl="10"
                                    h="14"
                                />
                            </Box>
                            <InputError message={errors.phone} />
                        </Stack>

                        {/* Professional-Only Fields */}
                        {userType === 'professional' && (
                            <>
                                <Grid templateColumns="repeat(2, 1fr)" gap="3">
                                    {/* Collegiate Number */}
                                    <Stack gap="2">
                                        <Label htmlFor="collegiate_number">
                                            <Text
                                                as="span"
                                                fontSize="11px"
                                                fontWeight="semibold"
                                                letterSpacing="widest"
                                                textTransform="uppercase"
                                                color="fg.muted"
                                            >
                                                Nº colegiado{' '}
                                                <Text
                                                    as="span"
                                                    color="fg.subtle"
                                                    fontWeight="normal"
                                                    textTransform="none"
                                                >
                                                    (opc.)
                                                </Text>
                                            </Text>
                                        </Label>
                                        <Box position="relative">
                                            <Box
                                                as={Award}
                                                position="absolute"
                                                left="4"
                                                top="50%"
                                                transform="translateY(-50%)"
                                                h="4"
                                                w="4"
                                                color="fg.muted"
                                                opacity={0.6}
                                                zIndex={1}
                                            />
                                            <Input
                                                id="collegiate_number"
                                                type="text"
                                                name="collegiate_number"
                                                value={data.collegiate_number}
                                                onChange={(e) => setData('collegiate_number', e.target.value)}
                                                placeholder="M-12345"
                                                borderRadius="full"
                                                bg="bg.subtle"
                                                borderWidth="0"
                                                pl="10"
                                                h="14"
                                            />
                                        </Box>
                                        <InputError message={errors.collegiate_number} />
                                    </Stack>

                                    {/* License Number */}
                                    <Stack gap="2">
                                        <Label htmlFor="license_number">
                                            <Text
                                                as="span"
                                                fontSize="11px"
                                                fontWeight="semibold"
                                                letterSpacing="widest"
                                                textTransform="uppercase"
                                                color="fg.muted"
                                            >
                                                Nº licencia{' '}
                                                <Text
                                                    as="span"
                                                    color="fg.subtle"
                                                    fontWeight="normal"
                                                    textTransform="none"
                                                >
                                                    (opc.)
                                                </Text>
                                            </Text>
                                        </Label>
                                        <Box position="relative">
                                            <Box
                                                as={BookOpen}
                                                position="absolute"
                                                left="4"
                                                top="50%"
                                                transform="translateY(-50%)"
                                                h="4"
                                                w="4"
                                                color="fg.muted"
                                                opacity={0.6}
                                                zIndex={1}
                                            />
                                            <Input
                                                id="license_number"
                                                type="text"
                                                name="license_number"
                                                value={data.license_number}
                                                onChange={(e) => setData('license_number', e.target.value)}
                                                placeholder="LIC-12345"
                                                borderRadius="full"
                                                bg="bg.subtle"
                                                borderWidth="0"
                                                pl="10"
                                                h="14"
                                            />
                                        </Box>
                                        <InputError message={errors.license_number} />
                                    </Stack>
                                </Grid>

                                {/* Specialties */}
                                <Stack gap="2">
                                    <Label>
                                        <Text
                                            as="span"
                                            fontSize="11px"
                                            fontWeight="semibold"
                                            letterSpacing="widest"
                                            textTransform="uppercase"
                                            color="fg.muted"
                                        >
                                            Especialidades{' '}
                                            <Text
                                                as="span"
                                                color="fg.subtle"
                                                fontWeight="normal"
                                                textTransform="none"
                                            >
                                                (opcional)
                                            </Text>
                                        </Text>
                                    </Label>
                                    <Grid templateColumns="repeat(2, 1fr)" gap="2">
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
                                    <InputError message={errors.specialties} />
                                </Stack>

                                {/* Bio */}
                                <Stack gap="2">
                                    <Label htmlFor="bio">
                                        <Text
                                            as="span"
                                            fontSize="11px"
                                            fontWeight="semibold"
                                            letterSpacing="widest"
                                            textTransform="uppercase"
                                            color="fg.muted"
                                        >
                                            Presentación{' '}
                                            <Text
                                                as="span"
                                                color="fg.subtle"
                                                fontWeight="normal"
                                                textTransform="none"
                                            >
                                                (opcional)
                                            </Text>
                                        </Text>
                                    </Label>
                                    <Box position="relative">
                                        <Box
                                            as={FileText}
                                            position="absolute"
                                            left="4"
                                            top="4"
                                            h="4"
                                            w="4"
                                            color="fg.muted"
                                            opacity={0.6}
                                            zIndex={1}
                                        />
                                        <Textarea
                                            id="bio"
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
                                    <InputError message={errors.bio} />
                                </Stack>
                            </>
                        )}

                        {/* Patient-Only Fields */}
                        {userType === 'patient' && (
                            <Stack gap="2">
                                <Label htmlFor="date_of_birth">
                                    <Text
                                        as="span"
                                        fontSize="11px"
                                        fontWeight="semibold"
                                        letterSpacing="widest"
                                        textTransform="uppercase"
                                        color="fg.muted"
                                    >
                                        Fecha de nacimiento{' '}
                                        <Text
                                            as="span"
                                            color="fg.subtle"
                                            fontWeight="normal"
                                            textTransform="none"
                                        >
                                            (opcional)
                                        </Text>
                                    </Text>
                                </Label>
                                <Box position="relative">
                                    <Box
                                        as={Calendar}
                                        position="absolute"
                                        left="4"
                                        top="50%"
                                        transform="translateY(-50%)"
                                        h="4"
                                        w="4"
                                        color="fg.muted"
                                        opacity={0.6}
                                        zIndex={1}
                                    />
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        name="date_of_birth"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        borderRadius="full"
                                        bg="bg.subtle"
                                        borderWidth="0"
                                        pl="10"
                                        h="14"
                                    />
                                </Box>
                                <InputError message={errors.date_of_birth} />
                            </Stack>
                        )}

                        {/* Password Field */}
                        <Stack gap="2">
                            <Label htmlFor="password">
                                <Text
                                    as="span"
                                    fontSize="11px"
                                    fontWeight="semibold"
                                    letterSpacing="widest"
                                    textTransform="uppercase"
                                    color="fg.muted"
                                >
                                    Contraseña
                                </Text>
                            </Label>
                            <Box position="relative">
                                <Box
                                    as={Lock}
                                    position="absolute"
                                    left="4"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    h="4"
                                    w="4"
                                    color="fg.muted"
                                    opacity={0.6}
                                    zIndex={1}
                                />
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    pl="10"
                                    h="14"
                                />
                            </Box>
                            <PasswordStrength password={data.password} />
                            <InputError message={errors.password} />
                        </Stack>

                        {/* Password Confirmation Field */}
                        <Stack gap="2">
                            <Label htmlFor="password_confirmation">
                                <Text
                                    as="span"
                                    fontSize="11px"
                                    fontWeight="semibold"
                                    letterSpacing="widest"
                                    textTransform="uppercase"
                                    color="fg.muted"
                                >
                                    Confirmar contraseña
                                </Text>
                            </Label>
                            <Box position="relative">
                                <Box
                                    as={KeyRound}
                                    position="absolute"
                                    left="4"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    h="4"
                                    w="4"
                                    color="fg.muted"
                                    opacity={0.6}
                                    zIndex={1}
                                />
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    borderRadius="full"
                                    bg="bg.subtle"
                                    borderWidth="0"
                                    pl="10"
                                    h="14"
                                />
                            </Box>
                            <InputError message={errors.password_confirmation} />
                        </Stack>

                        {/* Consentimientos RGPD — solo paciente */}
                        {userType === 'patient' && (
                            <Stack gap="3">
                                <Text
                                    fontSize="11px"
                                    fontWeight="semibold"
                                    letterSpacing="widest"
                                    textTransform="uppercase"
                                    color="fg.muted"
                                >
                                    Consentimientos obligatorios
                                </Text>

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
                                        <input
                                            type="checkbox"
                                            id={field}
                                            checked={data[field] as boolean}
                                            onChange={(e) => setData(field, e.target.checked)}
                                            style={{ marginTop: 3, flexShrink: 0, accentColor: 'var(--chakra-colors-brand-solid)' }}
                                        />
                                        <Label htmlFor={field}>
                                            <Text as="span" fontSize="xs" color="fg.muted" lineHeight="tall">
                                                {label}
                                            </Text>
                                        </Label>
                                    </Flex>
                                ))}

                                {(errors.consent_privacy_policy || errors.consent_terms_of_service || errors.consent_health_data || errors.consent_recording_global) && (
                                    <Text fontSize="xs" color="red.500">
                                        Debes aceptar todos los consentimientos obligatorios para registrarte.
                                    </Text>
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
                </form>

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
