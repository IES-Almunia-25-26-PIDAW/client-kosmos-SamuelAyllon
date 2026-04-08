<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function store(Request $request, Patient $patient): RedirectResponse
    {
        $this->authorize('view', $patient);

        $request->validate([
            'file'     => ['required', 'file', 'max:10240'],
            'name'     => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'in:rgpd_consent,informed_consent,report,invoice,other'],
        ]);

        $file = $request->file('file');
        $path = $file->store("patients/{$patient->id}/documents", 'private');

        $patient->documents()->create([
            'user_id'   => $request->user()->id,
            'name'      => $request->name ?? $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'category'  => $request->category ?? 'other',
            'is_rgpd'   => in_array($request->category, ['rgpd_consent', 'informed_consent']),
        ]);

        return back()->with('success', 'Documento subido correctamente.');
    }

    public function destroy(Patient $patient, Document $document): RedirectResponse
    {
        $this->authorize('view', $patient);

        $document->delete();

        return back()->with('success', 'Documento eliminado.');
    }
}
