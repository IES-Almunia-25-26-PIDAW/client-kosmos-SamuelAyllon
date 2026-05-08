<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MarkReadAction extends Controller
{
    public function __invoke(Request $request, string $notification): RedirectResponse
    {
        $record = $request->user()->notifications()->whereKey($notification)->first();

        abort_if($record === null, 404);

        if ($record->read_at === null) {
            $record->markAsRead();
        }

        return back();
    }
}
