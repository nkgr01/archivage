<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            // OCR
            $table->longText('ocr_text')->nullable()->after('content');
            $table->string('status')->default('pending')->after('page_count');
            $table->timestamp('processed_at')->nullable()->after('status');

            // IA
            $table->text('ai_summary')->nullable()->after('ocr_text');

            // Métadonnées
            $table->json('metadata')->nullable()->after('ai_summary');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['ocr_text', 'ai_summary', 'status', 'processed_at', 'metadata']);
        });
    }
};

