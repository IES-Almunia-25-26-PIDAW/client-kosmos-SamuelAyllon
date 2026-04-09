<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'practice_name'            => ['nullable', 'string', 'max:255'],
            'specialty'                => ['nullable', 'string', 'max:255'],
            'city'                     => ['nullable', 'string', 'max:255'],
            'default_rate'             => ['nullable', 'numeric', 'min:0'],
            'default_session_duration' => ['nullable', 'integer', 'min:1'],
            'nif'                      => ['nullable', 'string', 'max:20'],
            'fiscal_address'           => ['nullable', 'string'],
            'invoice_prefix'           => ['nullable', 'string', 'max:10'],
            'invoice_footer_text'      => ['nullable', 'string'],
            'rgpd_template'            => ['nullable', 'string'],
            'data_retention_months'    => ['nullable', 'integer', 'min:1'],
            'privacy_policy_url'       => ['nullable', 'url'],
        ]);

        $request->user()->update($validated);

        return back()->with('success', 'Ajustes guardados correctamente.');
    }
}
