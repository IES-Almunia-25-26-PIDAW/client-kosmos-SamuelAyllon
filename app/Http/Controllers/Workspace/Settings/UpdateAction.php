<?php

namespace App\Http\Controllers\Clinic\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $clinic = $request->user()->currentClinic();

        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'phone'       => ['nullable', 'string', 'max:30'],
            'email'       => ['nullable', 'email', 'max:255'],
            'tax_name'    => ['nullable', 'string', 'max:255'],
            'tax_id'      => ['nullable', 'string', 'max:50'],
            'tax_address' => ['nullable', 'string', 'max:500'],
        ]);

        $clinic->update($validated);

        return back()->with('success', 'Configuración actualizada.');
    }
}
