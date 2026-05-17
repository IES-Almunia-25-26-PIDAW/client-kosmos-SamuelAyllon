<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class TrashedIndexAction extends Controller
{
    public function __invoke(): Response
    {
        $users = User::onlyTrashed()
            ->latest('deleted_at')
            ->paginate(25)
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                // Email almacenado prefijado por DestroyAction; reconstruimos el
                // original para que el admin lo reconozca a simple vista.
                'email' => $user->email,
                'original_email' => self::stripDeletedPrefix($user->email),
                'role' => $user->roles->pluck('name')->first() ?? 'sin-rol',
                'has_google' => $user->google_id !== null,
                'deleted_at' => $user->deleted_at?->toIso8601String(),
                'created_at' => $user->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/users/trash', compact('users'));
    }

    public static function stripDeletedPrefix(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return preg_replace('/^del_\d+_[A-Za-z0-9]{6}_/', '', $value);
    }
}
