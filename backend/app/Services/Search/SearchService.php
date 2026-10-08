<?php

/**
 * Description : SearchService pour ArchiveSafe.
 * Ce service gère la recherche plein texte (Full-Text Search) dans les documents.
 * Il utilise les capacités de MySQL MATCH() AGAINST() pour trouver des documents 
 * en se basant sur le titre et le contenu extrait par l'OCR.
 */

namespace App\Services\Search;

use App\Models\Document;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class SearchService
{
    /**
     * Effectue une recherche plein texte sur les documents de l'utilisateur.
     *
     * @param string $query La chaîne de recherche.
     * @param int $perPage Nombre de résultats par page.
     * @return LengthAwarePaginator
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        // On récupère l'ID de l'utilisateur connecté pour restreindre la recherche
        $userId = Auth::id();

        // Utilisation de MySQL Full-Text Search sur les colonnes 'title' et 'content'
        // Note: Pour que cela fonctionne, un index FULLTEXT doit être créé sur ces colonnes dans la migration
        $documents = Document::where('user_id', $userId)
            ->whereRaw(
                "MATCH(title, content) AGAINST(? IN NATURAL LANGUAGE MODE)", 
                [$query]
            )
            ->latest()
            ->paginate($perPage);

        return $documents;
    }

    /**
     * Recherche avancée permettant de filtrer par mots-clés obligatoires.
     * 
     * @param string $query
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function advancedSearch(string $query, int $perPage = 15): LengthAwarePaginator
    {
        $userId = Auth::id();

        // Mode BOOLEAN pour permettre l'utilisation d'opérateurs (ex: +mot obligatoire)
        $documents = Document::where('user_id', $userId)
            ->whereRaw(
                "MATCH(title, content) AGAINST(? IN BOOLEAN MODE)", 
                [$query]
            )
            ->latest()
            ->paginate($perPage);

        return $documents;
    }
}
