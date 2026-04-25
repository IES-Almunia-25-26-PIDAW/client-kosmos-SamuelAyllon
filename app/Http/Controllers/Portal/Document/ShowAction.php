<?php

namespace App\Http\Controllers\Portal\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ShowAction extends Controller
{
    public function __invoke(Request $request, Document $document): StreamedResponse
    {
        $profile = PatientProfile::where('user_id', $request->user()->id)->firstOrFail();

        abort_unless(
            $document->patient_id === $profile->id,
            403,
            'No tienes acceso a este documento.',
        );

        $disk = Storage::disk('private');

        abort_unless(
            $disk->exists($document->local_path),
            404,
            'Documento no disponible.',
        );

        return $disk->download(
            $document->local_path,
            $document->name,
            ['Content-Type' => $document->mime_type ?? 'application/octet-stream'],
        );
    }
}
