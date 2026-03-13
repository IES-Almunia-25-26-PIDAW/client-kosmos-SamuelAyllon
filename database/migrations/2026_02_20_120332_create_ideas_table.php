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
        Schema::create('ideas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();

            $table->string('name');
            $table->text('description')->nullable();
            
            // Priority: low, medium, high
            $table->enum('priority', ['low', 'medium', 'high'])->default('low');
            
            // Status: active, resolved
            $table->enum('status', ['active', 'resolved'])->default('active');
            
            // Source: manual, voice, ai_suggestion
            $table->enum('source', ['manual', 'voice', 'ai_suggestion'])->default('manual');
            
            // Timestamp de última modificación por usuario
            $table->timestamp('user_modified_at')->nullable();
            
            // Soft deletes para recuperar ideas
            $table->softDeletes();
            
            $table->timestamps();
            
            // Índices
            $table->index('user_id');
            $table->index('status');
            $table->index('priority');
            $table->index('source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ideas');
    }
};