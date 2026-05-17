<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class RestoreAction extends Controller
{
    public function __invoke(User $user): RedirectResponse
    {
        if ($user->deleted_at === null) {
            return back()->withErrors(['restore' => 'El usuario no está en la papelera.']);
        }

        $originalEmail = TrashedIndexAction::stripDeletedPrefix($user->email);
        $originalGoogleId = TrashedIndexAction::stripDeletedPrefix($user->google_id);

        // Si mientras estaba en papelera alguien se registró con el mismo email
        // (o vinculó el mismo Google), no podemos restaurar sin chocar con los
        // índices unique. Bloqueamos con un mensaje claro.
        $emailTaken = User::query()
            ->where('email', $originalEmail)
            ->where('id', '!=', $user->id)
            ->exists();

        if ($emailTaken) {
            return back()->withErrors([
                'restore' => "No se puede restaurar: el email {$originalEmail} ya está en uso por otra cuenta activa.",
            ]);
        }

        if ($originalGoogleId !== null) {
            $googleTaken = User::query()
                ->where('google_id', $originalGoogleId)
                ->where('id', '!=', $user->id)
                ->exists();

            if ($googleTaken) {
                return back()->withErrors([
                    'restore' => 'No se puede restaurar: la cuenta de Google ya está vinculada a otro usuario.',
                ]);
            }
        }

        DB::transaction(function () use ($user, $originalEmail, $originalGoogleId): void {
            $user->forceFill([
                'email' => $originalEmail,
                'google_id' => $originalGoogleId,
            ])->save();

            $user->restore();
        });

        return redirect()->route('admin.users.trash')
            ->with('success', "Usuario {$user->name} restaurado correctamente.");
    }
}
