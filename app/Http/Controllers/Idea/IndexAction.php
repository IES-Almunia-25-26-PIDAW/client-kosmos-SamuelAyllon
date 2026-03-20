<?php

namespace App\Http\Controllers\Idea;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(): Response
    {
        $user = Auth::user();

        $ideas = $user->ideas()
            ->with('project:id,name')
            ->orderByRaw("CASE status WHEN 'active' THEN 0 ELSE 1 END")
            ->byPriority()
            ->get();

        return Inertia::render('ideas/index', [
            'ideas' => $ideas,
        ]);
    }
}
