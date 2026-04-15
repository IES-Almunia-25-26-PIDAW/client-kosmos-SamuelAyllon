<?php

namespace App\Http\Controllers\Admin\Clinics;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $clinics = Clinic::withCount(['users', 'services'])
            ->with('owner:id,name,email')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/clinics/index', [
            'clinics' => $clinics,
            'filters' => $request->only(['search']),
        ]);
    }
}
