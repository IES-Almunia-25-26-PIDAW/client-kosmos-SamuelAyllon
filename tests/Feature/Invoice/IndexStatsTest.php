<?php

use App\Http\Controllers\Invoice\IndexAction;
use App\Models\Invoice;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    Cache::flush();
});

it('aggregates invoice stats by status with single query', function () {
    $professional = createProfessional();
    $patient = createPatient();

    Invoice::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'paid',
        'paid_at' => now(),
        'total' => 100,
    ]);
    Invoice::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'paid',
        'paid_at' => now()->subMonth(),
        'total' => 999,
    ]);
    Invoice::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'sent',
        'total' => 50,
    ]);
    Invoice::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'draft',
        'total' => 25,
    ]);
    Invoice::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'overdue',
        'total' => 80,
    ]);

    $this->actingAs($professional)
        ->get(route('professional.invoices.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('stats.total_paid', 100)
            ->where('stats.total_pending', 75)
            ->where('stats.total_overdue', 80)
        );
});

it('caches stats and invalidates them when an invoice is saved', function () {
    $professional = createProfessional();
    $patient = createPatient();

    Invoice::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'overdue',
        'total' => 40,
    ]);

    $key = IndexAction::statsCacheKey($professional->id);

    $this->actingAs($professional)->get(route('professional.invoices.index'))->assertOk();
    expect(Cache::has($key))->toBeTrue();

    Invoice::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'status' => 'overdue',
        'total' => 60,
    ]);

    expect(Cache::has($key))->toBeFalse();

    $this->actingAs($professional)
        ->get(route('professional.invoices.index'))
        ->assertInertia(fn ($page) => $page->where('stats.total_overdue', 100));
});
