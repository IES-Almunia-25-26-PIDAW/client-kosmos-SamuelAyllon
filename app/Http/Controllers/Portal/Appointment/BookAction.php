<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\ProfessionalProfile;
use App\Models\Service;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookAction extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $validated = $request->validate([
            'professional_id' => ['required', 'integer'],
            'starts_at' => ['required', 'date', 'after:now'],
            'service_id' => ['nullable', 'integer'],
        ]);

        $workspaceId = $request->user()->patientProfile?->workspace_id;

        if (! $workspaceId) {
            return redirect()->route('patient.dashboard');
        }

        $profile = ProfessionalProfile::with('user:id,name,avatar_path')
            ->find($validated['professional_id']);

        if (! $profile || ! $profile->user_id) {
            return redirect()
                ->route('patient.professionals.index')
                ->withErrors(['professional_id' => 'Profesional no disponible.']);
        }

        $services = Service::where('workspace_id', $workspaceId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'duration_minutes', 'price']);

        $service = isset($validated['service_id'])
            ? $services->firstWhere('id', $validated['service_id'])
            : $services->first();

        if (! $service) {
            return redirect()
                ->route('patient.professionals.index')
                ->withErrors(['service' => 'No hay servicios configurados.']);
        }

        $startsAt = CarbonImmutable::parse($validated['starts_at']);
        $endsAt = $startsAt->addMinutes($service->duration_minutes);

        return Inertia::render('patient/appointments/book', [
            'professional' => [
                'id' => $profile->id,
                'user_id' => $profile->user_id,
                'name' => $profile->user->name,
                'avatar_path' => $profile->user->avatar_path,
                'specialties' => $profile->specialties ?? [],
                'collegiate_number' => $profile->collegiate_number,
            ],
            'service' => $service,
            'services' => $services->values(),
            'starts_at' => $startsAt->toIso8601String(),
            'ends_at' => $endsAt->toIso8601String(),
        ]);
    }
}
