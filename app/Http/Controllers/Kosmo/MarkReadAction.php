<?php

namespace App\Http\Controllers\Kosmo;

use App\Http\Controllers\Controller;
use App\Models\KosmoBriefing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MarkReadAction extends Controller
{
    public function __invoke(Request $request, KosmoBriefing $briefing): RedirectResponse
    {
        abort_if($briefing->user_id !== $request->user()->id, 403);

        $briefing->update(['is_read' => true]);

        return back();
    }
}
