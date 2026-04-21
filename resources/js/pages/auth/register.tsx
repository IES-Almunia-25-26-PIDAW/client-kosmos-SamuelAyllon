import { Box, Button as ChakraButton, Flex, Grid, Stack, Text } from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import { Award, BookOpen, Briefcase, Calendar, FileText, Heart, KeyRound, Lock, Mail, Phone, User, UserPlus } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
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

const inputPadStyle = { paddingLeft: '2.5rem' };

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
            _hover={{ borderColor: active ? 'brand.solid' : 'brand.emphasized' }}
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
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

                <Stack gap="5">
                    <Stack gap="2">
                        <Label htmlFor="name">
                            <Text as="span" fontSize="sm" fontWeight="semibold">Nombre completo</Text>
                        </Label>
                        <Box position="relative">
                            <Box as={User} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
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
                                style={inputPadStyle}
                            />
                        </Box>
                        <InputError message={errors.name} />
                    </Stack>

                    <Stack gap="2">
                        <Label htmlFor="email">
                            <Text as="span" fontSize="sm" fontWeight="semibold">Correo electrónico</Text>
                        </Label>
                        <Box position="relative">
                            <Box as={Mail} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
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
                                style={inputPadStyle}
                            />
                        </Box>
                        <InputError message={errors.email} />
                    </Stack>

                    <Stack gap="2">
                        <Label htmlFor="phone">
                            <Text as="span" fontSize="sm" fontWeight="semibold">
                                Teléfono <Text as="span" color="fg.muted" fontWeight="normal">(opcional)</Text>
                            </Text>
                        </Label>
                        <Box position="relative">
                            <Box as={Phone} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
                            <Input
                                id="phone"
                                type="tel"
                                tabIndex={3}
                                autoComplete="tel"
                                name="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+34 600 000 000"
                                style={inputPadStyle}
                            />
                        </Box>
                        <InputError message={errors.phone} />
                    </Stack>

                    {userType === 'professional' && (
                        <>
                            <Grid templateColumns="repeat(2, 1fr)" gap="3">
                                <Stack gap="2">
                                    <Label htmlFor="collegiate_number">
                                        <Text as="span" fontSize="sm" fontWeight="semibold">
                                            Nº colegiado <Text as="span" color="fg.muted" fontWeight="normal">(opcional)</Text>
                                        </Text>
                                    </Label>
                                    <Box position="relative">
                                        <Box as={Award} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
                                        <Input
                                            id="collegiate_number"
                                            type="text"
                                            name="collegiate_number"
                                            value={data.collegiate_number}
                                            onChange={(e) => setData('collegiate_number', e.target.value)}
                                            placeholder="M-12345"
                                            style={inputPadStyle}
                                        />
                                    </Box>
                                    <InputError message={errors.collegiate_number} />
                                </Stack>

                                <Stack gap="2">
                                    <Label htmlFor="license_number">
                                        <Text as="span" fontSize="sm" fontWeight="semibold">
                                            Nº licencia <Text as="span" color="fg.muted" fontWeight="normal">(opcional)</Text>
                                        </Text>
                                    </Label>
                                    <Box position="relative">
                                        <Box as={BookOpen} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
                                        <Input
                                            id="license_number"
                                            type="text"
                                            name="license_number"
                                            value={data.license_number}
                                            onChange={(e) => setData('license_number', e.target.value)}
                                            placeholder="LIC-12345"
                                            style={inputPadStyle}
                                        />
                                    </Box>
                                    <InputError message={errors.license_number} />
                                </Stack>
                            </Grid>

                            <Stack gap="2">
                                <Label>
                                    <Text as="span" fontSize="sm" fontWeight="semibold">
                                        Especialidades <Text as="span" color="fg.muted" fontWeight="normal">(opcional)</Text>
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
                                                _hover={{ borderColor: active ? 'brand.solid' : 'brand.emphasized' }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}
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

                            <Stack gap="2">
                                <Label htmlFor="bio">
                                    <Text as="span" fontSize="sm" fontWeight="semibold">
                                        Presentación <Text as="span" color="fg.muted" fontWeight="normal">(opcional)</Text>
                                    </Text>
                                </Label>
                                <Box position="relative">
                                    <Box as={FileText} position="absolute" left="3" top="3" h="4" w="4" color="fg.muted" />
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        rows={3}
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        placeholder="Cuéntanos brevemente tu enfoque terapéutico..."
                                        style={inputPadStyle}
                                    />
                                </Box>
                                <InputError message={errors.bio} />
                            </Stack>
                        </>
                    )}

                    {userType === 'patient' && (
                        <Stack gap="2">
                            <Label htmlFor="date_of_birth">
                                <Text as="span" fontSize="sm" fontWeight="semibold">
                                    Fecha de nacimiento <Text as="span" color="fg.muted" fontWeight="normal">(opcional)</Text>
                                </Text>
                            </Label>
                            <Box position="relative">
                                <Box as={Calendar} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    name="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    style={inputPadStyle}
                                />
                            </Box>
                            <InputError message={errors.date_of_birth} />
                        </Stack>
                    )}

                    <Stack gap="2">
                        <Label htmlFor="password">
                            <Text as="span" fontSize="sm" fontWeight="semibold">Contraseña</Text>
                        </Label>
                        <Box position="relative">
                            <Box as={Lock} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
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
                                style={inputPadStyle}
                            />
                        </Box>
                        <PasswordStrength password={data.password} />
                        <InputError message={errors.password} />
                    </Stack>

                    <Stack gap="2">
                        <Label htmlFor="password_confirmation">
                            <Text as="span" fontSize="sm" fontWeight="semibold">Confirmar contraseña</Text>
                        </Label>
                        <Box position="relative">
                            <Box as={KeyRound} position="absolute" left="3" top="50%" transform="translateY(-50%)" h="4" w="4" color="fg.muted" />
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
                                style={inputPadStyle}
                            />
                        </Box>
                        <InputError message={errors.password_confirmation} />
                    </Stack>

                    <Button
                        type="submit"
                        mt="2"
                        w="full"
                        h="11"
                        fontSize="md"
                        fontWeight="semibold"
                        borderRadius="xl"
                        tabIndex={6}
                        disabled={processing}
                        data-test="register-user-button"
                    >
                        {processing ? <Spinner /> : <Box as={UserPlus} h="4" w="4" mr="2" />}
                        Crear cuenta
                    </Button>
                </Stack>

                <Text textAlign="center" fontSize="sm" color="fg.muted" pt="2">
                    ¿Ya tienes una cuenta?{' '}
                    <TextLink href={login()} tabIndex={7}>
                        <Text as="span" color="brand.solid" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
                            Inicia sesión
                        </Text>
                    </TextLink>
                </Text>
            </form>
        </>
    );
}

Register.layout = (page: ReactNode) => (
    <AuthLayout title="Crear una cuenta" description="Introduce tus datos para registrarte">
        {page}
    </AuthLayout>
);
