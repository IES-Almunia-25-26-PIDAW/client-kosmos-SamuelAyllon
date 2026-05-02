<?php

use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\OfferedConsultation;
use App\Models\ProfessionalProfile;
use App\Models\User;

it('redirects guests from invoices index to login', function () {
    $this->get(route('professional.invoices.index'))->assertRedirect(route('login'));
});

it('professional can view invoices page', function () {
    $this->actingAs(createProfessional())
        ->get(route('professional.invoices.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('professional/invoices/index', false));
});

it('invoices page returns invoices, stats and filters', function () {
    $this->actingAs(createProfessional())
        ->get(route('professional.invoices.index'))
        ->assertInertia(fn ($page) => $page
            ->component('professional/invoices/index', false)
            ->has('payments')
            ->has('stats')
            ->has('filters')
        );
});

it('invoice stats include total_paid, total_pending and total_overdue', function () {
    $this->actingAs(createProfessional())
        ->get(route('professional.invoices.index'))
        ->assertInertia(fn ($page) => $page
            ->has('stats.total_paid')
            ->has('stats.total_pending')
            ->has('stats.total_overdue')
        );
});

it('invoices index only shows invoices belonging to authenticated professional', function () {
    $user = createProfessional();
    $other = createProfessional();

    $patientUser = User::factory()->create();
    $patientUserOther = User::factory()->create();

    Invoice::factory()->count(3)->create([
        'professional_id' => $user->id,
        'patient_id' => $patientUser->id,
    ]);
    Invoice::factory()->create([
        'professional_id' => $other->id,
        'patient_id' => $patientUserOther->id,
    ]);

    $this->actingAs($user)
        ->get(route('professional.invoices.index'))
        ->assertInertia(fn ($page) => $page
            ->component('professional/invoices/index', false)
            ->has('payments.data', 3)
        );
});

it('invoices index can be filtered by invoice status', function () {
    $user = createProfessional();
    $patientUser = User::factory()->create();

    Invoice::factory()->create(['professional_id' => $user->id, 'patient_id' => $patientUser->id, 'status' => 'paid']);
    Invoice::factory()->create(['professional_id' => $user->id, 'patient_id' => $patientUser->id, 'status' => 'draft']);

    $this->actingAs($user)
        ->get(route('professional.invoices.index', ['status' => 'paid']))
        ->assertInertia(fn ($page) => $page
            ->component('professional/invoices/index', false)
            ->has('payments.data', 1)
        );
});

it('exposes pending billing list with completed appointments lacking invoice', function () {
    $professional = createProfessional(false);
    $patient = createPatient();
    $profProfile = ProfessionalProfile::factory()->verified()->create(['user_id' => $professional->id]);
    $service = OfferedConsultation::factory()->create([
        'professional_profile_id' => $profProfile->id,
        'price' => 70,
        'name' => 'Primera consulta',
    ]);

    $orphan = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'service_id' => $service->id,
        'status' => 'completed',
        'workspace_id' => null,
    ]);

    $invoiced = Appointment::factory()->create([
        'professional_id' => $professional->id,
        'patient_id' => $patient->id,
        'service_id' => $service->id,
        'status' => 'completed',
        'workspace_id' => null,
    ]);
    $invoice = Invoice::create([
        'workspace_id' => null,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'invoice_number' => 'FAC-2026-91000',
        'status' => 'draft',
        'issued_at' => now(),
        'due_at' => now()->addDays(30),
        'subtotal' => 70,
        'tax_rate' => 0,
        'tax_amount' => 0,
        'total' => 70,
    ]);
    InvoiceItem::create([
        'invoice_id' => $invoice->id,
        'appointment_id' => $invoiced->id,
        'description' => 'Sesión',
        'quantity' => 1,
        'unit_price' => 70,
        'total' => 70,
    ]);

    $this->actingAs($professional)
        ->get(route('professional.invoices.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('professional/invoices/index', false)
            ->has('pendingBilling', 1)
            ->where('pendingBilling.0.id', $orphan->id)
        );
});
