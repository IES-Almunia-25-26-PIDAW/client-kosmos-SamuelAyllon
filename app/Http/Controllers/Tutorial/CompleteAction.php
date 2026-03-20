<?php

namespace App\Http\Controllers\Tutorial;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CompleteAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $request->user()->completeTutorial();

        return back();
    }
}
