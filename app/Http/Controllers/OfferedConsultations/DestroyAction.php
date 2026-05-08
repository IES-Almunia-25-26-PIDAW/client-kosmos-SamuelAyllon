<?php

namespace App\Http\Controllers\OfferedConsultations;

use App\Http\Controllers\Controller;
use App\Models\OfferedConsultation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyAction extends Controller
{
    public function __invoke(Request $request, OfferedConsultation $offered_consultation): RedirectResponse
    {
        $this->authorize('delete', $offered_consultation);

        $offered_consultation->delete();

        return redirect()
            ->route('professional.offered-consultations.index')
            ->with('success', 'Servicio eliminado.');
    }
}
