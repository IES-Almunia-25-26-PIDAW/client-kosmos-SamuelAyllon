<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kosmo_briefings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('consulting_session_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('type', ['daily', 'pre_session', 'post_session', 'weekly', 'nudge']);
            $table->json('content');
            $table->boolean('is_read')->default(false);
            $table->date('for_date')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'type', 'is_read']);
            $table->index(['patient_id', 'type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kosmo_briefings');
    }
};
