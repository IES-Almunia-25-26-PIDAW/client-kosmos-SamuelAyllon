<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('viewAny', PatientProfile::class);

        $patients = PatientProfile::query()
            ->with('user:id,name,email,phone,avatar_path')
            ->where('professional_id', $request->user()->id)
            ->where('is_active', true)
            ->orderBy('id')
            ->get()
            ->map(fn (PatientProfile $p) => [
                'id' => $p->id,
                'user_id' => $p->user_id,
                'name' => $p->user?->name,
                'email' => $p->user?->email,
                'phone' => $p->user?->phone,
                'avatar_path' => $p->user?->avatar_path,
                'consultation_reason' => $p->consultation_reason,
                'therapeutic_approach' => $p->therapeutic_approach,
                'status' => $p->status,
                'is_active' => $p->is_active,
                'first_session_at' => $p->first_session_at?->toIso8601String(),
                'last_session_at' => $p->last_session_at?->toIso8601String(),
                'created_at' => $p->created_at?->toIso8601String(),
                'updated_at' => $p->updated_at?->toIso8601String(),
            ])
            ->values();

        return Inertia::render('professional/patients/index', [
            'patients' => $patients,
        ]);
    }
}
