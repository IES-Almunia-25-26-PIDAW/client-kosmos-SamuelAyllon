<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $request->validate([
            'receiver_id' => ['required', 'exists:users,id'],
            'subject'     => ['nullable', 'string', 'max:255'],
            'body'        => ['required', 'string'],
        ]);

        $workspaceId = $request->user()->currentWorkspaceId();

        abort_if(! $workspaceId, 422, 'No hay una clínica activa asociada a tu cuenta.');

        Message::create([
            'workspace_id'   => $workspaceId,
            'sender_id'   => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'subject'     => $request->subject,
            'body'        => $request->body,
        ]);

        return back()->with('success', 'Mensaje enviado.');
    }
}
