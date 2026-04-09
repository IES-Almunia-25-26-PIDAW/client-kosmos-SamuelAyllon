<?php

namespace App\Http\Controllers\Auth\Authenticate;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthenticateAction extends Controller
{
    /**
     * Autenticar usuario comprobando credenciales y rol asignado.
     *
     * Este método es invocado por Fortify durante el login.
     * Devuelve el usuario si las credenciales son correctas y tiene un rol válido,
     * o null para que Fortify rechace el intento de login.
     */
    public function __invoke(Request $request): ?User
    {
        $user = User::where('email', $request->email)->first();

        // Verificar credenciales
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return null;
        }

        // Seguridad: bloquear login si el usuario no tiene ningún rol asignado
        // En este proyecto solo existen los roles 'admin' y 'professional' (ver RoleSeeder).
        if (! $user->hasAnyRole(['admin', 'professional'])) {
            return null;
        }

        return $user;
    }
}
