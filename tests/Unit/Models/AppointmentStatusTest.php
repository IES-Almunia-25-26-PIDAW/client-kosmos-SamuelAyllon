<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Appointment;
use Tests\TestCase;

/**
 * Unit-style tests for Appointment status predicates.
 * No DB access — only the in-memory string comparison logic.
 */
final class AppointmentStatusTest extends TestCase
{
    private function withStatus(string $status): Appointment
    {
        $appointment = new Appointment;
        $appointment->setRawAttributes(['status' => $status], sync: true);

        return $appointment;
    }

    public function test_is_pending_only_for_pending_status(): void
    {
        $this->assertTrue($this->withStatus('pending')->isPending());

        foreach (['confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'] as $other) {
            $this->assertFalse(
                $this->withStatus($other)->isPending(),
                "isPending() should be false for status={$other}",
            );
        }
    }

    public function test_is_confirmed_only_for_confirmed_status(): void
    {
        $this->assertTrue($this->withStatus('confirmed')->isConfirmed());

        foreach (['pending', 'in_progress', 'completed', 'cancelled'] as $other) {
            $this->assertFalse($this->withStatus($other)->isConfirmed());
        }
    }

    public function test_is_completed_only_for_completed_status(): void
    {
        $this->assertTrue($this->withStatus('completed')->isCompleted());

        foreach (['pending', 'confirmed', 'in_progress', 'cancelled'] as $other) {
            $this->assertFalse($this->withStatus($other)->isCompleted());
        }
    }

    public function test_is_cancelled_only_for_cancelled_status(): void
    {
        $this->assertTrue($this->withStatus('cancelled')->isCancelled());

        foreach (['pending', 'confirmed', 'in_progress', 'completed'] as $other) {
            $this->assertFalse($this->withStatus($other)->isCancelled());
        }
    }

    public function test_status_predicates_are_mutually_exclusive(): void
    {
        $appointment = $this->withStatus('confirmed');

        $this->assertFalse($appointment->isPending());
        $this->assertTrue($appointment->isConfirmed());
        $this->assertFalse($appointment->isCompleted());
        $this->assertFalse($appointment->isCancelled());
    }
}
