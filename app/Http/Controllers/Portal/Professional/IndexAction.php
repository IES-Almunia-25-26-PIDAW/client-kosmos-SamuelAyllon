<?php

namespace App\Http\Controllers\Portal\Professional;

use App\Http\Controllers\Controller;
use App\Models\OfferedConsultation;
use App\Models\ProfessionalProfile;
use App\Services\AvailabilityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request, AvailabilityService $availability): Response
    {
        // Patient may not have profile yet — services rendered are global preview, not workspace-bound.
        $workspaceId = $request->user()->patientProfile?->workspace_id;

        $profiles = ProfessionalProfile::query()
            ->where('verification_status', 'verified')
            ->with('user:id,name,avatar_path')
            ->orderBy('id')
            ->get();

        $professionals = $profiles
            ->map(fn (ProfessionalProfile $profile) => [
                'id' => $profile->id,
                'user_id' => $profile->user_id,
                'name' => $profile->user->name,
                'avatar_path' => $profile->user->avatar_path,
                'specialties' => $profile->specialties ?? [],
                'bio' => $profile->bio,
                'collegiate_number' => $profile->collegiate_number,
                'city' => $profile->city,
                'is_verified' => $profile->isVerified(),
                'slots' => $profile->user_id
                    ? $availability->slotsForProfessional($profile->user_id)
                    : [],
            ])
            ->values();

        $cities = $profiles
            ->pluck('city')
            ->filter()
            ->unique()
            ->sort()
            ->values();

        $services = OfferedConsultation::query()
            ->whereIn('professional_profile_id', $profiles->pluck('id'))
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'duration_minutes', 'price', 'professional_profile_id', 'modality'])
            ->values();

        return Inertia::render('patient/professionals/index', [
            'professionals' => $professionals,
            'services' => $services,
            'cities' => $cities,
        ]);
    }
}
