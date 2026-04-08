<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Models\KosmoBriefing;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Patient::class);

        $patients = Patient::where('user_id', $request->user()->id)
            ->where('is_active', true)
            ->orderBy('project_name')
            ->get();

        return Inertia::render('patients/index', [
            'patients' => $patients,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Patient::class);

        return Inertia::render('patients/create');
    }

    public function store(StorePatientRequest $request): RedirectResponse
    {
        $this->authorize('create', Patient::class);

        $patient = Patient::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('patients.show', $patient)
            ->with('success', 'Paciente añadido correctamente.');
    }

    public function show(Patient $patient): Response
    {
        $this->authorize('view', $patient);

        $patient->load([
            'sessions' => fn ($q) => $q->orderByDesc('scheduled_at')->limit(10),
            'notes'    => fn ($q) => $q->orderByDesc('created_at')->limit(20),
            'agreements' => fn ($q) => $q->orderByDesc('created_at'),
            'payments' => fn ($q) => $q->orderByDesc('due_date'),
            'documents',
            'consentForms',
        ]);

        return Inertia::render('patients/show', [
            'patient' => $patient,
        ]);
    }

    public function edit(Patient $patient): Response
    {
        $this->authorize('update', $patient);

        return Inertia::render('patients/edit', [
            'patient' => $patient,
        ]);
    }

    public function update(StorePatientRequest $request, Patient $patient): RedirectResponse
    {
        $this->authorize('update', $patient);

        $patient->update($request->validated());

        return redirect()->route('patients.show', $patient)
            ->with('success', 'Paciente actualizado correctamente.');
    }

    public function destroy(Patient $patient): RedirectResponse
    {
        $this->authorize('delete', $patient);

        $patient->delete();

        return redirect()->route('patients.index')
            ->with('success', 'Paciente eliminado correctamente.');
    }

    public function preSession(Patient $patient): Response
    {
        $this->authorize('view', $patient);

        $context = [
            'lastSessions'    => $patient->sessions()->orderByDesc('scheduled_at')->limit(3)->get(),
            'recentNotes'     => $patient->notes()->orderByDesc('created_at')->limit(5)->get(),
            'openAgreements'  => $patient->agreements()->where('is_completed', false)->get(),
            'lastPayment'     => $patient->payments()->orderByDesc('due_date')->first(),
            'validConsent'    => $patient->consentForms()->where('status', 'signed')->first(),
        ];

        $briefing = KosmoBriefing::where('patient_id', $patient->id)
            ->where('type', 'pre_session')
            ->latest()
            ->first();

        return Inertia::render('patients/pre-session', [
            'patient'  => $patient,
            'context'  => $context,
            'briefing' => $briefing,
        ]);
    }

    public function postSession(Patient $patient): Response
    {
        $this->authorize('view', $patient);

        $lastSession = $patient->sessions()
            ->orderByDesc('scheduled_at')
            ->first();

        return Inertia::render('patients/post-session', [
            'patient'     => $patient,
            'lastSession' => $lastSession,
            'lastPayment' => $patient->payments()->orderByDesc('due_date')->first(),
        ]);
    }
}
