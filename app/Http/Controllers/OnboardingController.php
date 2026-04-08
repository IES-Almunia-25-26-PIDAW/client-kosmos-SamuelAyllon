<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasCompletedTutorial()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('onboarding');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'practice_name' => ['required', 'string', 'max:255'],
            'specialty'     => ['nullable', 'string', 'max:255'],
            'city'          => ['nullable', 'string', 'max:255'],
            'patient'       => ['nullable', 'array'],
            'patient.project_name'  => ['required_with:patient', 'string', 'max:255'],
            'patient.service_scope' => ['nullable', 'string'],
            'patient.brand_tone'    => ['nullable', 'string', 'max:100'],
            'patient.next_deadline' => ['nullable', 'date'],
        ]);

        $user = $request->user();
        $user->update([
            'practice_name' => $validated['practice_name'],
            'specialty'     => $validated['specialty'] ?? null,
            'city'          => $validated['city'] ?? null,
        ]);

        if (! empty($validated['patient']['project_name'])) {
            Patient::create([
                'user_id'      => $user->id,
                'project_name' => $validated['patient']['project_name'],
                'service_scope' => $validated['patient']['service_scope'] ?? null,
                'brand_tone'   => $validated['patient']['brand_tone'] ?? null,
                'next_deadline' => $validated['patient']['next_deadline'] ?? null,
            ]);
        }

        $user->completeTutorial();

        return redirect()->route('dashboard')
            ->with('success', 'Todo listo. Kosmo te acompañará en cada sesión.');
    }
}
