import { Box, Flex, Heading, Icon, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, useForm } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import OnboardingStoreAction from '@/actions/App/Http/Controllers/Onboarding/StoreAction';
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
        post(OnboardingStoreAction.url());
    };

    const stepLabels = ['Sobre tu consulta', 'Tu primer paciente', 'Ya casi'];

    return (
        <Flex minH="100vh" bg="bg" alignItems="center" justifyContent="center" p="4">
            <Head title="Configurar cuenta — ClientKosmos" />

            <Box w="full" maxW="520px">
                <Box textAlign="center" mb="8">
                    <Flex display="inline-flex" alignItems="center" gap="2" mb="2">
                        <Icon as={Sparkles} boxSize="6" color="brand.solid" />
                        <Text fontSize="2xl" fontWeight="bold" color="fg">ClientKosmos</Text>
                    </Flex>
                    <Text fontSize="md" color="fg.muted">
                        Configuremos tu espacio de trabajo
                    </Text>
                </Box>

                <Flex alignItems="center" gap="2" mb="8">
                    {([1, 2, 3] as OnboardingStep[]).map((s) => (
                        <Flex key={s} alignItems="center" flex="1">
                            <Box
                                h="2"
                                flex="1"
                                borderRadius="full"
                                transition="colors"
                                bg={s <= step ? 'brand.solid' : 'border'}
                            />
                        </Flex>
                    ))}
                </Flex>
                <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" mb="6" textAlign="center">
                    Paso {step} de 3 — {stepLabels[step - 1]}
                </Text>

                <Box borderRadius="xl" borderWidth="1px" borderColor="border" bg="bg.surface" p="8" boxShadow="md">
                    {step === 1 && (
                        <Stack gap="5">
                            <Heading as="h2" fontSize="xl" color="fg">Sobre tu consulta</Heading>
                            <Stack gap="1.5">
                                <Label htmlFor="practice_name">
                                    Nombre de tu consulta <Box as="span" color="error">*</Box>
                                </Label>
                                <Input
                                    id="practice_name"
                                    value={data.practice_name}
                                    onChange={(e) => setData('practice_name', e.target.value)}
                                    placeholder="Ej: Consulta Natalia López"
                                    h="10"
                                />
                                {errors.practice_name && (
                                    <Text fontSize="xs" color="error">{errors.practice_name}</Text>
                                )}
                            </Stack>
                            <Stack gap="1.5">
                                <Label htmlFor="specialty">Especialidad</Label>
                                <chakra.select
                                    id="specialty"
                                    value={data.specialty}
                                    onChange={(e) => setData('specialty', e.target.value)}
                                    w="full"
                                    h="10"
                                    px="3"
                                    bg="bg.surface"
                                    borderWidth="1px"
                                    borderColor="border"
                                    borderRadius="md"
                                    color="fg"
                                    fontSize="md"
                                    _focusVisible={{
                                        outline: 'none',
                                        borderColor: 'brand.solid',
                                        boxShadow: '0 0 0 3px var(--ck-colors-brand-muted)',
                                    }}
                                    transition="border-color, box-shadow"
                                >
                                    <option value="">Seleccionar…</option>
                                    {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                                </chakra.select>
                            </Stack>
                            <Stack gap="1.5">
                                <Label htmlFor="city">Ciudad</Label>
                                <Input
                                    id="city"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Ej: Madrid"
                                    h="10"
                                />
                            </Stack>
                        </Stack>
                    )}

                    {step === 2 && (
                        <Stack gap="5">
                            <Heading as="h2" fontSize="xl" color="fg">Tu primer paciente</Heading>
                            <Text fontSize="sm" color="fg.muted">Puedes hacerlo después si prefieres.</Text>
                            <Stack gap="1.5">
                                <Label htmlFor="p_name">Nombre del paciente</Label>
                                <Input
                                    id="p_name"
                                    value={data.patient.project_name}
                                    onChange={(e) => setData('patient', { ...data.patient, project_name: e.target.value })}
                                    placeholder="Ej: Ana García"
                                    h="10"
                                />
                            </Stack>
                            <Stack gap="1.5">
                                <Label htmlFor="p_scope">Motivo de consulta</Label>
                                <chakra.textarea
                                    id="p_scope"
                                    value={data.patient.service_scope}
                                    onChange={(e) => setData('patient', { ...data.patient, service_scope: e.target.value })}
                                    placeholder="Ej: Ansiedad generalizada, gestión del estrés"
                                    w="full"
                                    minH="80px"
                                    px="3"
                                    py="2"
                                    bg="bg.surface"
                                    borderWidth="1px"
                                    borderColor="border"
                                    borderRadius="md"
                                    color="fg"
                                    fontSize="md"
                                    resize="vertical"
                                    _focusVisible={{
                                        outline: 'none',
                                        borderColor: 'brand.solid',
                                        boxShadow: '0 0 0 3px var(--ck-colors-brand-muted)',
                                    }}
                                    transition="border-color, box-shadow"
                                />
                            </Stack>
                            <Stack gap="1.5">
                                <Label htmlFor="p_tone">Enfoque terapéutico</Label>
                                <Input
                                    id="p_tone"
                                    value={data.patient.brand_tone}
                                    onChange={(e) => setData('patient', { ...data.patient, brand_tone: e.target.value })}
                                    placeholder="Ej: TCC, EMDR, Terapia humanista"
                                    h="10"
                                />
                            </Stack>
                            <Stack gap="1.5">
                                <Label htmlFor="p_deadline">Próxima sesión</Label>
                                <Input
                                    id="p_deadline"
                                    type="date"
                                    value={data.patient.next_deadline}
                                    onChange={(e) => setData('patient', { ...data.patient, next_deadline: e.target.value })}
                                    h="10"
                                />
                            </Stack>
                        </Stack>
                    )}

                    {step === 3 && (
                        <Stack gap="6" textAlign="center">
                            <Flex
                                w="16"
                                h="16"
                                borderRadius="full"
                                bg="brand.muted"
                                alignItems="center"
                                justifyContent="center"
                                mx="auto"
                            >
                                <Icon as={Sparkles} boxSize="8" color="brand.solid" />
                            </Flex>
                            <Box>
                                <Heading as="h2" fontSize="xl" color="fg" mb="2">¡Todo listo!</Heading>
                                <Text fontSize="md" color="fg.muted">
                                    Kosmo te acompañará en cada sesión. Tu consulta está lista para empezar.
                                </Text>
                            </Box>
                            {data.practice_name && (
                                <Stack
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="border.subtle"
                                    bg="bg.muted"
                                    p="4"
                                    textAlign="left"
                                    gap="2"
                                >
                                    <Text fontSize="sm" color="fg">
                                        <Box as="span" color="fg.muted">Consulta:</Box> {data.practice_name}
                                    </Text>
                                    {data.specialty && (
                                        <Text fontSize="sm" color="fg">
                                            <Box as="span" color="fg.muted">Especialidad:</Box> {data.specialty}
                                        </Text>
                                    )}
                                    {data.patient.project_name && (
                                        <Text fontSize="sm" color="fg">
                                            <Box as="span" color="fg.muted">Primer paciente:</Box> {data.patient.project_name}
                                        </Text>
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    )}
                </Box>

                <Flex alignItems="center" justifyContent="space-between" mt="6" gap="4">
                    {step > 1 ? (
                        <Button
                            variant="secondary"
                            onClick={() => setStep((s) => (s - 1) as OnboardingStep)}
                            disabled={processing}
                        >
                            Anterior
                        </Button>
                    ) : (
                        <Box />
                    )}

                    <Flex gap="3">
                        {step === 2 && (
                            <Button
                                variant="ghost"
                                onClick={() => setStep(3)}
                                disabled={processing}
                                color="fg.muted"
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
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
}
