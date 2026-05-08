<?php

namespace App\Http\Controllers\OfferedConsultations;

use App\Actions\OfferedConsultations\CreateOfferedConsultation;
use App\Http\Controllers\Controller;
use App\Http\Requests\OfferedConsultationsRequest;
use App\Models\OfferedConsultation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class StoreAction extends Controller
{
    public function __invoke(
        OfferedConsultationsRequest $request,
        CreateOfferedConsultation $createConsultation,
    ): RedirectResponse {
        $this->authorize('create', OfferedConsultation::class);

        $profile = $request->user()->professionalProfile;

        if (! $profile) {
            throw ValidationException::withMessages([
                'professional_profile' => 'Debes completar tu perfil profesional antes de crear servicios.',
            ]);
        }

        $createConsultation($profile, $request->dataForPersistence());

        return redirect()
            ->route('professional.offered-consultations.index')
            ->with('success', 'Servicio creado.');
    }
}
