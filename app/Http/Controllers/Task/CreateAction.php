<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CreateAction extends Controller
{
    public function __invoke(): Response
    {
        $user = Auth::user();

        // Solo premium pueden asignar tareas a proyectos;
        // los free reciben colección vacía para no exponer la feature en el formulario
        $projects = $user->isPremiumUser() || $user->isAdmin()
            ? $user->projects()->active()->get(['id', 'name'])
            : collect();

        return Inertia::render('tasks/create', [
            'projects' => $projects,
            'defaultProjectId' => request()->query('project_id'),
        ]);
    }
}
