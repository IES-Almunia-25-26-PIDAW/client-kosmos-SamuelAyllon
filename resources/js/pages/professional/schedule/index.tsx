import { Box, Flex, Heading, Icon, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import DestroyAction from '@/actions/App/Http/Controllers/Appointment/DestroyAction';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import schedule from '@/routes/schedule';
import availability from '@/routes/schedule/availability';

interface AppointmentEvent {
    id: number;
    starts_at: string;
    ends_at: string;
    status: string;
    modality: string;
    notes: string | null;
    patient: { id: number; name: string } | null;
    service: { id: number; name: string } | null;
}

interface AvailabilitySlot {
    id: number;
    day_of_week: number | null;
    specific_date: string | null;
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
    is_recurring: boolean;
}

interface Props {
    appointments: AppointmentEvent[];
    recurringSlots: AvailabilitySlot[];
    specificSlots: AvailabilitySlot[];
    from: string;
    to: string;
    view?: ViewMode;
}

type ViewMode = 'semanal' | 'mensual';

interface CalendarEvent {
    type: 'appointment' | 'slot';
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    label: string;
    status?: string;
    appointment?: AppointmentEvent;
    slot?: AvailabilitySlot;
}

const HOUR_START = 7;
const HOUR_END = 20;
const HOUR_HEIGHT = 64;

type StatusCfg = { label: string; palette: string; showDot?: boolean };

const statusConfig: Record<string, StatusCfg> = {
    pending:     { label: 'Pendiente',  palette: 'brand' },
    confirmed:   { label: 'Confirmada', palette: 'green' },
    in_progress: { label: 'En curso',   palette: 'yellow', showDot: true },
    completed:   { label: 'Completada', palette: 'gray' },
    cancelled:   { label: 'Cancelada',  palette: 'red' },
    no_show:     { label: 'No asistió', palette: 'gray' },
};

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function parseLocalDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getWeekDays(from: string): Date[] {
    const start = parseLocalDate(from);
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        return d;
    });
}

function getMonthDays(year: number, month: number): (Date | null)[] {
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7;
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) { cells.push(null); }
    for (let d = 1; d <= lastDay.getDate(); d++) { cells.push(new Date(year, month, d)); }
    while (cells.length % 7 !== 0) { cells.push(null); }
    return cells;
}

function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

function buildCalendarEvents(
    appointments: AppointmentEvent[],
    recurringSlots: AvailabilitySlot[],
    specificSlots: AvailabilitySlot[],
    visibleDates: Date[],
): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    for (const appt of appointments) {
        const dt   = new Date(appt.starts_at);
        const dtE  = new Date(appt.ends_at);
        const date = toDateStr(dt);
        events.push({
            type: 'appointment',
            id: appt.id,
            date,
            startTime: dt.toTimeString().slice(0, 5),
            endTime: dtE.toTimeString().slice(0, 5),
            label: appt.patient?.name ?? 'Paciente',
            status: appt.status,
            appointment: appt,
        });
    }

    for (const slot of specificSlots) {
        if (!slot.specific_date) { continue; }
        events.push({
            type: 'slot',
            id: slot.id,
            date: slot.specific_date,
            startTime: slot.start_time.slice(0, 5),
            endTime: slot.end_time.slice(0, 5),
            label: 'Disponible',
            slot,
        });
    }

    for (const slot of recurringSlots) {
        if (slot.day_of_week === null) { continue; }
        for (const day of visibleDates) {
            const dow = (day.getDay() + 6) % 7;
            if (dow === slot.day_of_week) {
                events.push({
                    type: 'slot',
                    id: slot.id,
                    date: toDateStr(day),
                    startTime: slot.start_time.slice(0, 5),
                    endTime: slot.end_time.slice(0, 5),
                    label: 'Disponible (semanal)',
                    slot,
                });
            }
        }
    }

    return events;
}

function EventBlock({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
    const startMins  = timeToMinutes(event.startTime);
    const endMins    = timeToMinutes(event.endTime);
    const topOffset  = ((startMins - HOUR_START * 60) / 60) * HOUR_HEIGHT;
    const height     = Math.max(((endMins - startMins) / 60) * HOUR_HEIGHT, 20);
    const cfg        = event.status ? (statusConfig[event.status] ?? statusConfig.pending) : null;
    const isSlot     = event.type === 'slot';
    const palette    = isSlot ? 'brand' : (cfg?.palette ?? 'brand');

    return (
        <chakra.button
            onClick={onClick}
            colorPalette={palette}
            position="absolute"
            left="1"
            right="1"
            borderRadius="sm"
            borderLeftWidth="2px"
            borderColor="colorPalette.solid"
            bg="colorPalette.subtle"
            color="colorPalette.fg"
            px="1.5"
            py="0.5"
            textAlign="left"
            transition="opacity"
            _hover={{ opacity: 0.8 }}
            style={{ top: topOffset, height, minHeight: 20, zIndex: 10 }}
        >
            {cfg?.showDot && (
                <Box as="span" mr="1" display="inline-block" boxSize="1.5" borderRadius="full" bg="colorPalette.solid" />
            )}
            {isSlot && <Text as="span" mr="1" fontSize="10px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide" opacity={0.7}>HUECO</Text>}
            {!isSlot && event.status && (
                <Text as="span" mr="1" fontSize="10px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                    {statusConfig[event.status]?.label ?? event.status}
                </Text>
            )}
            <Text display="block" truncate fontSize="xs" fontWeight="medium" lineHeight="tight">{event.label}</Text>
            <Text fontSize="10px" opacity={0.7}>{event.startTime} - {event.endTime}</Text>
        </chakra.button>
    );
}

function CreateSlotDialog({
    open,
    onClose,
    defaultDate,
}: {
    open: boolean;
    onClose: () => void;
    defaultDate: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        date:                  defaultDate,
        start_time:            '09:00',
        end_time:              '10:00',
        slot_duration_minutes: '50',
        is_recurring:          false as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(availability.store.url(), {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent maxWidth={{ base: 'calc(100% - 2rem)', sm: 'md' }}>
                <DialogHeader>
                    <DialogTitle>Nuevo hueco de disponibilidad</DialogTitle>
                </DialogHeader>
                <chakra.form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="4" pt="2">
                    <Stack gap="1.5">
                        <Label htmlFor="slot-date">Fecha</Label>
                        <Input
                            id="slot-date"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            required
                        />
                        {errors.date && <Text fontSize="xs" color="error">{errors.date}</Text>}
                    </Stack>

                    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="3">
                        <Stack gap="1.5">
                            <Label htmlFor="slot-start">Hora de inicio</Label>
                            <Input
                                id="slot-start"
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                required
                            />
                            {errors.start_time && <Text fontSize="xs" color="error">{errors.start_time}</Text>}
                        </Stack>
                        <Stack gap="1.5">
                            <Label htmlFor="slot-end">Hora de fin</Label>
                            <Input
                                id="slot-end"
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                required
                            />
                            {errors.end_time && <Text fontSize="xs" color="error">{errors.end_time}</Text>}
                        </Stack>
                    </Box>

                    <Flex alignItems="center" gap="2.5">
                        <Checkbox
                            id="slot-recurring"
                            checked={data.is_recurring}
                            onCheckedChange={(v) => setData('is_recurring', Boolean(v))}
                        />
                        <Label htmlFor="slot-recurring" cursor="pointer" fontWeight="normal">
                            Se repite cada semana
                        </Label>
                    </Flex>

                    <Flex justifyContent="flex-end" gap="2" pt="1">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="default" disabled={processing}>
                            Guardar hueco
                        </Button>
                    </Flex>
                </chakra.form>
            </DialogContent>
        </Dialog>
    );
}

function EditAppointmentForm({
    appointment,
    onClose,
}: {
    appointment: AppointmentEvent;
    onClose: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm({
        starts_at: appointment.starts_at.slice(0, 16),
        ends_at:   appointment.ends_at.slice(0, 16),
        modality:  appointment.modality,
        notes:     appointment.notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/appointments/${appointment.id}`, { onSuccess: onClose });
    };

    return (
        <chakra.form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="4">
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="3">
                <Stack gap="1.5">
                    <Label>Inicio</Label>
                    <Input type="datetime-local" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} required />
                    {errors.starts_at && <Text fontSize="xs" color="error">{errors.starts_at}</Text>}
                </Stack>
                <Stack gap="1.5">
                    <Label>Fin</Label>
                    <Input type="datetime-local" value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} required />
                    {errors.ends_at && <Text fontSize="xs" color="error">{errors.ends_at}</Text>}
                </Stack>
            </Box>
            <Stack gap="1.5">
                <Label>Modalidad</Label>
                <chakra.select
                    value={data.modality}
                    onChange={(e) => setData('modality', e.target.value)}
                    h="9"
                    w="full"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="border"
                    bg="bg.surface"
                    px="3"
                    py="1"
                    fontSize="sm"
                >
                    <option value="in_person">Presencial</option>
                    <option value="video_call">Videollamada</option>
                </chakra.select>
            </Stack>
            <Stack gap="1.5">
                <Label>Notas</Label>
                <chakra.textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    minH="16"
                    w="full"
                    resize="vertical"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="border"
                    bg="bg.surface"
                    px="3"
                    py="2"
                    fontSize="sm"
                />
            </Stack>
            <Flex justifyContent="flex-end" gap="2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" variant="default" disabled={processing}>Guardar cambios</Button>
            </Flex>
        </chakra.form>
    );
}

function EditSlotForm({
    slot,
    onClose,
}: {
    slot: AvailabilitySlot;
    onClose: () => void;
}) {
    const today = slot.specific_date ?? toDateStr(new Date());
    const { data, setData, put, processing, errors } = useForm({
        date:                  today,
        start_time:            slot.start_time.slice(0, 5),
        end_time:              slot.end_time.slice(0, 5),
        slot_duration_minutes: String(slot.slot_duration_minutes),
        is_recurring:          slot.is_recurring,
        is_active:             true as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(availability.update.url(slot.id), { onSuccess: onClose });
    };

    return (
        <chakra.form onSubmit={handleSubmit} display="flex" flexDirection="column" gap="4">
            <Stack gap="1.5">
                <Label>Fecha</Label>
                <Input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
            </Stack>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="3">
                <Stack gap="1.5">
                    <Label>Hora de inicio</Label>
                    <Input type="time" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} required />
                    {errors.start_time && <Text fontSize="xs" color="error">{errors.start_time}</Text>}
                </Stack>
                <Stack gap="1.5">
                    <Label>Hora de fin</Label>
                    <Input type="time" value={data.end_time} onChange={(e) => setData('end_time', e.target.value)} required />
                    {errors.end_time && <Text fontSize="xs" color="error">{errors.end_time}</Text>}
                </Stack>
            </Box>
            <Flex alignItems="center" gap="2.5">
                <Checkbox
                    id="edit-recurring"
                    checked={data.is_recurring}
                    onCheckedChange={(v) => setData('is_recurring', Boolean(v))}
                />
                <Label htmlFor="edit-recurring" cursor="pointer" fontWeight="normal">
                    Se repite cada semana
                </Label>
            </Flex>
            <Flex justifyContent="flex-end" gap="2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" variant="default" disabled={processing}>Guardar cambios</Button>
            </Flex>
        </chakra.form>
    );
}

function EventDetailDialog({
    event,
    onClose,
}: {
    event: CalendarEvent | null;
    onClose: () => void;
}) {
    const [mode, setMode] = useState<'view' | 'edit'>('view');

    if (!event) { return null; }

    const handleDelete = () => {
        if (event.type === 'appointment') {
            router.delete(DestroyAction.url(event.id), { onSuccess: onClose });
        } else {
            router.delete(availability.destroy.url(event.id), { onSuccess: onClose });
        }
    };

    const cfg = event.status ? (statusConfig[event.status] ?? statusConfig.pending) : null;

    return (
        <Dialog open onOpenChange={(v) => { if (!v) { onClose(); setMode('view'); } }}>
            <DialogContent maxWidth={{ base: 'calc(100% - 2rem)', sm: 'md' }}>
                <DialogHeader>
                    <DialogTitle>
                        {event.type === 'appointment' ? 'Cita' : 'Hueco de disponibilidad'}
                    </DialogTitle>
                </DialogHeader>

                {mode === 'view' && (
                    <Stack gap="4">
                        {event.type === 'appointment' && event.appointment && (
                            <Box borderRadius="md" borderWidth="1px" borderColor="border" bg="bg.muted" p="3" fontSize="sm">
                                {event.appointment.patient && (
                                    <Text fontWeight="medium" color="fg">{event.appointment.patient.name}</Text>
                                )}
                                {event.appointment.service && (
                                    <Text color="fg.muted">{event.appointment.service.name}</Text>
                                )}
                                <Text mt="1" color="fg.muted">
                                    {event.startTime} – {event.endTime}
                                </Text>
                                {cfg && (
                                    <Flex
                                        as="span"
                                        colorPalette={cfg.palette}
                                        mt="2"
                                        display="inline-flex"
                                        alignItems="center"
                                        gap="1.5"
                                        borderRadius="full"
                                        px="2"
                                        py="0.5"
                                        fontSize="xs"
                                        fontWeight="medium"
                                        bg="colorPalette.subtle"
                                        color="colorPalette.fg"
                                    >
                                        {cfg.showDot && <Box as="span" boxSize="1.5" borderRadius="full" bg="colorPalette.solid" />}
                                        {cfg.label}
                                    </Flex>
                                )}
                            </Box>
                        )}

                        {event.type === 'slot' && (
                            <Box borderRadius="md" borderWidth="1px" borderColor="border" bg="bg.muted" p="3" fontSize="sm">
                                <Text fontWeight="medium" color="fg">{event.label}</Text>
                                <Text color="fg.muted">{event.date} · {event.startTime} – {event.endTime}</Text>
                            </Box>
                        )}

                        <Flex justifyContent="space-between">
                            <Button
                                variant="outline-destructive"
                                size="sm"
                                onClick={handleDelete}
                            >
                                <Icon as={Trash2} mr="1.5" boxSize="3.5" />
                                Eliminar
                            </Button>
                            <Button variant="default" size="sm" onClick={() => setMode('edit')}>
                                Editar
                            </Button>
                        </Flex>
                    </Stack>
                )}

                {mode === 'edit' && event.type === 'appointment' && event.appointment && (
                    <EditAppointmentForm appointment={event.appointment} onClose={() => { setMode('view'); onClose(); }} />
                )}

                {mode === 'edit' && event.type === 'slot' && event.slot && (
                    <EditSlotForm slot={event.slot} onClose={() => { setMode('view'); onClose(); }} />
                )}
            </DialogContent>
        </Dialog>
    );
}

function WeeklyCalendar({
    days,
    events,
    onEventClick,
}: {
    days: Date[];
    events: CalendarEvent[];
    onEventClick: (e: CalendarEvent) => void;
}) {
    const today   = toDateStr(new Date());
    const hours   = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);
    const dayKeys = days.map(toDateStr);

    return (
        <Box overflowX="auto" borderRadius="lg" borderWidth="1px" borderColor="border" bg="bg.surface">
            <Box display="grid" borderBottomWidth="1px" borderColor="border" style={{ gridTemplateColumns: `64px repeat(7, 1fr)` }}>
                <Box borderRightWidth="1px" borderColor="border" py="3" />
                {days.map((day, i) => {
                    const isToday = toDateStr(day) === today;
                    return (
                        <Box
                            key={i}
                            borderRightWidth="1px"
                            borderColor="border"
                            py="3"
                            textAlign="center"
                            _last={{ borderRightWidth: '0' }}
                            bg={isToday ? 'brand.muted' : undefined}
                        >
                            <Text fontSize="xs" fontWeight="medium" textTransform="uppercase" letterSpacing="wide" color={isToday ? 'brand.solid' : 'fg.subtle'}>
                                {DAYS_ES[i]}
                            </Text>
                            <Text fontSize="lg" fontWeight="semibold" lineHeight="tight" color={isToday ? 'brand.solid' : 'fg'}>
                                {day.getDate()}
                            </Text>
                        </Box>
                    );
                })}
            </Box>

            <Box position="relative" display="grid" style={{ gridTemplateColumns: `64px repeat(7, 1fr)` }}>
                <Box>
                    {hours.map((h) => (
                        <Box
                            key={h}
                            borderBottomWidth="1px"
                            borderRightWidth="1px"
                            borderColor="border.subtle"
                            pr="2"
                            textAlign="right"
                            style={{ height: HOUR_HEIGHT }}
                        >
                            <Text fontSize="11px" color="fg.subtle">
                                {String(h).padStart(2, '0')}:00
                            </Text>
                        </Box>
                    ))}
                </Box>

                {dayKeys.map((dateKey, colIdx) => {
                    const dayEvents = events.filter((e) => e.date === dateKey);
                    return (
                        <Box
                            key={colIdx}
                            position="relative"
                            borderRightWidth="1px"
                            borderColor="border"
                            _last={{ borderRightWidth: '0' }}
                            style={{ height: (HOUR_END - HOUR_START + 1) * HOUR_HEIGHT }}
                        >
                            {hours.map((h) => (
                                <Box
                                    key={h}
                                    position="absolute"
                                    left="0"
                                    right="0"
                                    borderBottomWidth="1px"
                                    borderColor="border.subtle"
                                    style={{ top: (h - HOUR_START) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                                />
                            ))}
                            {dayEvents.map((ev, ei) => (
                                <EventBlock key={`${ev.type}-${ev.id}-${ei}`} event={ev} onClick={() => onEventClick(ev)} />
                            ))}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

function MonthlyCalendar({
    year,
    month,
    events,
    onEventClick,
}: {
    year: number;
    month: number;
    events: CalendarEvent[];
    onEventClick: (e: CalendarEvent) => void;
}) {
    const cells = getMonthDays(year, month);
    const today = toDateStr(new Date());

    return (
        <Box overflow="hidden" borderRadius="lg" borderWidth="1px" borderColor="border" bg="bg.surface">
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" borderBottomWidth="1px" borderColor="border">
                {DAYS_ES.map((d) => (
                    <Box
                        key={d}
                        borderRightWidth="1px"
                        borderColor="border"
                        py="2"
                        textAlign="center"
                        fontSize="xs"
                        fontWeight="medium"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        color="fg.subtle"
                        _last={{ borderRightWidth: '0' }}
                    >
                        {d}
                    </Box>
                ))}
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)">
                {cells.map((day, i) => {
                    if (!day) {
                        return (
                            <Box
                                key={i}
                                minH="24"
                                borderBottomWidth="1px"
                                borderRightWidth="1px"
                                borderColor="border"
                                bg="bg.muted"
                                _last={{ borderRightWidth: '0' }}
                            />
                        );
                    }
                    const dateKey  = toDateStr(day);
                    const isToday  = dateKey === today;
                    const dayEvts  = events.filter((e) => e.date === dateKey);

                    return (
                        <Box
                            key={i}
                            minH="24"
                            borderBottomWidth="1px"
                            borderRightWidth="1px"
                            borderColor="border"
                            p="1.5"
                            _last={{ borderRightWidth: '0' }}
                            bg={isToday ? 'brand.muted' : undefined}
                        >
                            <Text
                                mb="1"
                                w="6"
                                borderRadius="full"
                                textAlign="center"
                                fontSize="sm"
                                fontWeight="semibold"
                                lineHeight="6"
                                bg={isToday ? 'brand.solid' : undefined}
                                color={isToday ? 'brand.contrast' : 'fg'}
                            >
                                {day.getDate()}
                            </Text>
                            <Stack gap="0.5">
                                {dayEvts.slice(0, 3).map((ev, ei) => {
                                    const cfg    = ev.status ? (statusConfig[ev.status] ?? statusConfig.pending) : null;
                                    const isSlot = ev.type === 'slot';
                                    const palette = isSlot ? 'brand' : (cfg?.palette ?? 'brand');
                                    return (
                                        <chakra.button
                                            key={`${ev.type}-${ev.id}-${ei}`}
                                            onClick={() => onEventClick(ev)}
                                            colorPalette={palette}
                                            w="full"
                                            truncate
                                            borderRadius="sm"
                                            px="1"
                                            py="0.5"
                                            textAlign="left"
                                            fontSize="11px"
                                            fontWeight="medium"
                                            transition="opacity"
                                            bg="colorPalette.subtle"
                                            color="colorPalette.fg"
                                            _hover={{ opacity: 0.8 }}
                                        >
                                            {ev.startTime} {ev.label}
                                        </chakra.button>
                                    );
                                })}
                                {dayEvts.length > 3 && (
                                    <Text fontSize="10px" color="fg.subtle">+{dayEvts.length - 3} más</Text>
                                )}
                            </Stack>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

export default function ScheduleIndex({ appointments, recurringSlots, specificSlots, from, to, view: initialView = 'semanal' }: Props) {
    const [view, setView]                   = useState<ViewMode>(initialView);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [createOpen, setCreateOpen]       = useState(false);

    const fromDate  = parseLocalDate(from);
    const weekDays  = getWeekDays(from);
    const monthYear = fromDate.getFullYear();
    const monthIdx  = fromDate.getMonth();

    const visibleDates = view === 'semanal'
        ? weekDays
        : getMonthDays(monthYear, monthIdx).filter(Boolean) as Date[];

    const allEvents = buildCalendarEvents(appointments, recurringSlots, specificSlots, visibleDates);

    const navigate = (dir: -1 | 1) => {
        if (view === 'semanal') {
            const newFrom = new Date(fromDate);
            newFrom.setDate(newFrom.getDate() + dir * 7);
            const newTo = new Date(newFrom);
            newTo.setDate(newTo.getDate() + 6);
            router.get(schedule.index.url({ query: { from: toDateStr(newFrom), to: toDateStr(newTo), view: 'semanal' } }), {}, { preserveState: false });
        } else {
            const newDate = new Date(monthYear, monthIdx + dir, 1);
            const newFrom = toDateStr(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            const newTo   = toDateStr(new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0));
            router.get(schedule.index.url({ query: { from: newFrom, to: newTo, view: 'mensual' } }), {}, { preserveState: false });
        }
    };

    const monthLabel = `${MONTHS_ES[monthIdx]} ${monthYear}`;
    const weekLabel  = (() => {
        const endDate = parseLocalDate(to);
        return `${fromDate.getDate()} – ${endDate.getDate()} de ${MONTHS_ES[endDate.getMonth()]}, ${endDate.getFullYear()}`;
    })();

    const defaultDate = view === 'semanal' ? from : toDateStr(fromDate);

    return (
        <>
            <Head title="Calendario — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }}>
                <Box>
                    <Heading as="h1" fontSize="3xl" color="fg">Calendario</Heading>
                    <Text mt="1" fontSize="md" color="fg.muted">Organiza tus horas de disponibilidad</Text>
                </Box>

                <Flex flexWrap="wrap" justifyContent="center" alignItems="center" gap="3">
                    <Flex alignItems="center" borderRadius="full" borderWidth="1px" borderColor="border" bg="bg.surface" p="1">
                        <chakra.button
                            onClick={() => {
                                setView('semanal');
                                router.get(schedule.index.url({ query: { from: toDateStr(fromDate), to, view: 'semanal' } }), {}, { preserveState: false });
                            }}
                            borderRadius="full"
                            px="4"
                            py="1.5"
                            fontSize="sm"
                            fontWeight="medium"
                            transition="colors"
                            bg={view === 'semanal' ? 'bg.surface' : 'transparent'}
                            boxShadow={view === 'semanal' ? 'sm' : undefined}
                            color={view === 'semanal' ? 'fg' : 'fg.muted'}
                            _hover={view !== 'semanal' ? { color: 'fg' } : undefined}
                        >
                            Semanal
                        </chakra.button>
                        <chakra.button
                            onClick={() => {
                                setView('mensual');
                                const newFrom = toDateStr(new Date(monthYear, monthIdx, 1));
                                const newTo   = toDateStr(new Date(monthYear, monthIdx + 1, 0));
                                router.get(schedule.index.url({ query: { from: newFrom, to: newTo, view: 'mensual' } }), {}, { preserveState: false });
                            }}
                            borderRadius="full"
                            px="4"
                            py="1.5"
                            fontSize="sm"
                            fontWeight="medium"
                            transition="colors"
                            bg={view === 'mensual' ? 'bg.surface' : 'transparent'}
                            boxShadow={view === 'mensual' ? 'sm' : undefined}
                            color={view === 'mensual' ? 'fg' : 'fg.muted'}
                            _hover={view !== 'mensual' ? { color: 'fg' } : undefined}
                        >
                            Mensual
                        </chakra.button>
                    </Flex>

                    <chakra.button
                        onClick={() => setCreateOpen(true)}
                        display="flex"
                        boxSize="9"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        bg="brand.solid"
                        color="brand.contrast"
                        boxShadow="sm"
                        transition="colors"
                        _hover={{ bg: 'brand.emphasized' }}
                        aria-label="Añadir hueco"
                    >
                        <Icon as={Plus} boxSize="5" />
                    </chakra.button>
                </Flex>

                <Flex alignItems="center" justifyContent="space-between">
                    <Flex alignItems="center" gap="2">
                        <chakra.button
                            onClick={() => navigate(-1)}
                            display="flex"
                            boxSize="8"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius="full"
                            borderWidth="1px"
                            borderColor="border"
                            _hover={{ bg: 'bg.muted' }}
                        >
                            <Icon as={ChevronLeft} boxSize="4" />
                        </chakra.button>
                        <chakra.button
                            onClick={() => navigate(1)}
                            display="flex"
                            boxSize="8"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius="full"
                            borderWidth="1px"
                            borderColor="border"
                            _hover={{ bg: 'bg.muted' }}
                        >
                            <Icon as={ChevronRight} boxSize="4" />
                        </chakra.button>
                        <Text fontSize="md" fontWeight="semibold" color="fg">
                            {view === 'semanal' ? weekLabel : monthLabel}
                        </Text>
                    </Flex>

                    <Text
                        borderRadius="full"
                        borderWidth="1px"
                        borderColor="border"
                        px="3"
                        py="1"
                        fontSize="xs"
                        fontWeight="medium"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        color="fg.muted"
                    >
                        {view === 'semanal' ? `${MONTHS_ES[monthIdx].toUpperCase()} ${monthYear}` : String(monthYear)}
                    </Text>
                </Flex>

                {view === 'semanal' && (
                    <WeeklyCalendar
                        days={weekDays}
                        events={allEvents}
                        onEventClick={setSelectedEvent}
                    />
                )}

                {view === 'mensual' && (
                    <MonthlyCalendar
                        year={monthYear}
                        month={monthIdx}
                        events={allEvents}
                        onEventClick={setSelectedEvent}
                    />
                )}
            </Stack>

            <CreateSlotDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                defaultDate={defaultDate}
            />

            {selectedEvent && (
                <EventDetailDialog
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </>
    );
}

ScheduleIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
