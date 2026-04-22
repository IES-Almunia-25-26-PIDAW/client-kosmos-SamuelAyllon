<?php

namespace App\Http\Controllers\Portal\Document;

use App\Http\Controllers\Controller;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $profile = PatientProfile::where('user_id', $request->user()->id)->firstOrFail();

        $documents = $profile->documents()
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'category', 'mime_type', 'file_size', 'created_at']);

        return Inertia::render('patient/documents/index', [
            'documents' => $documents,
        ]);
    }
}
