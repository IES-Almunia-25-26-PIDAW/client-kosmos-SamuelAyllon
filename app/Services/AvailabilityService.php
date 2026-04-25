<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Availability;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;

class AvailabilityService
{
    /**
     * Compute available booking slots for a professional over the next N days.
     *
     * @return array<int, array{date: string, times: array<int, string>}>
     */
    public function slotsForProfessional(int $professionalId, int $days = 14): array
    {
        $availabilities = Availability::where('professional_id', $professionalId)
            ->where('is_active', true)
            ->get();

        if ($availabilities->isEmpty()) {
            return [];
        }

        $from = CarbonImmutable::now()->startOfMinute();
        $to = $from->addDays($days)->endOfDay();

        $taken = Appointment::where('professional_id', $professionalId)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->whereBetween('starts_at', [$from, $to])
            ->get(['starts_at', 'ends_at'])
            ->map(fn ($a) => [
                CarbonImmutable::parse($a->starts_at),
                CarbonImmutable::parse($a->ends_at),
            ]);

        $result = [];

        foreach (CarbonPeriod::create($from->startOfDay(), $to) as $day) {
            $dayImmutable = CarbonImmutable::parse($day);
            $times = $this->slotsForDay($dayImmutable, $availabilities, $taken, $from);

            if ($times !== []) {
                $result[] = [
                    'date' => $dayImmutable->toDateString(),
                    'times' => $times,
                ];
            }
        }

        return $result;
    }

    /**
     * @param  Collection<int, Availability>  $availabilities
     * @param  Collection<int, array{0: CarbonImmutable, 1: CarbonImmutable}>  $taken
     * @return array<int, string>
     */
    private function slotsForDay(
        CarbonImmutable $day,
        Collection $availabilities,
        Collection $taken,
        CarbonImmutable $now,
    ): array {
        $specific = $availabilities->first(
            fn (Availability $a) => $a->specific_date !== null
                && $a->specific_date->isSameDay($day),
        );

        $matching = $specific !== null
            ? collect([$specific])
            : $availabilities->filter(
                fn (Availability $a) => $a->specific_date === null
                    && (int) $a->day_of_week === ($day->dayOfWeekIso - 1),
            );

        $slots = [];

        foreach ($matching as $availability) {
            $start = $day->setTimeFromTimeString($availability->start_time);
            $end = $day->setTimeFromTimeString($availability->end_time);
            $duration = (int) ($availability->slot_duration_minutes ?: 60);

            for ($slot = $start; $slot->lt($end); $slot = $slot->addMinutes($duration)) {
                $slotEnd = $slot->addMinutes($duration);

                if ($slot->lt($now) || $slotEnd->gt($end)) {
                    continue;
                }

                $overlaps = $taken->contains(
                    fn (array $range) => $slot->lt($range[1]) && $slotEnd->gt($range[0]),
                );

                if ($overlaps) {
                    continue;
                }

                $slots[] = $slot->format('H:i');
            }
        }

        sort($slots);

        return array_values(array_unique($slots));
    }
}
