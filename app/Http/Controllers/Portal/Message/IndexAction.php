<?php

namespace App\Http\Controllers\Portal\Message;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $messages = Message::where(function ($q) use ($user) {
            $q->where('receiver_id', $user->id)
                ->orWhere('sender_id', $user->id);
        })
            ->with('sender:id,name,avatar_path')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('patient/messages/index', [
            'messages' => $messages,
        ]);
    }
}
