<?php

namespace App\Http\Controllers\Portal\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $profile = PatientProfile::where('user_id', $request->user()->id)->firstOrFail();

        $documents = $profile->documents()
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'category', 'mime_type', 'size_bytes', 'created_at'])
            ->map(fn (Document $document) => [
                'id' => $document->id,
                'name' => $document->name,
                'category' => $document->category,
                'mime_type' => $document->mime_type,
                'size_bytes' => $document->size_bytes,
                'created_at' => $document->created_at,
                'download_url' => URL::temporarySignedRoute(
                    'patient.documents.show',
                    now()->addMinutes(5),
                    ['document' => $document->id],
                ),
            ]);

        return Inertia::render('patient/documents/index', [
            'documents' => $documents,
        ]);
    }
}
