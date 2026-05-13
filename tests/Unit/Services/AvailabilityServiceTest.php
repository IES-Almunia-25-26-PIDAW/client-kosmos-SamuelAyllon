<?php

declare(strict_types=1);

use App\Models\Appointment;
use App\Models\Availability;
use App\Models\User;
use App\Services\AvailabilityService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    app()[PermissionRegistrar::class]->forgetCachedPermissions();
    $this->seed(RoleSeeder::class);

    // Freeze on a Monday at 08:00 so the schedule below has slots ahead.
    Carbon::setTestNow('2026-05-11 08:00:00'); // Monday
    $this->service = new AvailabilityService;
});

afterEach(function () {
    Carbon::setTestNow();
});

it('returns an empty array when the professional has no active availability', function () {
    $pro = User::factory()->create();

    expect($this->service->slotsForProfessional($pro->id))->toBe([]);
});

it('returns weekly recurring slots grouped per day', function () {
    $pro = User::factory()->create();

    Availability::create([
        'professional_id' => $pro->id,
        'workspace_id' => null,
        'specific_date' => null,
        'day_of_week' => 0, // Monday (dayOfWeekIso 1 -> 1-1=0)
        'start_time' => '10:00',
        'end_time' => '12:00',
        'slot_duration_minutes' => 60,
        'is_active' => true,
    ]);

    $result = $this->service->slotsForProfessional($pro->id, days: 7);

    expect($result)->not->toBeEmpty();

    $monday = collect($result)->firstWhere('date', '2026-05-11');
    expect($monday)->not->toBeNull()
        ->and($monday['times'])->toBe(['10:00', '11:00']);
});

it('excludes slots that overlap a non-cancelled appointment', function () {
    $pro = User::factory()->create();
    $patient = User::factory()->create();

    Availability::create([
        'professional_id' => $pro->id,
        'workspace_id' => null,
        'specific_date' => null,
        'day_of_week' => 0,
        'start_time' => '10:00',
        'end_time' => '13:00',
        'slot_duration_minutes' => 60,
        'is_active' => true,
    ]);

    Appointment::factory()->create([
        'professional_id' => $pro->id,
        'patient_id' => $patient->id,
        'starts_at' => '2026-05-11 11:00:00',
        'ends_at' => '2026-05-11 12:00:00',
        'status' => 'confirmed',
    ]);

    $monday = collect($this->service->slotsForProfessional($pro->id, days: 7))
        ->firstWhere('date', '2026-05-11');

    expect($monday['times'])->toBe(['10:00', '12:00']);
});

it('ignores cancelled and no-show appointments when computing overlaps', function () {
    $pro = User::factory()->create();
    $patient = User::factory()->create();

    Availability::create([
        'professional_id' => $pro->id,
        'workspace_id' => null,
        'specific_date' => null,
        'day_of_week' => 0,
        'start_time' => '10:00',
        'end_time' => '12:00',
        'slot_duration_minutes' => 60,
        'is_active' => true,
    ]);

    Appointment::factory()->create([
        'professional_id' => $pro->id,
        'patient_id' => $patient->id,
        'starts_at' => '2026-05-11 10:00:00',
        'ends_at' => '2026-05-11 11:00:00',
        'status' => 'cancelled',
    ]);

    Appointment::factory()->create([
        'professional_id' => $pro->id,
        'patient_id' => $patient->id,
        'starts_at' => '2026-05-11 11:00:00',
        'ends_at' => '2026-05-11 12:00:00',
        'status' => 'no_show',
    ]);

    $monday = collect($this->service->slotsForProfessional($pro->id, days: 7))
        ->firstWhere('date', '2026-05-11');

    expect($monday['times'])->toBe(['10:00', '11:00']);
});

it('prefers a specific_date override over the weekly schedule', function () {
    $pro = User::factory()->create();

    Availability::create([
        'professional_id' => $pro->id,
        'workspace_id' => null,
        'specific_date' => null,
        'day_of_week' => 0,
        'start_time' => '10:00',
        'end_time' => '12:00',
        'slot_duration_minutes' => 60,
        'is_active' => true,
    ]);

    Availability::create([
        'professional_id' => $pro->id,
        'workspace_id' => null,
        'specific_date' => '2026-05-11',
        'day_of_week' => null,
        'start_time' => '15:00',
        'end_time' => '17:00',
        'slot_duration_minutes' => 60,
        'is_active' => true,
    ]);

    $monday = collect($this->service->slotsForProfessional($pro->id, days: 7))
        ->firstWhere('date', '2026-05-11');

    expect($monday['times'])->toBe(['15:00', '16:00']);
});

it('skips slots that start in the past', function () {
    Carbon::setTestNow('2026-05-11 11:30:00');

    $pro = User::factory()->create();

    Availability::create([
        'professional_id' => $pro->id,
        'workspace_id' => null,
        'specific_date' => null,
        'day_of_week' => 0,
        'start_time' => '10:00',
        'end_time' => '13:00',
        'slot_duration_minutes' => 60,
        'is_active' => true,
    ]);

    $monday = collect($this->service->slotsForProfessional($pro->id, days: 7))
        ->firstWhere('date', '2026-05-11');

    expect($monday['times'])->toBe(['12:00']);
});

it('ignores inactive availabilities', function () {
    $pro = User::factory()->create();

    Availability::create([
        'professional_id' => $pro->id,
        'workspace_id' => null,
        'specific_date' => null,
        'day_of_week' => 0,
        'start_time' => '10:00',
        'end_time' => '12:00',
        'slot_duration_minutes' => 60,
        'is_active' => false,
    ]);

    expect($this->service->slotsForProfessional($pro->id, days: 7))->toBe([]);
});
