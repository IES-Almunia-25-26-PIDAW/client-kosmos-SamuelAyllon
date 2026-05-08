<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offered_consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professional_profile_id')->constrained('professional_profiles')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('duration_minutes')->default(50);
            $table->decimal('price', 8, 2)->nullable();
            $table->string('color', 7)->nullable();
            $table->boolean('is_active')->default(true);
            $table->enum('modality', ['in_person', 'video_call', 'both'])->default('both');
            $table->timestamps();

            $table->index(['professional_profile_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offered_consultations');
    }
};
