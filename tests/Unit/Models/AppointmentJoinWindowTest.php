<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Appointment;
use Illuminate\Support\Carbon;
use Tests\TestCase;

/**
 * Unit-style test for Appointment::canBeJoinedNow().
 * Boots the Laravel app for Eloquent casts but never hits the database.
 */
final class AppointmentJoinWindowTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow('2026-05-01 10:00:00');
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function appointment(string $startsAt, string $endsAt, string $status): Appointment
    {
        $appointment = new Appointment;

        $appointment->setRawAttributes([
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'status' => $status,
        ], sync: true);

        return $appointment;
    }

    public function test_denies_join_more_than_10_minutes_before_start(): void
    {
        $appointment = $this->appointment('2026-05-01 10:11:00', '2026-05-01 11:00:00', 'confirmed');

        $this->assertFalse($appointment->canBeJoinedNow());
    }

    public function test_allows_join_exactly_at_minus_10_minutes(): void
    {
        $appointment = $this->appointment('2026-05-01 10:10:00', '2026-05-01 11:00:00', 'confirmed');

        $this->assertTrue($appointment->canBeJoinedNow());
    }

    public function test_allows_join_during_appointment(): void
    {
        $appointment = $this->appointment('2026-05-01 09:30:00', '2026-05-01 10:30:00', 'in_progress');

        $this->assertTrue($appointment->canBeJoinedNow());
    }

    public function test_allows_join_within_15_minute_grace_after_end(): void
    {
        $appointment = $this->appointment('2026-05-01 09:00:00', '2026-05-01 09:50:00', 'in_progress');

        $this->assertTrue($appointment->canBeJoinedNow());
    }

    public function test_denies_join_after_15_minute_grace(): void
    {
        $appointment = $this->appointment('2026-05-01 08:00:00', '2026-05-01 09:44:00', 'in_progress');

        $this->assertFalse($appointment->canBeJoinedNow());
    }

    public function test_allows_join_for_pending_status(): void
    {
        $appointment = $this->appointment('2026-05-01 10:05:00', '2026-05-01 11:00:00', 'pending');

        $this->assertTrue($appointment->canBeJoinedNow());
    }

    public function test_denies_join_for_completed_status(): void
    {
        $appointment = $this->appointment('2026-05-01 09:30:00', '2026-05-01 10:30:00', 'completed');

        $this->assertFalse($appointment->canBeJoinedNow());
    }

    public function test_denies_join_for_cancelled_status(): void
    {
        $appointment = $this->appointment('2026-05-01 09:30:00', '2026-05-01 10:30:00', 'cancelled');

        $this->assertFalse($appointment->canBeJoinedNow());
    }
}
