<?php

/**
 * Description : RolesMiddleware pour ArchiveSafe.
 * Ce middleware restreint l'accès à certaines routes en fonction du rôle de l'utilisateur.
 * Il permet de définir des accès spécifiques (ex: 'admin' pour la configuration système).
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RolesMiddleware
{
    /**
     * Gère la requête entrante en vérifiant le rôle de l'utilisateur.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles Liste des rôles autorisés pour cette route.
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // Vérification si l'utilisateur est authentifié
        if (!$user) {
            return response()->json([
                'message' => 'Non authentifié.',
                'error' => 'Unauthenticated'
            ], 401);
        }

        /**
         * Note technique : 
         * On suppose ici que le modèle User possède un attribut 'role'.
         * Dans une implémentation complète, on utiliserait Spatie Laravel Permissions.
         */
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Accès refusé. Vous n\'avez pas les privilèges nécessaires.',
                'error' => 'Forbidden'
            ], 403);
        }

        return $next($request);
    }
}
