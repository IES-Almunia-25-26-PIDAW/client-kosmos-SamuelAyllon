import { Head, router, useForm } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import DestroyAction from '@/actions/App/Http/Controllers/Appointment/DestroyAction';
import availability from '@/routes/schedule/availability';
import schedule from '@/routes/schedule';

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

const statusConfig: Record<string, { label: string; bg: string; border: string; text: string; dot?: string }> = {
    pending:     { label: 'Pendiente',  bg: 'bg-[var(--color-primary-subtle)]',  border: 'border-[var(--color-primary)]',  text: 'text-[var(--color-primary-fg)]' },
    confirmed:   { label: 'Confirmada', bg: 'bg-[var(--color-success-subtle)]',  border: 'border-[var(--color-success)]',  text: 'text-[var(--color-success-fg)]' },
    in_progress: { label: 'En curso',   bg: 'bg-[var(--color-warning-subtle)]',  border: 'border-[var(--color-warning)]',  text: 'text-[var(--color-warning-fg)]', dot: 'bg-[var(--color-warning)]' },
    completed:   { label: 'Completada', bg: 'bg-[var(--color-surface-alt)]',     border: 'border-[var(--color-border)]',   text: 'text-[var(--color-text-secondary)]' },
    cancelled:   { label: 'Cancelada',  bg: 'bg-[var(--color-error-subtle)]',    border: 'border-[var(--color-error)]',    text: 'text-[var(--color-error-fg)]' },
    no_show:     { label: 'No asistió', bg: 'bg-[var(--color-surface-alt)]',     border: 'border-[var(--color-border)]',   text: 'text-[var(--color-text-muted)]' },
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
    const today = new Date();

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

    const bg     = isSlot ? 'bg-[var(--color-primary-subtle)]' : (cfg?.bg ?? 'bg-[var(--color-primary-subtle)]');
    const border = isSlot ? 'border-[var(--color-primary)]' : (cfg?.border ?? 'border-[var(--color-primary)]');
    const text   = isSlot ? 'text-[var(--color-primary-fg)]' : (cfg?.text ?? 'text-[var(--color-primary-fg)]');

    return (
        <button
            onClick={onClick}
            className={`absolute left-1 right-1 rounded-[var(--radius-sm)] border-l-2 px-1.5 py-0.5 text-left transition-opacity hover:opacity-80 ${bg} ${border} ${text}`}
            style={{ top: topOffset, height, minHeight: 20, zIndex: 10 }}
        >
            {cfg?.dot && (
                <span className={`mr-1 inline-block size-1.5 rounded-full ${cfg.dot}`} />
            )}
            {isSlot && <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">HUECO</span>}
            {!isSlot && event.status && (
                <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide">
                    {statusConfig[event.status]?.label ?? event.status}
                </span>
            )}
            <span className="block truncate text-xs font-medium leading-tight">{event.label}</span>
            <span className="text-[10px] opacity-70">{event.startTime} - {event.endTime}</span>
        </button>
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nuevo hueco de disponibilidad</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="slot-date">Fecha</Label>
                        <Input
                            id="slot-date"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            required
                        />
                        {errors.date && <p className="text-xs text-[var(--color-error)]">{errors.date}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="slot-start">Hora de inicio</Label>
                            <Input
                                id="slot-start"
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                required
                            />
                            {errors.start_time && <p className="text-xs text-[var(--color-error)]">{errors.start_time}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="slot-end">Hora de fin</Label>
                            <Input
                                id="slot-end"
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                required
                            />
                            {errors.end_time && <p className="text-xs text-[var(--color-error)]">{errors.end_time}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Checkbox
                            id="slot-recurring"
                            checked={data.is_recurring}
                            onCheckedChange={(v) => setData('is_recurring', Boolean(v))}
                        />
                        <Label htmlFor="slot-recurring" className="cursor-pointer font-normal">
                            Se repite cada semana
                        </Label>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="default" disabled={processing}>
                            Guardar hueco
                        </Button>
                    </div>
                </form>
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
    const startsAt = new Date(appointment.starts_at);
    const endsAt   = new Date(appointment.ends_at);

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label>Inicio</Label>
                    <Input type="datetime-local" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} required />
                    {errors.starts_at && <p className="text-xs text-[var(--color-error)]">{errors.starts_at}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>Fin</Label>
                    <Input type="datetime-local" value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} required />
                    {errors.ends_at && <p className="text-xs text-[var(--color-error)]">{errors.ends_at}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <Label>Modalidad</Label>
                <select
                    className="h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-sm"
                    value={data.modality}
                    onChange={(e) => setData('modality', e.target.value)}
                >
                    <option value="in_person">Presencial</option>
                    <option value="video_call">Videollamada</option>
                </select>
            </div>
            <div className="flex flex-col gap-1.5">
                <Label>Notas</Label>
                <textarea
                    className="min-h-16 w-full resize-y rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" variant="default" disabled={processing}>Guardar cambios</Button>
            </div>
        </form>
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <Label>Fecha</Label>
                <Input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label>Hora de inicio</Label>
                    <Input type="time" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} required />
                    {errors.start_time && <p className="text-xs text-[var(--color-error)]">{errors.start_time}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>Hora de fin</Label>
                    <Input type="time" value={data.end_time} onChange={(e) => setData('end_time', e.target.value)} required />
                    {errors.end_time && <p className="text-xs text-[var(--color-error)]">{errors.end_time}</p>}
                </div>
            </div>
            <div className="flex items-center gap-2.5">
                <Checkbox
                    id="edit-recurring"
                    checked={data.is_recurring}
                    onCheckedChange={(v) => setData('is_recurring', Boolean(v))}
                />
                <Label htmlFor="edit-recurring" className="cursor-pointer font-normal">
                    Se repite cada semana
                </Label>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" variant="default" disabled={processing}>Guardar cambios</Button>
            </div>
        </form>
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
    const [deleting, setDeleting] = useState(false);

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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {event.type === 'appointment' ? 'Cita' : 'Hueco de disponibilidad'}
                    </DialogTitle>
                </DialogHeader>

                {mode === 'view' && (
                    <div className="flex flex-col gap-4">
                        {event.type === 'appointment' && event.appointment && (
                            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-sm">
                                {event.appointment.patient && (
                                    <p className="font-medium text-[var(--color-text)]">{event.appointment.patient.name}</p>
                                )}
                                {event.appointment.service && (
                                    <p className="text-[var(--color-text-secondary)]">{event.appointment.service.name}</p>
                                )}
                                <p className="mt-1 text-[var(--color-text-secondary)]">
                                    {event.startTime} – {event.endTime}
                                </p>
                                {cfg && (
                                    <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                                        {cfg.dot && <span className={`size-1.5 rounded-full ${cfg.dot}`} />}
                                        {cfg.label}
                                    </span>
                                )}
                            </div>
                        )}

                        {event.type === 'slot' && (
                            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 text-sm">
                                <p className="font-medium text-[var(--color-text)]">{event.label}</p>
                                <p className="text-[var(--color-text-secondary)]">{event.date} · {event.startTime} – {event.endTime}</p>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-[var(--color-error)] hover:bg-[var(--color-error-subtle)]"
                                onClick={handleDelete}
                            >
                                <Trash2 className="mr-1.5 size-3.5" />
                                Eliminar
                            </Button>
                            <Button variant="default" size="sm" onClick={() => setMode('edit')}>
                                Editar
                            </Button>
                        </div>
                    </div>
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
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* Day headers */}
            <div className="grid border-b border-[var(--color-border)]" style={{ gridTemplateColumns: `64px repeat(7, 1fr)` }}>
                <div className="border-r border-[var(--color-border)] py-3" />
                {days.map((day, i) => {
                    const isToday = toDateStr(day) === today;
                    return (
                        <div key={i} className={`border-r border-[var(--color-border)] py-3 text-center last:border-r-0 ${isToday ? 'bg-[var(--color-primary-subtle)]' : ''}`}>
                            <p className={`text-xs font-medium uppercase tracking-wide ${isToday ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                                {DAYS_ES[i]}
                            </p>
                            <p className={`text-lg font-semibold leading-tight ${isToday ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                                {day.getDate()}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Time grid */}
            <div className="relative grid" style={{ gridTemplateColumns: `64px repeat(7, 1fr)` }}>
                {/* Hour labels */}
                <div>
                    {hours.map((h) => (
                        <div
                            key={h}
                            className="border-b border-r border-[var(--color-border-subtle)] pr-2 text-right"
                            style={{ height: HOUR_HEIGHT }}
                        >
                            <span className="text-[11px] text-[var(--color-text-muted)]">
                                {String(h).padStart(2, '0')}:00
                            </span>
                        </div>
                    ))}
                </div>

                {/* Day columns */}
                {dayKeys.map((dateKey, colIdx) => {
                    const dayEvents = events.filter((e) => e.date === dateKey);
                    return (
                        <div
                            key={colIdx}
                            className="relative border-r border-[var(--color-border)] last:border-r-0"
                            style={{ height: (HOUR_END - HOUR_START + 1) * HOUR_HEIGHT }}
                        >
                            {/* Hour lines */}
                            {hours.map((h) => (
                                <div
                                    key={h}
                                    className="absolute left-0 right-0 border-b border-[var(--color-border-subtle)]"
                                    style={{ top: (h - HOUR_START) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                                />
                            ))}
                            {/* Events */}
                            {dayEvents.map((ev, ei) => (
                                <EventBlock key={`${ev.type}-${ev.id}-${ei}`} event={ev} onClick={() => onEventClick(ev)} />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
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
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* Day names header */}
            <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
                {DAYS_ES.map((d) => (
                    <div key={d} className="border-r py-2 text-center text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)] last:border-r-0">
                        {d}
                    </div>
                ))}
            </div>

            {/* Weeks */}
            <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                    if (!day) {
                        return <div key={i} className="min-h-24 border-b border-r border-[var(--color-border)] bg-[var(--color-surface-alt)] last:border-r-0" />;
                    }
                    const dateKey  = toDateStr(day);
                    const isToday  = dateKey === today;
                    const dayEvts  = events.filter((e) => e.date === dateKey);

                    return (
                        <div
                            key={i}
                            className={`min-h-24 border-b border-r border-[var(--color-border)] p-1.5 last:border-r-0 ${isToday ? 'bg-[var(--color-primary-subtle)]' : ''}`}
                        >
                            <p className={`mb-1 w-6 rounded-full text-center text-sm font-semibold leading-6 ${isToday ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text)]'}`}>
                                {day.getDate()}
                            </p>
                            <div className="flex flex-col gap-0.5">
                                {dayEvts.slice(0, 3).map((ev, ei) => {
                                    const cfg    = ev.status ? (statusConfig[ev.status] ?? statusConfig.pending) : null;
                                    const isSlot = ev.type === 'slot';
                                    return (
                                        <button
                                            key={`${ev.type}-${ev.id}-${ei}`}
                                            onClick={() => onEventClick(ev)}
                                            className={`w-full truncate rounded px-1 py-0.5 text-left text-[11px] font-medium transition-opacity hover:opacity-80
                                                ${isSlot ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary-fg)]' : (cfg?.bg ?? '') + ' ' + (cfg?.text ?? '')}`}
                                        >
                                            {ev.startTime} {ev.label}
                                        </button>
                                    );
                                })}
                                {dayEvts.length > 3 && (
                                    <p className="text-[10px] text-[var(--color-text-muted)]">+{dayEvts.length - 3} más</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
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

            <div className="flex flex-col gap-6 p-6 lg:p-8">
                {/* Page header */}
                <div>
                    <h1 className="text-display-2xl text-[var(--color-text)]">Calendario</h1>
                    <p className="mt-1 text-body-md text-[var(--color-text-secondary)]">Organiza tus horas de disponibilidad</p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap justify-center items-center gap-3">
                    {/* View tabs */}
                    <div className="flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
                        <button
                            onClick={() => {
                                setView('semanal');
                                router.get(schedule.index.url({ query: { from: toDateStr(fromDate), to, view: 'semanal' } }), {}, { preserveState: false });
                            }}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                view === 'semanal'
                                    ? 'bg-[var(--color-surface)] shadow-[var(--shadow-sm)] text-[var(--color-text)]'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                            }`}
                        >
                            Semanal
                        </button>
                        <button
                            onClick={() => {
                                setView('mensual');
                                const newFrom = toDateStr(new Date(monthYear, monthIdx, 1));
                                const newTo   = toDateStr(new Date(monthYear, monthIdx + 1, 0));
                                router.get(schedule.index.url({ query: { from: newFrom, to: newTo, view: 'mensual' } }), {}, { preserveState: false });
                            }}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                view === 'mensual'
                                    ? 'bg-[var(--color-surface)] shadow-[var(--shadow-sm)] text-[var(--color-text)]'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                            }`}
                        >
                            Mensual
                        </button>
                    </div>

                    {/* + button */}
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="flex size-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--color-primary-hover)]"
                        aria-label="Añadir hueco"
                    >
                        <Plus className="size-5" />
                    </button>
                </div>

                {/* Navigation bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex size-8 items-center justify-center rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        <button
                            onClick={() => navigate(1)}
                            className="flex size-8 items-center justify-center rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                        <span className="text-body-md font-semibold text-[var(--color-text)]">
                            {view === 'semanal' ? weekLabel : monthLabel}
                        </span>
                    </div>

                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                        {view === 'semanal' ? `${MONTHS_ES[monthIdx].toUpperCase()} ${monthYear}` : String(monthYear)}
                    </span>
                </div>

                {/* Calendar */}
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
            </div>

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
