import {
    Box,
    chakra,
    Flex,
    HStack,
    Icon,
    RadioCard,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import { Check } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
        <chakra.form onSubmit={onSubmit} display="flex" flexDirection="column" gap="4" minW="0">
            {/* Campos principales */}
            <Stack
                gap="3.5"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                bg="bg.muted/40"
                p="3.5"
                minW="0"
            >
                <Stack gap="1.5" minW="0">
                    <Label htmlFor="name">
                        Nombre <Box as="span" color="danger.solid">*</Box>
                    </Label>
                    <Input
                        id="name"
                        value={form.data.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setField('name', e.target.value)}
                        placeholder="Sesión individual de psicología"
                        h="10"
                        width="auto"
                        autoFocus
                    />
                    {form.errors.name && (
                        <Text fontSize="xs" color="danger.solid">{form.errors.name}</Text>
                    )}
                </Stack>

                <Stack gap="1.5" minW="0">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                        id="description"
                        value={form.data.description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setField('description', e.target.value)}
                        placeholder="Sesión cognitivo-conductual de 50 minutos."
                        minH="80px"
                        resize="vertical"
                        width="auto"
                    />
                    {form.errors.description && (
                        <Text fontSize="xs" color="danger.solid">{form.errors.description}</Text>
                    )}
                </Stack>

                <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="3">
                    <Stack gap="1.5" minW="0">
                        <Label htmlFor="duration_minutes">
                            Duración (min) <Box as="span" color="danger.solid">*</Box>
                        </Label>
                        <Input
                            id="duration_minutes"
                            type="number"
                            min={5}
                            max={480}
                            width="auto"
                            value={form.data.duration_minutes}
                            onChange={(e) => setField('duration_minutes', Number(e.target.value))}
                            h="10"
                        />
                        {form.errors.duration_minutes && (
                            <Text fontSize="xs" color="danger.solid">{form.errors.duration_minutes}</Text>
                        )}
                    </Stack>
                    <Stack gap="1.5" minW="0">
                        <Label htmlFor="price">Precio (€)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min={0}
                            value={form.data.price}
                            onChange={(e) => setField('price', e.target.value)}
                            placeholder="70.00"
                            width="auto"
                            h="10"
                        />
                        {form.errors.price && (
                            <Text fontSize="xs" color="danger.solid">{form.errors.price}</Text>
                        )}
                    </Stack>
                </Box>

                <Stack gap="1.5" minW="0">
                    <Label>
                        Modalidad <Box as="span" color="danger.solid">*</Box>
                    </Label>
                    <RadioCard.Root
                        value={form.data.modality}
                        onValueChange={({ value }) => { if (value) { setField('modality', value); } }}
                        colorPalette="brand"
                        size="sm"
                    >
                        <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="2">
                            {(Object.keys(MODALITY_LABELS) as ConsultationModality[]).map((m) => (
                                <RadioCard.Item key={m} value={m}>
                                    <RadioCard.ItemHiddenInput />
                                    <RadioCard.ItemControl>
                                        <RadioCard.ItemText>{MODALITY_LABELS[m]}</RadioCard.ItemText>
                                        <RadioCard.ItemIndicator />
                                    </RadioCard.ItemControl>
                                </RadioCard.Item>
                            ))}
                        </Box>
                    </RadioCard.Root>
                    {form.errors.modality && (
                        <Text fontSize="xs" color="danger.solid">{form.errors.modality}</Text>
                    )}
                </Stack>

                <Stack gap="1.5" minW="0">
                    <Label htmlFor="color_input">Color de etiqueta</Label>
                    <HStack gap="2" flexWrap="wrap">
                        {PRESET_COLORS.map((c) => (
                            <chakra.button
                                key={c}
                                type="button"
                                onClick={() => setField('color', c)}
                                position="relative"
                                w="8"
                                h="8"
                                borderRadius="full"
                                bg={c}
                                borderWidth="2px"
                                borderColor={form.data.color === c ? 'fg' : 'transparent'}
                                aria-label={`Color ${c}`}
                                transition="transform 0.12s"
                                _hover={{ transform: 'scale(1.15)' }}
                            >
                                {form.data.color === c && (
                                    <Icon
                                        as={Check}
                                        boxSize="3.5"
                                        color="white"
                                        position="absolute"
                                        top="50%"
                                        left="50%"
                                        transform="translate(-50%, -50%)"
                                        pointerEvents="none"
                                    />
                                )}
                            </chakra.button>
                        ))}
                        <Input
                            id="color_input"
                            value={form.data.color}
                            onChange={(e) => setField('color', e.target.value)}
                            w="32"
                            size="sm"
                            width="auto"
                            placeholder="#6366f1"
                        />
                    </HStack>
                    {form.errors.color && (
                        <Text fontSize="xs" color="danger.solid">{form.errors.color}</Text>
                    )}
                </Stack>
            </Stack>

            {/* Servicio activo — checkbox tipo tarjeta */}
            <Checkbox
                checked={form.data.is_active}
                onCheckedChange={(e) => setField('is_active', !!e.checked)}
                gap="3"
                alignItems="flex-start"
                cursor="pointer"
                borderWidth="1px"
                borderColor={form.data.is_active ? 'brand.solid' : 'border'}
                borderRadius="md"
                bg={form.data.is_active ? 'brand.subtle' : 'bg'}
                px="3.5"
                py="2.5"
                transition="all 0.15s"
                _hover={{ borderColor: 'brand.solid', bg: 'brand.subtle' }}
            >
                <Box minW="0" flex="1">
                    <Text fontSize="sm" fontWeight="medium" color="fg">
                        Servicio activo
                    </Text>
                    <Text fontSize="xs" color="fg.muted" fontWeight="normal">
                        Visible para pacientes al reservar
                    </Text>
                </Box>
            </Checkbox>

            <Flex justifyContent="flex-end" gap="2" pt="1">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onCancelHref ? window.location.assign(onCancelHref) : window.history.back()}
                    disabled={form.processing}
                >
                    Cancelar
                </Button>
                <Button type="submit" variant="default" disabled={form.processing} loading={form.processing}>
                    {submitLabel}
                </Button>
            </Flex>
        </chakra.form>
    );
}
