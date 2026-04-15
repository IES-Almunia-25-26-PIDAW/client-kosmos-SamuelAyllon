<?php

namespace App\Http\Controllers\Clinic\Services;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateAction extends Controller
{
    public function __invoke(Request $request, Service $service): RedirectResponse
    {
        abort_if(
            $service->clinic_id !== $request->user()->currentClinicId(),
            403,
            'No tienes permiso para modificar este servicio.'
        );

        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'price'            => ['required', 'numeric', 'min:0'],
            'color'            => ['nullable', 'string', 'max:7'],
            'is_active'        => ['boolean'],
        ]);

        $service->update($validated);

        return back()->with('success', 'Servicio actualizado.');
    }
}
