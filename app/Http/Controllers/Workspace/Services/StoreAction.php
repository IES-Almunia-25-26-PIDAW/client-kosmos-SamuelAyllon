<?php

namespace App\Http\Controllers\Clinic\Services;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $clinic = $request->user()->currentClinic();

        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'price'            => ['required', 'numeric', 'min:0'],
            'color'            => ['nullable', 'string', 'max:7'],
        ]);

        $clinic->services()->create([...$validated, 'is_active' => true]);

        return back()->with('success', 'Servicio creado.');
    }
}
