<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consent_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patient_profiles')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('template_version');
            $table->longText('content_snapshot');
            $table->enum('status', ['pending', 'signed', 'expired', 'revoked'])->default('pending');
            $table->dateTime('signed_at')->nullable();
            $table->text('signature_data')->nullable();
            $table->string('signed_ip')->nullable();
            $table->date('expires_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['patient_id', 'status']);
            $table->index(['user_id', 'expires_at', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consent_forms');
    }
};
