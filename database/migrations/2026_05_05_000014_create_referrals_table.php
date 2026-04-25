<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_professional_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('to_professional_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('patient_profiles')->cascadeOnDelete();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'cancelled'])->default('pending');
            $table->text('reason')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();

            $table->index(['to_professional_id', 'status']);
            $table->index(['from_professional_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
