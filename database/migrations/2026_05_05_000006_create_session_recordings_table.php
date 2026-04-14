<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained()->cascadeOnDelete();
            $table->string('audio_path')->nullable();
            $table->longText('transcription')->nullable();
            $table->text('ai_summary')->nullable();
            $table->enum('transcription_status', ['pending', 'processing', 'completed', 'failed'])
                ->default('pending');
            $table->timestamp('summarized_at')->nullable();
            $table->string('language', 10)->default('es');
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_recordings');
    }
};
