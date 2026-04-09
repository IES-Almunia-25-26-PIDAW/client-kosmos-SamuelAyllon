<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CreateAction extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/users/create');
    }
}
