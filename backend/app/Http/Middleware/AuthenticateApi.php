<?php

/**
 * Description : Middleware d'authentification pour l'API ArchiveSafe.
 * Ce middleware assure que l'utilisateur est authentifié via un token 
 * Sanctum avant d'accéder aux ressources protégées.
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApi
{
    /**
     * Gère la requête entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérification si l'utilisateur est authentifié via le guard 'sanctum'
        if (!Auth::guard('sanctum')->check()) {
            return response()->json([
                'message' => 'Non authentifié ou token invalide.',
                'error' => 'Unauthenticated'
            ], 401);
        }

        return $next($request);
    }
}
