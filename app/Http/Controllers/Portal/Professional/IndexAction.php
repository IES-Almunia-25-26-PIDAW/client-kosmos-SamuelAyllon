<?php

namespace App\Http\Controllers\Portal\Professional;

use App\Http\Controllers\Controller;
use App\Models\ProfessionalProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $professionals = ProfessionalProfile::query()
            ->where('verification_status', 'verified')
            ->with('user:id,name,avatar_path')
            ->orderBy('id')
            ->get()
            ->map(fn (ProfessionalProfile $profile) => [
                'id' => $profile->id,
                'name' => $profile->user?->name ?? '',
                'avatar_path' => $profile->user?->avatar_path,
                'specialties' => $profile->specialties ?? [],
                'bio' => $profile->bio,
                'collegiate_number' => $profile->collegiate_number,
                'is_verified' => $profile->isVerified(),
            ])
            ->values();

        return Inertia::render('patient/professionals/index', [
            'professionals' => $professionals,
        ]);
    }
}
