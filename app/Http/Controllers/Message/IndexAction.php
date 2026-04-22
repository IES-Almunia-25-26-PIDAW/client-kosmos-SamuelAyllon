<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $inbox = Message::where('receiver_id', $user->id)
            ->with('sender:id,name,avatar_path')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $conversations = User::whereIn('id', function ($q) use ($user) {
            $q->select('sender_id')
                ->from('messages')
                ->where('receiver_id', $user->id)
                ->union(
                    \DB::table('messages')
                        ->select('receiver_id')
                        ->where('sender_id', $user->id),
                );
        })
            ->select('id', 'name', 'avatar_path')
            ->get();

        return Inertia::render('professional/messages/index', [
            'inbox' => $inbox,
            'conversations' => $conversations,
        ]);
    }
}
