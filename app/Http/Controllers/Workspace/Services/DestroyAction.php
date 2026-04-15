<?php

namespace App\Http\Controllers\Clinic\Services;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyAction extends Controller
{
    public function __invoke(Request $request, Service $service): RedirectResponse
    {
        abort_if(
            $service->clinic_id !== $request->user()->currentClinicId(),
            403,
            'No tienes permiso para eliminar este servicio.'
        );

        $service->delete();

        return back()->with('success', 'Servicio eliminado.');
    }
}
