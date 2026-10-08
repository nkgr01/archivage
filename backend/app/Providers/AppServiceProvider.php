<?php

/**
 * Description : AppServiceProvider pour ArchiveSafe.
 * Ce provider enregistre les bindings des interfaces dans le container Laravel,
 * permettant l'injection de dépendances flexible pour l'OCR et l'IA.
 */

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\OCRServiceInterface;
use App\Services\OCR\TesseractOCRService;
use App\Contracts\AIServiceInterface;
use App\Services\AI\GeminiAIService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Enregistre les services dans le container.
     */
    public function register(): void
    {
        // Binding de l'interface OCR vers l'implémentation Tesseract
        $this->app->bind(OCRServiceInterface::class, TesseractOCRService::class);

        // Binding de l'interface AI vers l'implémentation Gemini
        $this->app->bind(AIServiceInterface::class, GeminiAIService::class);
    }

    /**
     * Déclenche les services après le boot de l'application.
     */
    public function boot(): void
    {
        //
    }
}
