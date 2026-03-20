<?php

namespace App\Http\Controllers\Settings\Password;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class EditAction extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('settings/password');
    }
}
