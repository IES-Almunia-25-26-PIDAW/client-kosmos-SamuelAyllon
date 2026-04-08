<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('consulting_session_id')->nullable()->constrained()->nullOnDelete();
            $table->text('content');
            $table->enum('type', ['quick_note', 'session_note', 'observation', 'followup'])->default('quick_note');
            $table->boolean('is_ai_generated')->default(false);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['patient_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
