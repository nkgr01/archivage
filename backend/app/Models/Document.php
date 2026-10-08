<?php

/**
 * Description : Modèle Document pour ArchiveSafe.
 * Ce modèle représente un document importé ou consommé, son contenu OCR
 * et gère les relations de propriété ainsi que le soft-delete.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Les attributs assignables en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'checksum',
        'mime_type',
        'page_count',
        'filename',
        'archive_filename',
        'original_filename',
        'file_path',
        'file_size',
        'ocr_text',
        'ai_summary',
        'metadata',
        'status',
        'processed_at',
    ];

        protected $casts = [
        'metadata' => 'array',
        'processed_at' => 'datetime',
    ];

    /**
     * Relation : Un document appartient à un utilisateur (propriétaire).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
