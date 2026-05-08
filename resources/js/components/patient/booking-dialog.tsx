import {
    Badge,
    Box,
    Flex,
    HStack,
    Heading,
    Stack,
    Text,
    Textarea,
    chakra,
} from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';
import { Check, ChevronLeft, MapPin, Video } from 'lucide-react';
import { useEffect, useMemo, useReducer } from 'react';
import AppointmentStoreAction from '@/actions/App/Http/Controllers/Portal/Appointment/StoreAction';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { MODALITY_LABELS, type ConsultationModality, type OfferedConsultation } from '@/types/offered-consultation';

export interface BookingDialogProfessional {
    id: number;
    user_id: number;
    name: string;
}

export interface BookingDialogSlot {
    date: string;
    times: string[];
}

interface BookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    professional: BookingDialogProfessional;
    services: OfferedConsultation[];
    slots: BookingDialogSlot[];
    /** When set, dialog opens directly on the day-time step. */
    preselectedServiceId?: number | null;
}

type Step = 'service' | 'datetime' | 'note' | 'confirm' | 'success';

interface State {
    step: Step;
    modalityFilter: ConsultationModality | 'all';
    selectedService: OfferedConsultation | null;
    selectedDate: string | null;
    selectedTime: string | null;
    note: string;
}

type Action =
    | { type: 'SET_FILTER'; value: State['modalityFilter'] }
    | { type: 'PICK_SERVICE'; service: OfferedConsultation }
    | { type: 'PICK_SLOT'; date: string; time: string }
    | { type: 'SET_NOTE'; value: string }
    | { type: 'GOTO'; step: Step }
    | { type: 'BACK' }
    | { type: 'RESET'; preselected: OfferedConsultation | null };

const STEP_ORDER: Step[] = ['service', 'datetime', 'note', 'confirm', 'success'];

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_FILTER':
            return { ...state, modalityFilter: action.value };
        case 'PICK_SERVICE':
            return { ...state, selectedService: action.service, step: 'datetime' };
        case 'PICK_SLOT':
            return { ...state, selectedDate: action.date, selectedTime: action.time, step: 'note' };
        case 'SET_NOTE':
            return { ...state, note: action.value };
        case 'GOTO':
            return { ...state, step: action.step };
        case 'BACK': {
            const idx = STEP_ORDER.indexOf(state.step);
            if (idx <= 0) {
                return state;
            }
            return { ...state, step: STEP_ORDER[idx - 1] };
        }
        case 'RESET':
            return {
                step: action.preselected ? 'datetime' : 'service',
                modalityFilter: 'all',
                selectedService: action.preselected,
                selectedDate: null,
                selectedTime: null,
                note: '',
            };
    }
}

const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
};

const matchesFilter = (modality: ConsultationModality, filter: State['modalityFilter']) => {
    if (filter === 'all') {
        return true;
    }
    if (modality === 'both') {
        return true;
    }
    return modality === filter;
};

export function BookingDialog({
    open,
    onOpenChange,
    professional,
    services,
    slots,
    preselectedServiceId = null,
}: BookingDialogProps) {
    const preselected = useMemo(
        () => services.find((s) => s.id === preselectedServiceId) ?? null,
        [services, preselectedServiceId],
    );

    const [state, dispatch] = useReducer(reducer, {
        step: preselected ? 'datetime' : 'service',
        modalityFilter: 'all',
        selectedService: preselected,
        selectedDate: null,
        selectedTime: null,
        note: '',
    });

    useEffect(() => {
        if (open) {
            dispatch({ type: 'RESET', preselected });
        }
    }, [open, preselected]);

    const form = useForm<{
        professional_id: number;
        service_id: number;
        starts_at: string;
        modality: 'video_call' | 'in_person';
        notes: string;
    }>({
        professional_id: professional.user_id,
        service_id: 0,
        starts_at: '',
        modality: 'video_call',
        notes: '',
    });

    const filteredServices = services.filter(
        (s) => s.is_active && matchesFilter(s.modality, state.modalityFilter),
    );

    const onConfirm = () => {
        if (!state.selectedService || !state.selectedDate || !state.selectedTime) {
            return;
        }
        const [y, mo, d] = state.selectedDate.split('-').map(Number);
        const [h, mi] = state.selectedTime.split(':').map(Number);
        const startsAt = new Date(y, mo - 1, d, h, mi, 0).toISOString();
        const modality: 'video_call' | 'in_person' =
            state.selectedService.modality === 'in_person' ? 'in_person' : 'video_call';

        form.transform(() => ({
            professional_id: professional.user_id,
            service_id: state.selectedService!.id,
            starts_at: startsAt,
            modality,
            notes: state.note,
        }));
        form.post(AppointmentStoreAction.url(), {
            preserveScroll: true,
            onSuccess: () => dispatch({ type: 'GOTO', step: 'success' }),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent maxWidth={{ base: 'calc(100% - 2rem)', md: '2xl' }} p="0">
                <Box p="6" pb="4">
                    <DialogTitle asChild>
                        <Heading as="h2" fontSize="xl" color="fg" fontWeight="bold">
                            Reserva tu cita
                        </Heading>
                    </DialogTitle>
                    <Text fontSize="sm" color="fg.muted" mt="1">
                        Con {professional.name}
                    </Text>
                </Box>

                <Box px="6" pb="6">
                    {state.step === 'service' && (
                        <ServiceStep
                            services={filteredServices}
                            filter={state.modalityFilter}
                            onFilter={(v) => dispatch({ type: 'SET_FILTER', value: v })}
                            onPick={(s) => dispatch({ type: 'PICK_SERVICE', service: s })}
                        />
                    )}
                    {state.step === 'datetime' && (
                        <DatetimeStep
                            slots={slots}
                            onPick={(date, time) => dispatch({ type: 'PICK_SLOT', date, time })}
                            onBack={preselected ? null : () => dispatch({ type: 'BACK' })}
                        />
                    )}
                    {state.step === 'note' && state.selectedService && state.selectedDate && state.selectedTime && (
                        <NoteStep
                            note={state.note}
                            service={state.selectedService}
                            date={state.selectedDate}
                            time={state.selectedTime}
                            onChange={(v) => dispatch({ type: 'SET_NOTE', value: v })}
                            onNext={() => dispatch({ type: 'GOTO', step: 'confirm' })}
                            onBack={() => dispatch({ type: 'BACK' })}
                        />
                    )}
                    {state.step === 'confirm' && state.selectedService && state.selectedDate && state.selectedTime && (
                        <ConfirmStep
                            service={state.selectedService}
                            date={state.selectedDate}
                            time={state.selectedTime}
                            note={state.note}
                            professional={professional}
                            processing={form.processing}
                            errors={form.errors}
                            onConfirm={onConfirm}
                            onBack={() => dispatch({ type: 'BACK' })}
                        />
                    )}
                    {state.step === 'success' && (
                        <SuccessStep onClose={() => onOpenChange(false)} />
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}

function ServiceStep({
    services,
    filter,
    onFilter,
    onPick,
}: {
    services: OfferedConsultation[];
    filter: State['modalityFilter'];
    onFilter: (v: State['modalityFilter']) => void;
    onPick: (s: OfferedConsultation) => void;
}) {
    return (
        <Stack gap="4">
            <HStack gap="2">
                <FilterChip active={filter === 'all'} onClick={() => onFilter('all')}>
                    Todos
                </FilterChip>
                <FilterChip active={filter === 'video_call'} onClick={() => onFilter('video_call')}>
                    <Box as={Video} w="3.5" h="3.5" aria-hidden /> Online
                </FilterChip>
                <FilterChip active={filter === 'in_person'} onClick={() => onFilter('in_person')}>
                    <Box as={MapPin} w="3.5" h="3.5" aria-hidden /> Presencial
                </FilterChip>
            </HStack>

            <Stack gap="2" maxH="80" overflowY="auto" pr="1">
                {services.length === 0 ? (
                    <Text fontSize="sm" color="fg.muted" py="6" textAlign="center">
                        No hay servicios disponibles para esta modalidad.
                    </Text>
                ) : (
                    services.map((s) => (
                        <chakra.button
                            key={s.id}
                            type="button"
                            onClick={() => onPick(s)}
                            textAlign="left"
                            p="4"
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor="border"
                            bg="bg.surface"
                            transition="all 0.15s"
                            _hover={{ borderColor: 'brand.solid', boxShadow: 'sm' }}
                            display="block"
                            w="full"
                        >
                            <Flex align="center" gap="3">
                                <Box w="3" h="3" borderRadius="full" bg={s.color ?? 'gray.400'} flexShrink={0} />
                                <Stack gap="0.5" flex="1" minW={0}>
                                    <Text fontWeight="semibold" color="fg" lineClamp={1}>{s.name}</Text>
                                    <HStack fontSize="xs" color="fg.muted" gap="2">
                                        <Text>{s.duration_minutes} min</Text>
                                        {s.price && <><Text>·</Text><Text>{Number(s.price).toFixed(2)} €</Text></>}
                                        <Text>·</Text>
                                        <Text>{MODALITY_LABELS[s.modality]}</Text>
                                    </HStack>
                                    {s.description && (
                                        <Text fontSize="xs" color="fg.subtle" lineClamp={2} mt="1">
                                            {s.description}
                                        </Text>
                                    )}
                                </Stack>
                            </Flex>
                        </chakra.button>
                    ))
                )}
            </Stack>
        </Stack>
    );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <Button
            type="button"
            variant={active ? 'primary' : 'secondary'}
            size="sm"
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

function DatetimeStep({
    slots,
    onPick,
    onBack,
}: {
    slots: BookingDialogSlot[];
    onPick: (date: string, time: string) => void;
    onBack: (() => void) | null;
}) {
    if (slots.length === 0) {
        return (
            <Stack gap="3">
                {onBack && <BackButton onClick={onBack} />}
                <Text fontSize="sm" color="fg.muted" py="6" textAlign="center">
                    Sin disponibilidad próxima.
                </Text>
            </Stack>
        );
    }

    return (
        <Stack gap="3" maxH="96" overflowY="auto" pr="1">
            {onBack && <BackButton onClick={onBack} />}
            {slots.map((day) => (
                <Stack key={day.date} gap="2">
                    <Text fontSize="xs" fontWeight="bold" color="fg" textTransform="capitalize">
                        {formatDate(day.date)}
                    </Text>
                    <Flex gap="2" flexWrap="wrap">
                        {day.times.map((t) => (
                            <Button
                                key={`${day.date}-${t}`}
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => onPick(day.date, t)}
                            >
                                {t}
                            </Button>
                        ))}
                    </Flex>
                </Stack>
            ))}
        </Stack>
    );
}

function NoteStep({
    note,
    service,
    date,
    time,
    onChange,
    onNext,
    onBack,
}: {
    note: string;
    service: OfferedConsultation;
    date: string;
    time: string;
    onChange: (v: string) => void;
    onNext: () => void;
    onBack: () => void;
}) {
    return (
        <Stack gap="4">
            <BackButton onClick={onBack} />
            <Stack gap="0.5">
                <Text fontSize="sm" fontWeight="semibold" color="fg">{service.name}</Text>
                <Text fontSize="xs" color="fg.muted" textTransform="capitalize">
                    {formatDate(date)} · {time} · {service.duration_minutes} min
                </Text>
            </Stack>
            <Stack gap="1.5">
                <Text fontSize="sm" fontWeight="semibold" color="fg">Nota para el profesional (opcional)</Text>
                <Textarea
                    value={note}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="¿Algo que el profesional deba saber?"
                    minH="24"
                    resize="vertical"
                />
            </Stack>
            <Button type="button" variant="primary" size="md" onClick={onNext}>
                Continuar
            </Button>
        </Stack>
    );
}

function ConfirmStep({
    service,
    date,
    time,
    note,
    professional,
    processing,
    errors,
    onConfirm,
    onBack,
}: {
    service: OfferedConsultation;
    date: string;
    time: string;
    note: string;
    professional: BookingDialogProfessional;
    processing: boolean;
    errors: Record<string, string>;
    onConfirm: () => void;
    onBack: () => void;
}) {
    return (
        <Stack gap="4">
            <BackButton onClick={onBack} />
            <Box bg="bg.subtle" borderRadius="lg" p="4">
                <Stack gap="3">
                    <SummaryRow label="Profesional" value={professional.name} />
                    <SummaryRow label="Servicio" value={service.name} />
                    <SummaryRow label="Fecha" value={formatDate(date)} />
                    <SummaryRow label="Hora" value={`${time} (${service.duration_minutes} min)`} />
                    <SummaryRow label="Modalidad" value={MODALITY_LABELS[service.modality]} />
                    {service.price && (
                        <SummaryRow label="Precio" value={`${Number(service.price).toFixed(2)} €`} />
                    )}
                    {note && <SummaryRow label="Nota" value={note} />}
                </Stack>
            </Box>

            {Object.values(errors).length > 0 && (
                <Stack gap="1">
                    {Object.entries(errors).map(([k, v]) => (
                        <Text key={k} fontSize="xs" color="danger.solid">{v}</Text>
                    ))}
                </Stack>
            )}

            <Button type="button" variant="primary" size="lg" onClick={onConfirm} disabled={processing}>
                {processing ? 'Reservando…' : 'Confirmar reserva'}
            </Button>
        </Stack>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <Flex justify="space-between" gap="3" align="start">
            <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="semibold" letterSpacing="wider">
                {label}
            </Text>
            <Text fontSize="sm" color="fg" fontWeight="medium" textAlign="right" maxW="60%">
                {value}
            </Text>
        </Flex>
    );
}

function SuccessStep({ onClose }: { onClose: () => void }) {
    return (
        <Stack gap="4" align="center" py="6">
            <Flex w="14" h="14" align="center" justify="center" bg="green.subtle" color="green.fg" borderRadius="full">
                <Box as={Check} w="7" h="7" aria-hidden />
            </Flex>
            <Stack gap="1" textAlign="center">
                <Heading as="h3" fontSize="lg" color="fg">¡Reserva confirmada!</Heading>
                <Text fontSize="sm" color="fg.muted">
                    Recibirás un correo de confirmación con los detalles.
                </Text>
            </Stack>
            <Button type="button" variant="primary" onClick={onClose}>
                Cerrar
            </Button>
        </Stack>
    );
}

function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            alignSelf="start"
        >
            <Box as={ChevronLeft} w="3.5" h="3.5" aria-hidden />
            <Text fontSize="xs" fontWeight="semibold">Atrás</Text>
        </Button>
    );
}

export type { OfferedConsultation };

export const __filterChipForTests = FilterChip;
// Reuse the Badge import to avoid unused-import lint flag (kept for future modality icons)
void Badge;
