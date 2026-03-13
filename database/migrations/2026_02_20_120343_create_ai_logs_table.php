<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();

            // Tipo de acción: summary, update, plan_day
            $table->enum('action_type', ['summary', 'update', 'plan_day']);

            // Contexto enviado a la IA (JSON)
            $table->json('input_context')->nullable();

            // Respuesta generada por la IA
            $table->text('output_text');

            $table->timestamp('created_at')->useCurrent();

            // Índices
            $table->index('user_id');
            $table->index('project_id');
            $table->index('action_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_logs');
    }
};
