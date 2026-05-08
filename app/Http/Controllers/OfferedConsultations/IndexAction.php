<?php

namespace App\Http\Controllers\OfferedConsultations;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $profile = $request->user()->professionalProfile;

        $consultations = $profile
            ? $profile->offeredConsultations()
                ->orderBy('is_active', 'desc')
                ->orderBy('name')
                ->get()
            : collect();

        return Inertia::render('professional/offeredConsultations/index', [
            'consultations' => $consultations->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'description' => $c->description,
                'duration_minutes' => $c->duration_minutes,
                'price' => $c->price,
                'color' => $c->color,
                'is_active' => $c->is_active,
                'modality' => $c->modality,
                'updated_at' => $c->updated_at?->toIso8601String(),
            ])->values(),
        ]);
    }
}
