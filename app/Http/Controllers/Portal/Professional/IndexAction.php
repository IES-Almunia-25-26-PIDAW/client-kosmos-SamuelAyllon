<?php

namespace App\Http\Controllers\Portal\Professional;

use App\Http\Controllers\Controller;
use App\Models\ProfessionalProfile;
use App\Models\Service;
use App\Services\AvailabilityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request, AvailabilityService $availability): Response
    {
        $workspaceId = $request->user()->patientProfile?->workspace_id;

        $professionals = ProfessionalProfile::query()
            ->where('verification_status', 'verified')
            ->with('user:id,name,avatar_path')
            ->orderBy('id')
            ->get()
            ->map(fn (ProfessionalProfile $profile) => [
                'id' => $profile->id,
                'user_id' => $profile->user_id,
                'name' => $profile->user->name,
                'avatar_path' => $profile->user->avatar_path,
                'specialties' => $profile->specialties ?? [],
                'bio' => $profile->bio,
                'collegiate_number' => $profile->collegiate_number,
                'is_verified' => $profile->isVerified(),
                'slots' => $profile->user_id
                    ? $availability->slotsForProfessional($profile->user_id)
                    : [],
            ])
            ->values();

        $services = $workspaceId
            ? Service::where('workspace_id', $workspaceId)
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'duration_minutes', 'price'])
                ->values()
            : collect();

        return Inertia::render('patient/professionals/index', [
            'professionals' => $professionals,
            'services' => $services,
        ]);
    }
}
