<?php

namespace App\Http\Controllers\Kosmo;

use App\Http\Controllers\Controller;
use App\Services\KosmoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatAction extends Controller
{
    public function __construct(private readonly KosmoService $kosmoService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate(['message' => ['required', 'string', 'max:2000']]);

        $response = $this->kosmoService->chat($request->user(), $request->message);

        return response()->json(['response' => $response]);
    }
}
