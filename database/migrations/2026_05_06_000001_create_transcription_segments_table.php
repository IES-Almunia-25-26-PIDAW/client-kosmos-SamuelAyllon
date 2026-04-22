<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transcription_segments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_recording_id')->constrained()->cascadeOnDelete();
            $table->foreignId('speaker_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('text');
            $table->unsignedInteger('position');
            $table->unsignedBigInteger('started_at_ms');
            $table->unsignedBigInteger('ended_at_ms');
            $table->timestamps();

            $table->unique(['session_recording_id', 'speaker_user_id', 'position']);
            $table->index(['session_recording_id', 'started_at_ms']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transcription_segments');
    }
};
