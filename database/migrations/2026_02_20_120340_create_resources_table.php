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
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            
            $table->string('name');
            $table->text('description')->nullable();
            
            // URL del recurso (artículo, video, documento, etc.)
            $table->string('url')->nullable();
            
            // Type: link, document, video, image, other
            $table->enum('type', ['link', 'document', 'video', 'image', 'other'])->default('link');
            
            // Timestamp de última modificación por usuario
            $table->timestamp('user_modified_at')->nullable();
            
            $table->timestamps();
            
            // Índices
            $table->index('user_id');
            $table->index('project_id');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};