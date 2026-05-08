import {
    Flex,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    Textarea,
    chakra,
} from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    DEFAULT_CONSULTATION,
    MODALITY_LABELS,
    type ConsultationModality,
    type OfferedConsultation,
    type OfferedConsultationFormData,
} from '@/types/offered-consultation';

interface FormOfferedConsultationsProps {
    initial?: Partial<OfferedConsultation>;
    submitUrl: string;
    method: 'post' | 'put';
    submitLabel: string;
    onCancelHref?: string;
}

const PRESET_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9'];

const toFormData = (initial: Partial<OfferedConsultation> | undefined): OfferedConsultationFormData => ({
    name: initial?.name ?? DEFAULT_CONSULTATION.name,
    description: initial?.description ?? DEFAULT_CONSULTATION.description,
    duration_minutes: initial?.duration_minutes ?? DEFAULT_CONSULTATION.duration_minutes,
    price: initial?.price?.toString() ?? DEFAULT_CONSULTATION.price,
    color: initial?.color ?? DEFAULT_CONSULTATION.color,
    is_active: initial?.is_active ?? DEFAULT_CONSULTATION.is_active,
    modality: (initial?.modality as ConsultationModality | undefined) ?? DEFAULT_CONSULTATION.modality,
});

export function FormOfferedConsultations({
    initial,
    submitUrl,
    method,
    submitLabel,
    onCancelHref,
}: FormOfferedConsultationsProps) {
    const form = useForm<OfferedConsultationFormData>(toFormData(initial));

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (method === 'post') {
            form.post(submitUrl);
        } else {
            form.put(submitUrl);
        }
    };

    const setField = (key: keyof OfferedConsultationFormData, value: unknown) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.setData(key as any, value as any);

    return (
        <chakra.form onSubmit={onSubmit} display="flex" flexDirection="column" gap="6" maxW="3xl">
            <Field label="Nombre" error={form.errors.name} required>
                <Input
                    value={form.data.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField('name', e.target.value)}
                    placeholder="Sesión individual de psicología"
                    autoFocus
                />
            </Field>

            <Field label="Descripción" error={form.errors.description}>
                <Textarea
                    value={form.data.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setField('description', e.target.value)}
                    placeholder="Sesión cognitivo-conductual de 50 minutos."
                    minH="28"
                    resize="vertical"
                />
            </Field>

            <Flex gap="4" flexDirection={{ base: 'column', md: 'row' }}>
                <Field label="Duración (min)" error={form.errors.duration_minutes} required flex="1">
                    <Input
                        type="number"
                        min={5}
                        max={480}
                        value={form.data.duration_minutes}
                        onChange={(e) => setField('duration_minutes', Number(e.target.value))}
                    />
                </Field>
                <Field label="Precio (€)" error={form.errors.price} flex="1">
                    <Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={form.data.price}
                        onChange={(e) => setField('price', e.target.value)}
                        placeholder="70.00"
                    />
                </Field>
            </Flex>

            <Field label="Modalidad" error={form.errors.modality} required>
                <HStack gap="2" flexWrap="wrap">
                    {(Object.keys(MODALITY_LABELS) as ConsultationModality[]).map((m) => (
                        <Button
                            key={m}
                            type="button"
                            variant={form.data.modality === m ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setField('modality', m)}
                        >
                            {MODALITY_LABELS[m]}
                        </Button>
                    ))}
                </HStack>
            </Field>

            <Field label="Color de etiqueta" error={form.errors.color}>
                <HStack gap="2">
                    {PRESET_COLORS.map((c) => (
                        <chakra.button
                            key={c}
                            type="button"
                            onClick={() => setField('color', c)}
                            w="8"
                            h="8"
                            borderRadius="full"
                            bg={c}
                            borderWidth="2px"
                            borderColor={form.data.color === c ? 'fg' : 'transparent'}
                            aria-label={`Color ${c}`}
                        />
                    ))}
                    <Input
                        value={form.data.color}
                        onChange={(e) => setField('color', e.target.value)}
                        w="32"
                        size="sm"
                    />
                </HStack>
            </Field>

            <Flex align="center" gap="3">
                <input
                    id="is_active"
                    type="checkbox"
                    checked={form.data.is_active}
                    onChange={(e) => setField('is_active', e.target.checked)}
                    style={{ width: 18, height: 18 }}
                />
                <chakra.label htmlFor="is_active" fontSize="sm" color="fg">
                    Servicio activo (visible para pacientes al reservar)
                </chakra.label>
            </Flex>

            <HStack gap="3" pt="2">
                <Button type="submit" variant="primary" disabled={form.processing}>
                    {form.processing ? 'Guardando…' : submitLabel}
                </Button>
                {onCancelHref && (
                    <Button as="a" variant="ghost" {...({ href: onCancelHref } as object)}>
                        Cancelar
                    </Button>
                )}
            </HStack>
        </chakra.form>
    );
}

interface FieldProps {
    label: string;
    error?: string;
    required?: boolean;
    flex?: string;
    children: React.ReactNode;
}

function Field({ label, error, required, flex, children }: FieldProps) {
    return (
        <Stack gap="1.5" flex={flex}>
            <Flex gap="1" align="center">
                <Heading as="h3" fontSize="sm" fontWeight="semibold" color="fg">
                    {label}
                </Heading>
                {required && <Text fontSize="sm" color="danger.solid">*</Text>}
            </Flex>
            {children}
            {error && (
                <Text fontSize="xs" color="danger.solid">
                    {error}
                </Text>
            )}
        </Stack>
    );
}
