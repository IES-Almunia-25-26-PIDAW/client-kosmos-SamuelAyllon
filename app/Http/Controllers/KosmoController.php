<?php

namespace App\Http\Controllers;

use App\Models\KosmoBriefing;
use App\Services\KosmoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KosmoController extends Controller
{
    public function __construct(private readonly KosmoService $kosmoService)
    {
    }

    public function index(Request $request): Response
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

    public function chat(Request $request): JsonResponse
    {
        $request->validate(['message' => ['required', 'string', 'max:2000']]);

        $response = $this->kosmoService->chat($request->user(), $request->message);

        return response()->json(['response' => $response]);
    }

    public function markRead(Request $request, KosmoBriefing $briefing): RedirectResponse
    {
        abort_if($briefing->user_id !== $request->user()->id, 403);

        $briefing->update(['is_read' => true]);

        return back();
    }
}
