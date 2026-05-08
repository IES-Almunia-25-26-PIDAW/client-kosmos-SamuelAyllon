<?php

namespace App\Http\Controllers\OfferedConsultations;

use App\Http\Controllers\Controller;
use App\Models\OfferedConsultation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    public function __invoke(Request $request, OfferedConsultation $offered_consultation): Response
    {
        $this->authorize('update', $offered_consultation);

        return Inertia::render('professional/offeredConsultations/edit', [
            'consultation' => [
                'id' => $offered_consultation->id,
                'name' => $offered_consultation->name,
                'description' => $offered_consultation->description,
                'duration_minutes' => $offered_consultation->duration_minutes,
                'price' => $offered_consultation->price,
                'color' => $offered_consultation->color,
                'is_active' => $offered_consultation->is_active,
                'modality' => $offered_consultation->modality,
            ],
        ]);
    }
}
