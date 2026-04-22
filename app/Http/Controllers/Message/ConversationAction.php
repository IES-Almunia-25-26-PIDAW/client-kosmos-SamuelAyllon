<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConversationAction extends Controller
{
    public function __invoke(Request $request, User $user): Response
    {
        $authId = $request->user()->id;

        $messages = Message::where(function ($q) use ($authId, $user) {
            $q->where(function ($inner) use ($authId, $user) {
                $inner->where('sender_id', $authId)->where('receiver_id', $user->id);
            })->orWhere(function ($inner) use ($authId, $user) {
                $inner->where('sender_id', $user->id)->where('receiver_id', $authId);
            });
        })
            ->orderBy('created_at')
            ->get();

        Message::where('sender_id', $user->id)
            ->where('receiver_id', $authId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return Inertia::render('professional/messages/conversation', [
            'recipient' => $user->only('id', 'name', 'avatar_path'),
            'messages' => $messages,
        ]);
    }
}
