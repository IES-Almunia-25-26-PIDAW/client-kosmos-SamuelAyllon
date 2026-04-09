<?php

namespace App\Http\Controllers\Kosmo;

use App\Http\Controllers\Controller;
use App\Models\KosmoBriefing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $briefings = KosmoBriefing::where('user_id', $user->id)
            ->where('is_read', false)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return Inertia::render('kosmo/index', [
            'briefings' => $briefings,
        ]);
    }
}
