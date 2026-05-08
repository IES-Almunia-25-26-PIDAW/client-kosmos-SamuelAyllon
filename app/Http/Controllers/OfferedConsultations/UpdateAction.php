<?php

namespace App\Http\Controllers\OfferedConsultations;

use App\Actions\OfferedConsultations\UpdateOfferedConsultation;
use App\Http\Controllers\Controller;
use App\Http\Requests\OfferedConsultationsRequest;
use App\Models\OfferedConsultation;
use Illuminate\Http\RedirectResponse;

class UpdateAction extends Controller
{
    public function __invoke(
        OfferedConsultationsRequest $request,
        OfferedConsultation $offered_consultation,
        UpdateOfferedConsultation $updateConsultation,
    ): RedirectResponse {
        $this->authorize('update', $offered_consultation);

        $updateConsultation($offered_consultation, $request->dataForPersistence());

        return redirect()
            ->route('professional.offered-consultations.index')
            ->with('success', 'Servicio actualizado.');
    }
}
