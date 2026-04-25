<?php

namespace App\Http\Controllers\Workspace\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace();

        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'phone'       => ['nullable', 'string', 'max:30'],
            'email'       => ['nullable', 'email', 'max:255'],
            'tax_name'    => ['nullable', 'string', 'max:255'],
            'tax_id'      => ['nullable', 'string', 'max:50'],
            'tax_address' => ['nullable', 'string', 'max:500'],
        ]);

        $workspace->update($validated);

        return back()->with('success', 'Configuración actualizada.');
    }
}
