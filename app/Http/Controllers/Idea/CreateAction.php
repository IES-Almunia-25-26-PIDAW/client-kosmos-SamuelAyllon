<?php

namespace App\Http\Controllers\Idea;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CreateAction extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('ideas/create');
    }
}
