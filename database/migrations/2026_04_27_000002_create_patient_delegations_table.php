<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_delegations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_professional_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('to_professional_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('workspace_id')->nullable()->constrained()->nullOnDelete();
            $table->text('reason')->nullable();
            $table->timestamp('delegated_at');
            $table->timestamps();

            $table->index(['patient_profile_id', 'delegated_at']);
            $table->index('to_professional_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_delegations');
    }
};
