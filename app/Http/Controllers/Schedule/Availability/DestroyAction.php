<?php

namespace App\Http\Controllers\Schedule\Availability;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyAction extends Controller
{
    public function __invoke(Request $request, Availability $availability): RedirectResponse
    {
        abort_if(
            $availability->professional_id !== $request->user()->id,
            403,
            'No tienes permiso para eliminar esta disponibilidad.'
        );

        $availability->delete();

        return back()->with('success', 'Disponibilidad eliminada.');
    }
}
