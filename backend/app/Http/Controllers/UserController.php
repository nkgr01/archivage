<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    /**
     * Crée un nouvel utilisateur.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,user',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user
        ], Response::HTTP_CREATED);
    }

    /**
     * Liste tous les utilisateurs.
     */
    public function index()
    {
        return response()->json([
            'users' => User::select('id', 'name', 'email', 'role', 'created_at')->get()
        ]);
    }

    /**
     * Affiche les détails d'un utilisateur.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Met à jour un utilisateur (nom, email, rôle).
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|string|in:admin,user',
        ]);

        $user = User::findOrFail($id);
        $user->update($request->only(['name', 'email', 'role']));

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user
        ]);
    }

    /**
     * Supprime un utilisateur.
     */
    public function destroy($id)
    {
        // Empêcher la suppression de soi-même
        if ($id == auth()->id()) {
            return response()->json(['message' => 'Vous ne pouvez pas vous supprimer vous-même'], Response::HTTP_FORBIDDEN);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}
